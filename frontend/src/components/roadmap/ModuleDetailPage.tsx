import { useCallback, useMemo } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { moduleApi } from "@/api/module.api";
import { useMyProgress } from "@/hooks/progress/useMyProgress";
import { useModules } from "@/hooks/module/useModules";
import {
   IconLock,
   IconRocket,
   IconTrophy,
   IconArrowLeft,
   IconBook2,
   IconCheck,
   IconPlayerPlay,
   IconEye,
   IconMapRoute,
   IconBolt,
   IconPuzzle,
	IconTargetArrow
} from "@tabler/icons-react";
import type { LessonType } from "@/types/api.type";
import ModuleDetailPageIllustration from "@/public/programming-animate.svg?react"

type LessonStatus = "LOCKED" | "ACTIVE" | "COMPLETED";

function ModuleDetailSkeleton() {
   return (
      <div className="flex flex-col gap-8 py-8 w-full max-w-4xl mx-auto px-4">
         {/* Skeleton Header */}
         <div className="card bg-base-200/30 backdrop-blur-xl border border-white/5 shadow-lg overflow-hidden">
            <div className="card-body p-8">
               <div className="skeleton h-4 w-40 mb-6 rounded-full bg-base-300/50" />
               <div className="skeleton h-10 w-3/4 rounded-xl bg-base-300/40 mb-4" />
               <div className="skeleton h-5 w-48 rounded-md bg-base-300/30" />
            </div>
         </div>
         {/* Skeleton Timeline */}
         <div className="flex flex-col gap-8 px-4">
            {[1, 2, 3].map((i) => (
               <div key={i} className="flex gap-6 items-center">
                  <div className="skeleton size-14 rounded-full shrink-0 bg-base-300/40 shadow-[0_0_15px_rgba(255,255,255,0.05)]" />
                  <div className="skeleton h-32 w-full rounded-2xl bg-base-300/30" />
               </div>
            ))}
         </div>
      </div>
   );
}

function ModuleDetailError({ message }: { message: string }) {
   return (
      <div className="flex flex-col items-center justify-center py-20 text-center max-w-2xl mx-auto">
         <div className="relative group mb-6">
            <div className="absolute inset-0 bg-error/20 rounded-full blur-2xl transition-transform duration-700 group-hover:scale-150" />
            <div className="relative bg-base-200/50 backdrop-blur-xl border border-error/20 p-8 rounded-full shadow-[0_0_30px_rgba(var(--color-error),0.15)]">
               <IconLock size={56} className="text-error" />
            </div>
         </div>
         <h2 className="text-error text-3xl font-black tracking-tight drop-shadow-sm">Akses Ditolak</h2>
         <p className="text-base-content/60 mt-3 text-lg">{message}</p>
      </div>
   );
}

function ModuleDetailEmpty() {
   return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
         <IconBook2 size={80} className="text-base-content/10 mb-6 drop-shadow-xl" />
         <h3 className="text-3xl font-black text-base-content/70">Arsip Kosong</h3>
         <p className="text-base-content/50 mt-3 text-lg">
            Sistem belum mendeteksi adanya materi di sektor ini.
         </p>
      </div>
   );
}

function ModuleNotFound() {
   return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
         <div className="relative mb-6">
            <div className="absolute inset-0 bg-warning/10 rounded-full blur-xl" />
            <IconMapRoute size={80} className="text-base-content/20 relative z-10 drop-shadow-xl" />
         </div>
         <h3 className="text-3xl font-black text-base-content/70">Sektor Tidak Ditemukan</h3>
         <p className="text-base-content/50 mt-3 text-lg max-w-md mx-auto">
            Koordinat modul yang Anda masukkan tidak terdaftar di dalam sistem Peta Belajar.
         </p>
      </div>
   );
}

function LessonCard({
   lesson,
   status,
   showTopDivider,
   isLast,
   onSelect,
   prevStatus,
   nextStatus,
}: {
   lesson: LessonType;
   status: LessonStatus;
   showTopDivider: boolean;
   isLast: boolean;
   onSelect: (lessonId: string) => void;
   prevStatus?: LessonStatus;
   nextStatus?: LessonStatus;
}) {
   const isLocked = status === "LOCKED";
   const isActive = status === "ACTIVE";
   const isCompleted = status === "COMPLETED";

   const getDividerClass = (sourceStatus?: LessonStatus, targetStatus?: LessonStatus) => {
      const baseClass = "w-1.5 md:w-2 rounded-full transition-all duration-500";
      if (sourceStatus === "COMPLETED" && targetStatus === "ACTIVE") {
         return `${baseClass} bg-gradient-to-b from-success to-primary shadow-[0_0_10px_rgba(var(--color-primary),0.3)]`;
      }
      if (sourceStatus === "COMPLETED") {
         return `${baseClass} bg-success shadow-[0_0_10px_rgba(var(--color-success),0.3)]`;
      }
      return `w-1 border-l-[4px] border-dashed border-base-300/40 ml-[-2px] md:ml-[-1.5px]`;
   };

   return (
      <li>
         {showTopDivider && <hr className={getDividerClass(prevStatus, status)} />}

         {/* Lingkaran Status (Orb) */}
         <div className="timeline-middle z-20 mx-2 md:mx-4 py-2">
            <div className="relative group">
               {isActive && (
                  <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-30 scale-150" />
               )}
               <div
                  className={`relative flex size-12 md:size-14 items-center justify-center rounded-full border-[3px] shadow-lg backdrop-blur-md transition-transform duration-300 ${
                     isActive
                        ? "bg-primary/10 text-primary border-primary shadow-[0_0_20px_rgba(var(--color-primary),0.4)] scale-110"
                        : isCompleted
                           ? "bg-success/10 text-success border-success shadow-[0_0_15px_rgba(var(--color-success),0.2)]"
                           : "bg-base-300/20 text-base-content/30 border-base-300/30"
                  }`}
               >
                  {isActive && <IconRocket size={24} className="drop-shadow-[0_0_8px_rgba(var(--color-primary),0.8)]" />}
                  {isCompleted && <IconTrophy size={24} />}
                  {isLocked && <IconLock size={20} />}
               </div>
            </div>
         </div>

         {/* Kartu Pelajaran */}
         <div className="timeline-end w-full mb-8 flex justify-start">
            <div
               className={`card w-full sm:w-[28rem] md:w-[32rem] transition-all duration-500 ease-out max-md:ml-4 group ${
                  isActive
                     ? "bg-base-200/60 backdrop-blur-xl border border-primary/40 shadow-[0_8px_30px_rgba(var(--color-primary),0.15)] hover:-translate-y-1.5 hover:shadow-[0_15px_40px_rgba(var(--color-primary),0.25)]"
                     : isCompleted
                        ? "bg-base-100/40 backdrop-blur-md border border-white/5 hover:-translate-y-1 hover:border-success/30 shadow-sm"
                        : "bg-base-300/10 border border-white/5 opacity-60 grayscale backdrop-blur-sm"
               }`}
            >
               {/* Aksen Highlight Kiri untuk Modul Aktif */}
               {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary to-secondary rounded-l-2xl" />
               )}

               <div className="card-body p-5 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                     
                     <div className="flex-1 min-w-0 space-y-3">
                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-2">
                           <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border shadow-sm backdrop-blur-md ${
                                 lesson.type === "THEORY" 
                                    ? "bg-info/10 text-info border-info/20" 
                                    : "bg-warning/10 text-warning border-warning/20"
                              }`}
                           >
                              {lesson.type === "THEORY" ? <IconBook2 size={12}/> : <IconPuzzle size={12}/>}
                              {lesson.type === "THEORY" ? "Teori" : "Kuis"}
                           </span>
                           {isCompleted && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-success/20 text-success border-0">
                                 <IconCheck size={12} stroke={3} /> Selesai
                              </span>
                           )}
                           {isActive && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-primary/20 text-primary border-0 animate-pulse">
                                 <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Target
                              </span>
                           )}
                        </div>

                        {/* Title */}
                        <h3 className={`text-xl font-black tracking-tight leading-snug line-clamp-2 ${isActive ? "text-primary drop-shadow-sm" : "text-base-content/90"}`}>
                           {lesson.title}
                        </h3>

                        {/* XP Reward Info */}
                        <div className="flex items-center gap-1.5 text-xs font-bold text-warning/80">
                           <IconBolt size={14} className="fill-warning/20" />
                           <span>+{lesson.xpReward} XP</span>
                        </div>
                     </div>

                     {/* Action Buttons */}
                     <div className="shrink-0 mt-2 sm:mt-0">
                        {isActive && (
                           <button
                              onClick={() => onSelect(lesson.id)}
                              className="btn btn-primary btn-sm md:btn-md w-full sm:w-auto shadow-[0_0_15px_rgba(var(--color-primary),0.3)] hover:scale-105 transition-transform group-hover:shadow-[0_0_25px_rgba(var(--color-primary),0.4)]"
                           >
                              <IconPlayerPlay size={18} fill="currentColor" />
                              Mulai Eksekusi
                           </button>
                        )}
                        {isCompleted && (
                           <button
                              onClick={() => onSelect(lesson.id)}
                              className="btn btn-outline btn-success border-success/30 hover:bg-success hover:text-success-content btn-sm md:btn-md w-full sm:w-auto transition-all"
                           >
                              <IconEye size={18} />
                              Arsip
                           </button>
                        )}
                        {isLocked && (
                           <button className="btn btn-sm md:btn-md w-full sm:w-auto btn-disabled opacity-50 border-0 bg-base-300/50" disabled>
                              <IconLock size={18} />
                              Terkunci
                           </button>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {!isLast && <hr className={getDividerClass(status, nextStatus)} />}
      </li>
   );
}

export function ModuleDetailPage() {
   const { moduleId } = useParams({ from: "/_authenticated/_student/roadmap/$moduleId" });
   const navigate = useNavigate();

   // ... (biarkan hook useQuery dan useMemo tetap sama seperti sebelumnya) ...
   const modulesQuery = useModules();
   const lessonsQuery = useQuery({
      queryKey: ["lessons", moduleId],
      queryFn: async () => {
         const res = await moduleApi.getLessons(moduleId);
         if (!res.success) {
            throw new Error(res.message || "Gagal mengambil daftar pelajaran");
         }
         return (res.data ?? []) as LessonType[];
      },
      enabled: !!moduleId,
   });
   const progressQuery = useMyProgress();

   const currentModule = useMemo(() => {
      if (!modulesQuery.data) return null;
      return modulesQuery.data.find((m) => m.id === moduleId) ?? null;
   }, [modulesQuery.data, moduleId]);

   const sortedLessons = useMemo(() => {
      if (!lessonsQuery.data) return [];
      return [...lessonsQuery.data].sort((a, b) => a.lessonSequence - b.lessonSequence);
   }, [lessonsQuery.data]);

   const lessonStatuses = useMemo(() => {
      const statuses = new Map<string, LessonStatus>();
      const moduleProgressList = (progressQuery.data ?? []) as unknown as Array<{
         moduleId: string;
         status: string;
         currentLessonId: string;
      }>;
      const moduleProgress = moduleProgressList.find((p) => p.moduleId === moduleId);

      if (!moduleProgress || moduleProgress.status === "LOCKED") {
         for (const lesson of sortedLessons) { statuses.set(lesson.id, "LOCKED"); }
         return statuses;
      }
      if (moduleProgress.status === "COMPLETED") {
         for (const lesson of sortedLessons) { statuses.set(lesson.id, "COMPLETED"); }
         return statuses;
      }

      const activeIndex = sortedLessons.findIndex(l => l.id === moduleProgress.currentLessonId);

      if (activeIndex === -1) {
         for (let i = 0; i < sortedLessons.length; i++) { statuses.set(sortedLessons[i].id, i === 0 ? "ACTIVE" : "LOCKED"); }
         return statuses;
      }

      for (let i = 0; i < sortedLessons.length; i++) {
         if (i < activeIndex) statuses.set(sortedLessons[i].id, "COMPLETED");
         else if (i === activeIndex) statuses.set(sortedLessons[i].id, "ACTIVE");
         else statuses.set(sortedLessons[i].id, "LOCKED");
      }
      return statuses;
   }, [sortedLessons, progressQuery.data, moduleId]);

   const handleBackToRoadmap = useCallback(() => { navigate({ to: "/roadmap" }); }, [navigate]);
   const handleSelectLesson = useCallback((lessonId: string) => { navigate({ to: "/lesson/$lessonId", params: { lessonId } }); }, [navigate]);

   const isLoading = modulesQuery.isLoading || lessonsQuery.isLoading || progressQuery.isLoading;
   const isError = modulesQuery.isError || lessonsQuery.isError || progressQuery.isError;
   const errorMessage = modulesQuery.error?.message || lessonsQuery.error?.message || progressQuery.error?.message || "Terjadi anomali saat mengakses *database* misi.";

   if (isLoading) return <ModuleDetailSkeleton />;
   if (isError) return <ModuleDetailError message={errorMessage} />;
   if (!currentModule) return <ModuleNotFound />;

   return (
      // PERUBAHAN 1: max-w-4xl diubah menjadi max-w-7xl agar lebih lebar
      <div className="relative min-h-screen max-w-7xl mx-auto px-4 sm:px-6 py-8 xl:py-12 overflow-hidden">
         {/* Ambient Glow Latar Belakang */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40rem] h-[30rem] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

         {/* Header Modul — Tetap Full Width di dalam container */}
         <div className="relative z-10 p-6 md:p-10 rounded-[2rem] bg-base-200/40 backdrop-blur-2xl border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.1)] mb-12 group overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            
            <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-6 mb-8">
               <nav className="breadcrumbs text-xs md:text-sm font-bold tracking-widest uppercase text-base-content/50">
                  <ul>
                     <li>
                        <button onClick={handleBackToRoadmap} className="hover:text-primary transition-colors hover:drop-shadow-sm flex items-center gap-1.5">
                           <IconMapRoute size={16} /> Peta
                        </button>
                     </li>
                     <li className="text-primary/80">Sektor {currentModule.sequence}</li>
                  </ul>
               </nav>
               <button onClick={handleBackToRoadmap} className="btn btn-outline border-white/10 hover:bg-base-100/50 hover:border-white/20 btn-sm gap-2 backdrop-blur-md self-start sm:self-auto">
                  <IconArrowLeft size={16} />
                  <span>Kembali</span>
               </button>
            </div>
            
            <div className="mt-4 max-w-3xl">
               <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-base-100/50 border border-white/5 shadow-inner mb-4">
                  <IconBook2 size={16} className="text-primary" />
                  <span className="text-xs font-black tracking-widest uppercase text-base-content/70">
                     Tahap {currentModule.sequence}
                  </span>
               </div>
               
               <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-br from-base-content to-base-content/50 bg-clip-text text-transparent drop-shadow-sm mb-4 leading-tight">
                  {currentModule.title}
               </h1>
            </div>
         </div>

         {/* PERUBAHAN 2: Layout Grid 2 Kolom (Kiri Timeline, Kanan Ilustrasi) */}
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            
            {/* Kolom Kiri: Daftar Pelajaran (Membagi porsi 7 kolom dari 12) */}
            <div className="lg:col-span-7 xl:col-span-8">
               {sortedLessons.length === 0 ? (
                  <ModuleDetailEmpty />
               ) : (
                  <ul className="timeline max-md:timeline-compact timeline-vertical w-full">
                     {sortedLessons.map((lesson, index) => {
                        const currentStatus = lessonStatuses.get(lesson.id) ?? "LOCKED";
                        const prevStatus = index > 0 ? lessonStatuses.get(sortedLessons[index - 1].id) ?? "LOCKED" : undefined;
                        const nextStatus = index < sortedLessons.length - 1 ? lessonStatuses.get(sortedLessons[index + 1].id) ?? "LOCKED" : undefined;

                        return (
                           <LessonCard
                              key={lesson.id}
                              lesson={lesson}
                              status={currentStatus}
                              prevStatus={prevStatus}
                              nextStatus={nextStatus}
                              showTopDivider={index > 0}
                              isLast={index === sortedLessons.length - 1}
                              onSelect={handleSelectLesson}
                           />
                        );
                     })}
                  </ul>
               )}
            </div>

            {/* Kolom Kanan: Maskot / Ilustrasi Karakter (Membagi porsi 5 kolom dari 12) */}
            <div className="hidden lg:flex lg:col-span-5 xl:col-span-4 sticky top-32 justify-center">
               <div className="relative w-full max-w-[320px] aspect-[3/4] flex flex-col items-center justify-center">
                  
                  {/* Efek Glow di belakang karakter */}
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-secondary/5 rounded-[3rem] blur-xl opacity-60 animate-pulse" />
                  
                  {/* Placeholder SVG Karakter (Silakan ganti dengan file SVG/IMG karakter NetQuest Anda) */}
                  <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-6 bg-base-200/30 backdrop-blur-md rounded-[3rem] border border-white/10 shadow-2xl transition-transform duration-500 hover:-translate-y-4 hover:shadow-primary/20">
                     
                     <ModuleDetailPageIllustration className="animated size-80" />

                     <div className=" text-center bg-base-100/50 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                        <p className="text-sm font-bold text-base-content/80">"Selesaikan Lesson dan Kuasai Ilmu Jaringan Komputer"</p>
                     </div>
                  </div>

               </div>
            </div>

         </div>
      </div>
   );
}