import { createFileRoute } from '@tanstack/react-router'
import { BarChart } from 'lucide-react'

export const Route = createFileRoute('/_protected/admin/reports')({
  component: AdminReportsPage,
})

function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b border-base-200 pb-4">
        <BarChart className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-black text-base-content">Laporan & Analitik</h1>
      </div>
      
      <div className="bg-base-100 p-8 rounded-2xl shadow-sm border border-base-200">
        <p className="text-base-content/70">
          Fitur untuk melihat statistik kelulusan, skor rata-rata, dan grafik performa kelas akan ditempatkan di sini.
        </p>
      </div>
    </div>
  )
}
