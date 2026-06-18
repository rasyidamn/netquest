import { useRoadmap } from "@/hooks/roadmap/useRoadmap";
import { useRouter } from "@tanstack/react-router";
import {
   IconLock,
   IconRocket,
   IconTrophy,
   IconBook2,
   IconArrowRight,
   IconCheck,
} from "@tabler/icons-react";
import type { RoadmapStatus } from "@/types/api.type";

function TimelineSkeleton() {
   return (
      <div className="flex flex-col gap-8 py-8 w-full max-w-3xl mx-auto px-4">
         {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-6 w-full">
               <div className="skeleton h-16 w-16 shrink-0 rounded-full" />
               <div className="skeleton h-40 w-full rounded-2xl" />
            </div>
         ))}
      </div>
   );
}

function TimelineError() {
   return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
         <div className="bg-error/10 p-6 rounded-full mb-4">
            <IconLock size={48} className="text-error" />
         </div>
         <p className="text-error text-xl font-bold">Terputus dari Server</p>
         <p className="text-base-content/60 mt-2 max-w-md">
            Kami tidak dapat memuat peta perjalanan Anda saat ini. Periksa koneksi internet dan coba lagi.
         </p>
      </div>
   );
}

// Helper untuk visual HR (Garis)
function getHrClass(status: RoadmapStatus, isNextLocked?: boolean): string {
   if (status === "COMPLETED") return "bg-success h-1.5";
   if (status === "ACTIVE" && !isNextLocked) return "bg-primary h-1.5";
   // Garis putus-putus untuk rute yang terkunci
   return "bg-transparent border-l-[6px] border-dashed border-base-300 ml-[-3px]"; 
}

export function RoadmapTimeline() {
   const { data: items, isLoading, isError } = useRoadmap();
   const router = useRouter();

   if (isLoading) return <TimelineSkeleton />;
   if (isError) return <TimelineError />;
   if (!items || items.length === 0) {
      return (
         <div className="flex flex-col items-center justify-center py-20 text-center">
            <IconBook2 size={64} className="text-base-content/20 mb-4" />
            <h3 className="text-2xl font-bold text-base-content/70">Peta Masih Kosong</h3>
            <p className="text-base-content/50 mt-2">Belum ada *quest* yang tersedia untuk Anda.</p>
         </div>
      );
   }

   return (
      <div className="w-full max-w-4xl mx-auto px-2 sm:px-6 py-8">
         {/* max-md:timeline-compact akan meratakan timeline ke kiri di HP, dan di tengah saat di desktop */}
         <ul className="timeline max-md:timeline-compact timeline-snap-icon timeline-vertical">
            {items.map((item, index) => {
               const isLast = index === items.length - 1;
               const nextStatus = !isLast ? items[index + 1].status : undefined;
               const isLocked = item.status === "LOCKED";
               const isActive = item.status === "ACTIVE";
               const isCompleted = item.status === "COMPLETED";

               return (
                  <li key={item.module.id}>
                     {index > 0 && (
                        <hr className={getHrClass(items[index - 1].status, isLocked)} />
                     )}

                     {/* Lingkaran Ikon Utama */}
                     <div className="timeline-middle">
                        <div
                           className={`flex size-12 md:size-16 items-center justify-center rounded-full border-4 shadow-sm z-10 ${
                              isActive
                                 ? "bg-primary text-primary-content border-primary-content ring-4 ring-primary/30 animate-bounce-slow"
                                 : isCompleted
                                    ? "bg-success text-success-content border-success-content"
                                    : "bg-base-200 text-base-content/40 border-base-300"
                           }`}
                        >
                           {isActive && <IconRocket size={28} />}
                           {isCompleted && <IconTrophy size={28} />}
                           {isLocked && <IconLock size={28} />}
                        </div>
                     </div>

						{/* Kontainer Kartu (Kiri/Kanan bergantian di Desktop, selalu Kanan di HP) */}
						<div 
							className={`timeline-${index % 2 === 0 ? "start" : "end"} w-full mb-10 flex ${
								index % 2 === 0 ? "justify-start md:justify-end" : "justify-start"
							}`}
						>
							<div
								className={`card w-[85vw] sm:w-[24rem] md:w-[26rem] lg:w-[30rem] shadow-xl transition-all duration-300 text-left
									max-md:ml-5
									${index % 2 === 0 ? "md:mr-8" : "md:ml-8"}
									${
										isActive
											? "bg-gradient-to-br from-base-100 to-primary/5 border-2 border-primary shadow-primary/20 scale-100 hover:scale-[1.02] hover:shadow-primary/30"
											: isCompleted
												? "bg-base-100 border border-success/30 opacity-95 hover:opacity-100"
												: "bg-base-200/50 border-2 border-dashed border-base-300 opacity-60 grayscale-[50%]"
									}`}
							>
								<div className="card-body p-6 md:p-8">
									{/* Label Atas & Badge */}
									<div className="flex flex-wrap items-center gap-2 mb-2 justify-start">
										<span className="text-sm font-black tracking-widest uppercase opacity-50">
											Tahap {item.module.sequence}
										</span>
										{isActive && <span className="badge badge-primary badge-sm animate-pulse">Sedang Berlangsung</span>}
										{isCompleted && <span className="badge badge-success badge-sm gap-1"><IconCheck size={12}/> Selesai</span>}
									</div>

									{/* Judul Modul */}
									<h3 className={`card-title text-2xl md:text-3xl font-extrabold ${isActive ? "text-primary" : ""}`}>
										{item.module.title}
									</h3>

									{/* Info Pelajaran */}
									<p className="text-base-content/70 mt-2 font-medium flex items-center gap-2">
										<IconBook2 size={20} className="opacity-70" />
										{item.lessons.length} Pelajaran tersedia
									</p>

									{/* Card Actions (Tombol) */}
									{!isLocked && (
										<div className="card-actions mt-6 justify-start">
											<button
												onClick={() => router.navigate({ to: `/roadmap/${item.module.id}` })}
												className={`btn ${
													isActive ? "btn-primary shadow-lg shadow-primary/30" : "btn-outline btn-success"
												}`}
											>
												{isActive ? "Mulai Belajar" : "Lihat Ulang"}
												{isActive && <IconArrowRight size={20} />}
											</button>
										</div>
									)}
								</div>
							</div>
						</div>

                     {!isLast && (
                        <hr className={getHrClass(item.status, nextStatus === "LOCKED")} />
                     )}
                  </li>
               );
            })}
         </ul>
      </div>
   );
}