import { cn } from "@/utils/cn";
import { IconHeart, IconClock } from "@tabler/icons-react";

interface HeartDisplayProps {
   heartValue: number;
   countdownLabel?: string;
}

export default function HeartDisplay({ heartValue, countdownLabel }: HeartDisplayProps) {
   return (
      <div className="flex items-center gap-2 bg-base-200/50 border border-white/10 rounded-full px-3 py-1 sm:px-4 sm:py-1.5 backdrop-blur-md shadow-inner transition-transform hover:scale-105 cursor-default">
         <div className="flex gap-1">
            {Array.from({ length: 3 }, (_, i) => {
               const isFilled = i < heartValue;
               return (
                  <IconHeart
                     key={i}
                     className={cn(
                        "size-5 sm:size-6 transition-all duration-300",
                        isFilled 
                           ? "text-error fill-error drop-shadow-[0_0_8px_rgba(var(--color-error),0.6)] scale-100" 
                           : "text-base-content/20 fill-base-content/5 scale-90"
                     )}
                  />
               );
            })}
         </div>
         
         {/* Garis Pemisah & Countdown (Jika Sedang Regenerasi Nyawa) */}
         {countdownLabel && heartValue < 3 && (
            <div className="flex items-center gap-1.5 border-l border-white/10 pl-2 sm:pl-3 ml-1 sm:ml-2">
               <IconClock size={14} className="text-warning animate-pulse" />
               <span className="text-xs font-bold text-warning font-mono tracking-widest">
                  {countdownLabel}
               </span>
            </div>
         )}
      </div>
   );
}