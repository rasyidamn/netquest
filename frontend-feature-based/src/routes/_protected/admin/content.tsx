import { createFileRoute, Link } from '@tanstack/react-router'
import { BookOpen, Plus, ChevronDown, ChevronRight, GripVertical, FileText, CheckCircle, XCircle } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { moduleApi } from '@/feature/module/api/moduleApi'
import { useState } from 'react'
import clsx from 'clsx'

export const Route = createFileRoute('/_protected/admin/content')({
  component: AdminContentPage,
})

function AdminContentPage() {
  const { data: modulesResponse, isLoading } = useQuery({
    queryKey: ['admin-modules'],
    queryFn: moduleApi.getModules,
  })

  const modules = modulesResponse?.data || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-base-200 pb-4">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-black text-base-content">Manajemen Konten</h1>
        </div>
        <button className="btn btn-primary">
          <Plus className="w-5 h-5" />
          Tambah Modul
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-12">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : (
        <div className="space-y-4">
          {modules.map((mod) => (
            <ModuleAccordion key={mod.id} module={mod} />
          ))}
          {modules.length === 0 && (
            <div className="text-center py-12 bg-base-100 rounded-xl border border-base-200 border-dashed">
              <p className="text-base-content/60">Belum ada modul yang dibuat.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ModuleAccordion({ module }: { module: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: lessonsResponse, isLoading: isLoadingLessons } = useQuery({
    queryKey: ['admin-lessons', module.id],
    queryFn: () => moduleApi.getLessons(module.id),
    enabled: isOpen,
  })

  const { mutate: togglePublish } = useMutation({
    mutationFn: () => moduleApi.updateModule({ 
      id: module.id, 
      data: { isPublished: !module.isPublished } 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-modules'] })
    }
  })

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
          <button className="cursor-grab text-base-content/40 hover:text-base-content active:cursor-grabbing">
            <GripVertical className="w-5 h-5" />
          </button>
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold text-sm">
            {module.sequence}
          </div>
          <div>
            <h3 className="font-bold text-lg">{module.title}</h3>
            <div className="flex gap-2 mt-1">
              {module.isPublished ? (
                <span className="badge badge-success badge-sm gap-1"><CheckCircle className="w-3 h-3"/> Published</span>
              ) : (
                <span className="badge badge-warning badge-sm gap-1"><XCircle className="w-3 h-3"/> Draft</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            className="btn btn-sm btn-ghost"
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
                  <div key={lesson.id} className="flex items-center justify-between p-3 bg-base-100 border border-base-200 rounded-lg hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <button className="cursor-grab text-base-content/30 hover:text-base-content">
                        <GripVertical className="w-4 h-4" />
                      </button>
                      <div className="w-6 h-6 rounded bg-base-200 flex items-center justify-center text-xs font-bold text-base-content/70">
                        {lesson.lessonSequence}
                      </div>
                      <FileText className={clsx("w-4 h-4", lesson.type === 'QUIZ' ? "text-secondary" : "text-info")} />
                      <span className="font-medium text-sm">{lesson.title}</span>
                      <span className="badge badge-ghost badge-sm text-[10px] uppercase">{lesson.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {lesson.isPublished ? (
                         <span className="badge badge-success badge-xs">Pub</span>
                      ) : (
                         <span className="badge badge-warning badge-xs">Draf</span>
                      )}
                      <Link 
                        to="/admin/lessons/$lessonId"
                        params={{ lessonId: lesson.id }} 
                        className="btn btn-xs btn-outline"
                      >
                        Edit Materi
                      </Link>
                    </div>
                  </div>
                ))}
                
                <button className="btn btn-sm btn-dashed w-full mt-2 border-base-300 text-base-content/70 hover:text-primary hover:border-primary">
                  <Plus className="w-4 h-4" /> Tambah Misi Baru
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
