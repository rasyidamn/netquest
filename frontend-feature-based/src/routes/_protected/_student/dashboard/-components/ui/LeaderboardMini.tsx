import type { LeaderboardEntry } from "@/feature/leaderboard/schema/leaderboard.schema";
import { cn } from "@/utils/cn";
import { getCurrentRank } from "@/utils/rank.util";
import { CrownIcon, FlameIcon, MedalIcon } from "lucide-react";



interface LeaderboardMiniProps {
   isLoading?: boolean;
   entries?: LeaderboardEntry; // KEMBALI SEPERTI SEMULA: Tanpa [] karena sudah bawaan dari type-nya
   currentUserName?: string;
}

function getRankIcon(rank: number) {
   if (rank === 1) return <CrownIcon size={22} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />;
   if (rank === 2) return <MedalIcon size={22} className="text-slate-300 drop-shadow-[0_0_5px_rgba(203,213,225,0.5)]" />;
   if (rank === 3) return <MedalIcon size={22} className="text-amber-600 drop-shadow-[0_0_5px_rgba(217,119,6,0.5)]" />;
   return <span className="w-6 text-center text-sm font-black text-base-content/30">{rank}</span>;
}

function LeaderboardSkeleton() {
   return (
      <div className="card bg-base-200/30 backdrop-blur-xl border border-white/5 shadow-lg overflow-hidden">
         <div className="card-body p-6">
            <div className="flex items-center gap-3 mb-6">
               <div className="skeleton size-6 rounded-md bg-base-300/50" />
               <div className="skeleton h-5 w-32 rounded-md bg-base-300/50" />
            </div>
            <div className="space-y-3">
               {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex gap-4 items-center p-2">
                     <div className="skeleton size-8 rounded-full bg-base-300/50 shrink-0" />
                     <div className="skeleton h-10 w-full rounded-lg bg-base-300/30" />
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
}

export function LeaderboardMini({ isLoading, entries, currentUserName }: LeaderboardMiniProps) {
   if (isLoading) {
      return <LeaderboardSkeleton />;
   }

   if (!entries || entries.length === 0) {
      return null;
   }

   return (
      <div className="card relative overflow-hidden bg-base-200/40 backdrop-blur-xl border border-white/10 shadow-lg group h-full">
         {/* Aksen Cahaya Ambient (Kanan Atas) */}
         <div className="absolute -top-16 -right-16 w-32 h-32 bg-warning/10 rounded-full blur-2xl pointer-events-none transition-transform duration-700 group-hover:scale-150" />

         <div className="card-body p-6 relative z-10">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-base-content/60 flex items-center gap-2">
                  <FlameIcon size={18} className="text-warning/80 animate-pulse" />
                  Papan Peringkat
               </h3>
            </div>
            
            <div className="space-y-2">
               {entries.map((entry) => {
                  const isCurrentUser = entry.name === currentUserName;
                  const entryLevel = getCurrentRank(entry.xp).level;
                  const isTopThree = entry.rank <= 3;
                  
                  return (
                     <div
                        key={entry.rank}
                        className={cn(
                           "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-300",
                           isCurrentUser 
                              ? "bg-primary/10 border border-primary/30 shadow-[0_0_15px_rgba(var(--color-primary),0.15)]" 
                              : isTopThree
                                 ? "bg-base-100/50 border border-white/5"
                                 : "hover:bg-base-100/30 border border-transparent"
                        )}
                     >
                        {/* Ikon Peringkat */}
                        <div className="flex w-10 items-center justify-center shrink-0">
                           {getRankIcon(entry.rank)}
                        </div>

                        {/* Nama Pemain */}
                        <div className="flex-1 min-w-0">
                           <p
                              className={cn(
                                 "text-sm font-bold truncate transition-colors",
                                 isCurrentUser ? "text-primary" 
                                 : entry.rank === 1 ? "text-yellow-500 drop-shadow-sm"
                                 : "text-base-content/80"
                              )}
                           >
                              {entry.name}
                           </p>
                           {isCurrentUser && (
                              <p className="text-[10px] uppercase tracking-wider font-bold text-primary/70 mt-0.5">
                                 Kamu
                              </p>
                           )}
                        </div>

                        {/* XP dan Level */}
                        <div className="text-right shrink-0">
                           <p className="text-sm font-black text-base-content tracking-tight">
                              {entry.xp} <span className="text-[10px] text-base-content/40 font-normal">XP</span>
                           </p>
                           <div className="flex justify-end mt-0.5">
                              <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-base-300/50 text-base-content/60">
                                 Lv.{entryLevel}
                              </span>
                           </div>
                        </div>
                     </div>
                  );
               })}
            </div>
         </div>
      </div>
   );
}