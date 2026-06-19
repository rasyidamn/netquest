import { cn } from "@/utils/cn";
import { getCurrentRank } from "@/utils/rank.util";
import { IconHeart, IconStar, IconBolt } from "@tabler/icons-react";

type ColorTheme = "warning" | "primary" | "error";

interface StatItemProps {
   icon: React.ReactNode;
   label: string;
   value: string | number;
   theme: ColorTheme;
}

function StatItem({ icon, label, value, theme }: StatItemProps) {
   // Konfigurasi warna dinamis (tanpa perubahan border saat hover agar tetap clean)
   const themeStyles = {
      warning: "text-warning bg-warning/10 border-warning/20",
      primary: "text-primary bg-primary/10 border-primary/20",
      error: "text-error bg-error/10 border-error/20",
   };

   const glowStyles = {
      warning: "bg-warning/20",
      primary: "bg-primary/20",
      error: "bg-error/20",
   };

   return (
      <div className="group relative overflow-hidden rounded-2xl bg-base-100/40 backdrop-blur-md border border-white/5 p-4 sm:p-5 transition-all duration-500 hover:-translate-y-1 hover:bg-base-100/60 hover:shadow-lg z-10">
         {/* Efek cahaya ambient di sudut kanan atas kapsul */}
         <div className={cn("absolute -top-6 -right-6 h-16 w-16 rounded-full blur-[24px] transition-transform duration-500 group-hover:scale-150", glowStyles[theme])} />

         <div className="relative flex items-center gap-4">
            {/* Wadah Ikon (Garis ring saat hover sudah dihapus total) */}
            <div
               className={cn(
                  "relative flex size-12 shrink-0 items-center justify-center rounded-xl border",
                  themeStyles[theme]
               )}
            >
               <span className="relative z-10 transition-transform duration-300 group-hover:scale-110">{icon}</span>
            </div>

            {/* Teks Label & Angka */}
            <div>
               <p className="text-xs font-bold uppercase tracking-widest text-base-content/50 mb-0.5">
                  {label}
               </p>
               <p className="text-2xl sm:text-3xl font-black tracking-tight text-base-content drop-shadow-sm transition-transform duration-300 group-hover:scale-105 origin-left">
                  {value}
               </p>
            </div>
         </div>
      </div>
   );
}

interface StatsCardProps {
   isLoading?: boolean;
   xp?: number;
   hearts?: number;
}

function StatsCardSkeleton() {
   return (
      <div className="card bg-base-200/30 backdrop-blur-xl border border-white/5 shadow-lg overflow-hidden">
         <div className="card-body p-6">
            <div className="skeleton h-5 w-32 mb-4 rounded-md bg-base-300/50" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
               {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 rounded-2xl bg-base-100/20 p-5 border border-white/5">
                     <div className="skeleton size-12 rounded-xl bg-base-300/50 shrink-0" />
                     <div className="space-y-3 w-full">
                        <div className="skeleton h-3 w-16 bg-base-300/50 rounded-full" />
                        <div className="skeleton h-6 w-24 bg-base-300/50 rounded-lg" />
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
}

export function StatsCard({ isLoading, xp, hearts }: StatsCardProps) {
   if (isLoading) {
      return <StatsCardSkeleton />;
   }

   const currentLevel = getCurrentRank(xp ?? 0).level;

   return (
      <div className="card relative overflow-hidden bg-base-200/40 backdrop-blur-xl border border-white/10 shadow-lg group">
         {/* Garis Aksen Dekoratif di Atas Kartu */}
         <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-base-content/20 to-transparent opacity-50" />

         <div className="card-body p-6">
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-base-content/60 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/80 animate-pulse"></span>
                  Status Pemain
               </h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
               <StatItem
                  theme="warning"
                  icon={<IconBolt size={24} />}
                  label="Total XP"
                  value={xp ?? 0}
               />
               <StatItem
                  theme="primary"
                  icon={<IconStar size={24} />}
                  label="Level"
                  value={currentLevel}
               />
               <StatItem
                  theme="error"
                  icon={<IconHeart size={24} className="animate-[pulse_2s_ease-in-out_infinite]" />}
                  label="Nyawa"
                  value={hearts ?? 0}
               />
            </div>
         </div>
      </div>
   );
}