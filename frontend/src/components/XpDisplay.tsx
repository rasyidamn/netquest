import { IconBolt } from "@tabler/icons-react";

export default function XpDisplay({ xpValue }: { xpValue: number | string }) {
   return (
      <div className="flex items-center gap-1.5 sm:gap-2 bg-base-200/50 border border-white/10 rounded-full px-3 py-1 sm:px-4 sm:py-1.5 backdrop-blur-md shadow-inner transition-transform hover:scale-105 cursor-default">
         <IconBolt 
            size={20} 
            className="text-warning drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" 
            fill="currentColor" 
         />
         <p className="font-black text-base sm:text-lg tracking-tight text-base-content flex items-baseline gap-0.5">
            {xpValue} 
            <span className="text-[10px] sm:text-xs font-bold text-base-content/40 uppercase tracking-wider">
               XP
            </span>
         </p>
      </div>
   );
}