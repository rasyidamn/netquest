import HeartDisplay from "@/components/HeartDisplay";
import { XpBar } from "@/components/XpBar";
import { LevelBadge } from "@/components/LevelBadge";
import { getRankProgress } from "@/utils/rank.util";
import { cn } from "@/utils/cn";

interface StatusBarProps {
   isLoading?: boolean;
   xp: number;
   hearts: number;
   countdownLabel?: string;
   className?: string;
}

function StatusBarSkeleton() {
   return (
      <div className="card bg-base-200/30 backdrop-blur-xl border border-white/5 shadow-lg overflow-hidden">
         <div className="card-body p-6">
            <div className="flex flex-wrap items-center justify-between gap-6">
               {/* Skeleton Bagian Kiri (Level Badge) */}
               <div className="flex items-center gap-4">
                  <div className="skeleton size-14 rounded-full bg-base-300/50 shadow-[0_0_15px_rgba(255,255,255,0.05)]" />
                  <div className="space-y-2.5">
                     <div className="skeleton h-3 w-20 bg-base-300/50 rounded-full" />
                     <div className="skeleton h-5 w-32 bg-base-300/30 rounded-lg" />
                  </div>
               </div>

               {/* Skeleton Bagian Kanan (Hearts) */}
               <div className="flex items-center gap-2 p-3 rounded-2xl bg-base-300/20 border border-white/5">
                  <div className="skeleton size-7 rounded-full bg-base-300/50" />
                  <div className="skeleton size-7 rounded-full bg-base-300/50" />
                  <div className="skeleton size-7 rounded-full bg-base-300/50" />
               </div>
            </div>

            {/* Skeleton XP Bar */}
            <div className="mt-6 space-y-2">
               <div className="flex justify-between">
                  <div className="skeleton h-3 w-16 bg-base-300/40 rounded-full" />
                  <div className="skeleton h-3 w-16 bg-base-300/40 rounded-full" />
               </div>
               <div className="skeleton h-4 w-full rounded-full bg-base-300/50 shadow-inner" />
            </div>
         </div>
      </div>
   );
}

export function StatusBar({
   isLoading,
   xp,
   hearts,
   countdownLabel,
   className,
}: StatusBarProps) {
   if (isLoading) {
      return <StatusBarSkeleton />;
   }

   const rankProgress = getRankProgress(xp);

   return (
      <div className={cn(
         "card relative overflow-hidden bg-base-200/40 backdrop-blur-xl border border-white/10 shadow-lg group",
         className
      )}>
         {/* Cahaya Holografik Melengkung di Bagian Atas */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-primary/10 rounded-full blur-[50px] pointer-events-none transition-opacity duration-500 group-hover:opacity-70" />
         
         {/* Garis Aksen Neon Tipis di Atas */}
         <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

         <div className="card-body p-6 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-4">
               
               {/* Wrapper Level Badge agar terasa lebih terintegrasi */}
               <div className="transition-transform duration-300 hover:scale-[1.02] origin-left drop-shadow-sm">
                  <LevelBadge xp={xp} />
               </div>

               {/* Wrapper Nyawa (Hearts) dengan background kaca gelap */}
               <div className="flex items-center justify-end rounded-2xl bg-base-100/40 backdrop-blur-sm border border-white/5 px-4 py-2 shadow-inner transition-colors duration-300 hover:bg-base-100/60 hover:border-white/10">
                  <HeartDisplay heartValue={hearts} countdownLabel={countdownLabel} />
               </div>
               
            </div>

            {/* Wrapper XP Bar dengan jarak dan border yang lembut */}
            <div className="mt-2 relative">
               <XpBar rankProgress={rankProgress} className="relative z-10" />
            </div>
         </div>
      </div>
   );
}