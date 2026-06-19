// _authenticated/_student/roadmap.index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { RoadmapTimeline } from "@/components/roadmap/RoadmapTimeline";

export const Route = createFileRoute("/_authenticated/_student/roadmap/")({
   component: () => (
      <div className="relative min-h-screen p-6 sm:p-10 overflow-hidden">
         {/* Ambient Background Glows */}
         <div className="pointer-events-none absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary/10 blur-[120px]" />
         <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-success/5 blur-[150px]" />
         
         <div className="relative z-10 max-w-5xl mx-auto">
            <div className="text-center mb-16 space-y-4">
               <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-br from-base-content to-base-content/50 bg-clip-text text-transparent drop-shadow-sm">
                  Peta Perjalanan
               </h1>
               <p className="text-lg text-base-content/60 max-w-xl mx-auto font-medium">
                  Buka kunci keahlian baru, taklukkan setiap modul, dan raih level tertinggi Anda.
               </p>
            </div>
            
            <div className="flex justify-center">
               <RoadmapTimeline />
            </div>
         </div>
      </div>
   ),
});