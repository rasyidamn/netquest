import { createFileRoute, Link } from '@tanstack/react-router'
import { BookOpen, Plus, ChevronDown, ChevronRight, FileText, CheckCircle, XCircle, Edit, Trash2, Star } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { moduleApi } from '@/feature/module/api/moduleApi'
import { lessonApi } from '@/feature/module/api/lessonApi'
import { useState, useMemo } from 'react'
import clsx from 'clsx'
import { ModuleModal } from './-components/ModuleModal'
import { LessonModal } from './-components/LessonModal'
import toast from 'react-hot-toast'

export const Route = createFileRoute('/_protected/admin/content')({
  component: AdminContentPage,
})

function AdminContentPage() {
  const queryClient = useQueryClient()
  const { data: modulesResponse, isLoading } = useQuery({
    queryKey: ['admin-modules'],
    queryFn: moduleApi.getModules,
  })

  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false)
  
  const createModuleMutation = useMutation({
    mutationFn: (data: any) => moduleApi.createModule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-modules'] })
      toast.success("Modul berhasil dibuat!")
      setIsModuleModalOpen(false)
    },
    onError: (error: any) => toast.error(error.message)
  })

  const modules = modulesResponse?.data || []

  const usedSequences = useMemo(() => {
    return modulesResponse?.data?.map((m: any) => m.sequence) || []
  }, [modulesResponse?.data])

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-base-content flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" />
            Manajemen Konten
          </h1>
          <p className="text-base-content/60 mt-1">Kelola modul dan materi pembelajaran</p>
        </div>
        <button 
          className="btn btn-primary shadow-lg hover:shadow-primary/30"
          onClick={() => setIsModuleModalOpen(true)}
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Tambah Modul</span>
        </button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : (
          modules.map((mod) => (
            <ModuleAccordion key={mod.id} module={mod} usedSequences={usedSequences} />
          ))
        )}
        {modules.length === 0 && !isLoading && (
          <div className="text-center py-12 bg-base-100 rounded-xl border border-base-200 border-dashed">
            <p className="text-base-content/60">Belum ada modul yang dibuat.</p>
          </div>
        )}
      </div>
      
      <ModuleModal 
        isOpen={isModuleModalOpen}
        onClose={() => setIsModuleModalOpen(false)}
        onSave={(data) => createModuleMutation.mutate(data)}
        isPending={createModuleMutation.isPending}
        usedSequences={usedSequences}
      />
    </div>
  )
}

function ModuleAccordion({ module, usedSequences }: { module: any, usedSequences: number[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState<any | null>(null)
  const queryClient = useQueryClient()

  const { data: lessonsResponse, isLoading: isLoadingLessons } = useQuery({
    queryKey: ['admin-lessons', module.id],
    queryFn: () => moduleApi.getLessons(module.id),
    enabled: isOpen,
  })

  const usedLessonSequences = useMemo(() => {
    return lessonsResponse?.data?.map((l: any) => l.lessonSequence) || []
  }, [lessonsResponse?.data])

  const { mutate: togglePublish } = useMutation({
    mutationFn: () => moduleApi.updateModule({ 
      id: module.id, 
      data: { isPublished: !module.isPublished } 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-modules'] })
    }
  })
  
  const updateModuleMutation = useMutation({
    mutationFn: (data: any) => moduleApi.updateModule({ id: module.id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-modules'] })
      toast.success("Modul diperbarui!")
      setIsEditModalOpen(false)
    },
    onError: (error: any) => toast.error(error.message)
  })

  const deleteModuleMutation = useMutation({
    mutationFn: () => moduleApi.deleteModule(module.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-modules'] })
      toast.success("Modul beserta isinya berhasil dihapus!")
    },
    onError: (error: any) => toast.error(error.message)
  })

  const createLessonMutation = useMutation({
    mutationFn: (data: any) => moduleApi.createLesson(module.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-lessons', module.id] })
      toast.success("Misi berhasil ditambahkan!")
      setIsLessonModalOpen(false)
    },
    onError: (error: any) => toast.error(error.message)
  })

  const updateLessonMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => lessonApi.updateLesson({ id, data }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-lessons', module.id] })
      queryClient.invalidateQueries({ queryKey: ['lesson', variables.id] })
      toast.success("Misi berhasil diperbarui!")
      setIsLessonModalOpen(false)
      setSelectedLesson(null)
    },
    onError: (error: any) => toast.error(error.message)
  })

  const deleteLessonMutation = useMutation({
    mutationFn: (lessonId: string) => lessonApi.deleteLesson(lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-lessons', module.id] })
      toast.success("Misi berhasil dihapus!")
    },
    onError: (error: any) => toast.error(error.message)
  })

  const handleDeleteModule = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Hapus modul "${module.title}" beserta seluruh misinya?`)) {
      deleteModuleMutation.mutate();
    }
  }

  const handleDeleteLesson = (lessonId: string, title: string) => {
    if (window.confirm(`Hapus misi "${title}"?`)) {
      deleteLessonMutation.mutate(lessonId);
    }
  }

  const openEditLesson = (lesson: any) => {
    setSelectedLesson(lesson);
    setIsLessonModalOpen(true);
  }

  const handleSaveLesson = (data: any) => {
    if (selectedLesson) {
      updateLessonMutation.mutate({ id: selectedLesson.id, data })
    } else {
      createLessonMutation.mutate(data)
    }
  }

  const handleCloseLessonModal = () => {
    setIsLessonModalOpen(false)
    setSelectedLesson(null)
  }

  const lessons = lessonsResponse?.data || []

  return (
    <div className="bg-base-100 rounded-xl border border-base-200 overflow-hidden shadow-sm transition-all">
      {/* Module Header */}
      <div 
        className={clsx(
          "flex items-center justify-between p-4 cursor-pointer hover:bg-base-200/50 transition-colors",
          isOpen ? "bg-base-200/30" : ""
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold text-sm">
            {module.sequence}
          </div>
          <div>
            <h3 className="font-bold text-lg">{module.title}</h3>
            {module.description && (
              <p className="text-sm text-base-content/70 mt-1 max-w-xl truncate" title={module.description}>
                {module.description}
              </p>
            )}
            <div className="flex gap-2 mt-2">
              {module.isPublished ? (
                <span className="badge badge-success badge-sm gap-1"><CheckCircle className="w-3 h-3"/> Published</span>
              ) : (
                <span className="badge badge-warning badge-sm gap-1"><XCircle className="w-3 h-3"/> Draft</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button 
            className="btn btn-sm btn-ghost text-base-content/60 hover:text-primary"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditModalOpen(true);
            }}
            title="Edit Modul"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            className="btn btn-sm btn-ghost text-base-content/60 hover:text-error"
            onClick={handleDeleteModule}
            title="Hapus Modul"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button 
            className="btn btn-sm btn-outline"
            onClick={(e) => {
              e.stopPropagation();
              togglePublish();
            }}
          >
            {module.isPublished ? "Set to Draft" : "Publish"}
          </button>
          {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </div>
      </div>

      {/* Module Content (Lessons) */}
      {isOpen && (
        <div className="p-4 pt-0 border-t border-base-200/50 bg-base-200/10">
          <div className="pl-12 mt-4 space-y-2">
            {isLoadingLessons ? (
              <div className="p-4 text-center">
                <span className="loading loading-dots loading-sm text-primary"></span>
              </div>
            ) : (
              <>
                {lessons.map((lesson: any) => (
                  <div key={lesson.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-base-100 border border-base-200 rounded-lg hover:border-primary/30 transition-colors gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-6 h-6 rounded bg-base-200 flex items-center justify-center text-xs font-bold text-base-content/70 shrink-0">
                        {lesson.lessonSequence}
                      </div>
                      <FileText className={clsx("w-4 h-4 shrink-0", lesson.type === 'QUIZ' ? "text-secondary" : "text-info")} />
                      <span className="font-medium text-sm truncate">{lesson.title}</span>
                      <span className="badge badge-ghost badge-sm text-[10px] uppercase shrink-0">{lesson.type}</span>
                      <span className="badge badge-outline badge-sm text-[10px] gap-1 border-warning/50 text-warning shrink-0 whitespace-nowrap px-2">
                        <Star className="w-3 h-3 fill-warning shrink-0" />
                        {lesson.xpReward} XP
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {lesson.isPublished ? (
                         <span className="badge badge-success badge-sm shrink-0">Pub</span>
                      ) : (
                         <span className="badge badge-warning badge-sm shrink-0">Draf</span>
                      )}
                      <button 
                        className="btn btn-xs btn-ghost text-base-content/60 hover:text-primary px-2"
                        onClick={() => openEditLesson(lesson)}
                        title="Edit Rincian"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button 
                        className="btn btn-xs btn-ghost text-base-content/60 hover:text-error px-2"
                        onClick={() => handleDeleteLesson(lesson.id, lesson.title)}
                        title="Hapus Misi"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <Link 
                        to="/admin/lessons/$lessonId"
                        params={{ lessonId: lesson.id }} 
                        className="btn btn-xs btn-outline"
                      >
                        Edit Materi/Kuis
                      </Link>
                    </div>
                  </div>
                ))}
                
                <button 
                  className="btn btn-sm btn-dashed w-full mt-2 border-base-300 text-base-content/70 hover:text-primary hover:border-primary"
                  onClick={() => setIsLessonModalOpen(true)}
                >
                  <Plus className="w-4 h-4" /> Tambah Misi Baru
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <ModuleModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={(data) => updateModuleMutation.mutate(data)}
        initialData={module}
        isPending={updateModuleMutation.isPending}
        usedSequences={usedSequences}
      />

      <LessonModal
        isOpen={isLessonModalOpen}
        onClose={handleCloseLessonModal}
        onSave={handleSaveLesson}
        initialData={selectedLesson}
        isPending={createLessonMutation.isPending || updateLessonMutation.isPending}
        usedSequences={usedLessonSequences}
      />
    </div>
  )
}
