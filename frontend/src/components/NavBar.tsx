import { IconLogout } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/utils/cn";
import LogoComponents from '@/public/NetQuest4.svg?react';

export type NavBarRole = "auth" | "student" | "admin";

interface NavBarProps {
   role: NavBarRole;
   onLogout?: () => void;
   showThemeToggle?: boolean;
   className?: string;
}

const logoConfig: Record<NavBarRole, { to: string } | null> = {
   auth: { to: "/auth/login" }, // Diarahkan ke login jika diklik di halaman auth
   student: { to: "/dashboard" },
   admin: { to: "/admin" },
};

export default function NavBar({
   role,
   onLogout,
   showThemeToggle = true,
   className,
}: NavBarProps) {
   const logo = logoConfig[role];

   return (
      <div
         className={cn(
            "navbar px-4 lg:px-8 min-h-20 transition-all duration-300",
            role === "auth" 
               ? "bg-transparent" 
               : "bg-base-100/70 backdrop-blur-xl border-b border-white/5 shadow-sm",
            className,
         )}
      >
         <div className="flex-1">
            {logo ? (
               <Link to={logo.to} className="hover:scale-105 transition-transform duration-300 origin-left">
                  <LogoComponents className="w-40 sm:w-48 h-fit drop-shadow-md" />
               </Link>
            ) : (
               <LogoComponents className="w-40 sm:w-48 h-fit drop-shadow-md" />
            )}
         </div>

         <div className="flex-none gap-2 sm:gap-4">
            {showThemeToggle && (
               <div className="bg-base-200/50 backdrop-blur-md border border-white/10 rounded-full p-1.5">
                  <ThemeToggle />
               </div>
            )}
            {onLogout && role !== "auth" && (
               <button
                  onClick={onLogout}
                  className="btn btn-ghost hover:bg-error/10 hover:text-error transition-colors btn-sm sm:btn-md gap-2"
               >
                  <IconLogout size={18} />
                  <span className="hidden sm:inline font-bold">Keluar Sistem</span>
               </button>
            )}
         </div>
      </div>
   );
}