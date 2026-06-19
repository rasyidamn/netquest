import { useState, useEffect } from "react";
import { IconSparkles } from "@tabler/icons-react";

interface WelcomeBannerProps {
   isLoading?: boolean;
   name?: string;
}

const MOTIVATIONS = [
   "Terus belajar, kuasai jaringan komputer!",
   "Setiap quest membawamu lebih dekat jadi ahli jaringan!",
   "Jangan menyerah, pahlawan jaringan!",
   "Belajar itu perjalanan, nikmati prosesnya!",
   "Koneksikan dirimu dengan ilmu baru!",
];

export function WelcomeBanner({ isLoading, name }: WelcomeBannerProps) {
   const [motivation, setMotivation] = useState("");

   useEffect(() => {
      setMotivation(MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)]);
   }, []);

   if (isLoading) {
      return (
         <div className="relative overflow-hidden rounded-3xl bg-base-200/50 p-8 sm:p-10 border border-base-300 shadow-sm">
            <div className="skeleton h-6 w-40 mb-6 rounded-full bg-base-300/50" />
            <div className="skeleton h-10 w-2/3 md:w-1/2 mb-4 rounded-xl bg-base-300/50" />
            <div className="skeleton h-6 w-3/4 md:w-1/3 rounded-lg bg-base-300/50" />
         </div>
      );
   }

   return (
      <div className="group relative overflow-hidden rounded-3xl bg-base-200/40 backdrop-blur-xl border border-white/10 shadow-lg transition-all duration-500 hover:shadow-[0_8px_40px_rgba(var(--color-primary),0.15)]">
         {/* Ornamen Cahaya Ambient */}
         <div className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-primary/20 blur-[100px] transition-transform duration-700 group-hover:scale-110" />
         <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-secondary/20 blur-[100px] transition-transform duration-700 group-hover:scale-110" />
         
         <div className="relative z-10 p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-4">
               {/* Lencana Status */}
               <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-base-100/50 border border-white/10 shadow-sm backdrop-blur-md text-xs font-bold uppercase tracking-[0.15em] text-base-content/70">
                  <span className="relative flex h-2 w-2">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  NetQuest System Online
               </div>

               {/* Teks Sapaan */}
               <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-base-content drop-shadow-sm">
                  Selamat Datang,{" "}
                  <span className="bg-linear-to-br from-primary to-secondary bg-clip-text text-transparent">
                     {name || "Mahasiswa"}
                  </span>
                  ! 👋
               </h1>

               {/* Motivasi */}
               <p className="text-base-content/70 text-lg sm:text-xl font-medium max-w-2xl leading-relaxed flex items-center gap-2">
                  <IconSparkles size={20} className="text-secondary opacity-70" />
                  {motivation}
               </p>
            </div>

            {/* Dekorasi Kosmetik Kanan (Hanya Muncul di Desktop) */}
            <div className="hidden md:flex shrink-0 items-center justify-center relative">
               <div className="absolute inset-0 bg-linear-to-tr from-primary/20 to-secondary/20 blur-xl rounded-full" />
               <div className="h-28 w-28 rounded-full border-[6px] border-base-300/30 border-t-primary border-r-secondary animate-[spin_8s_linear_infinite] shadow-[0_0_30px_rgba(var(--color-primary),0.2)]" />
               <div className="absolute h-20 w-20 rounded-full border-4 border-base-300/30 border-b-accent border-l-primary animate-[spin_6s_linear_infinite_reverse]" />
            </div>
         </div>
      </div>
   );
}