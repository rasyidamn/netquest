import { useEffect, useMemo } from "react";
import { X, Star } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import clsx from "clsx";
import type { LessonType } from "@/feature/module/schema/lesson.schema";
import toast from "react-hot-toast";

interface LessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<LessonType>) => void;
  initialData?: LessonType | null;
  isPending?: boolean;
  usedSequences?: number[];
}

export function LessonModal({ isOpen, onClose, onSave, initialData, isPending, usedSequences = [] }: LessonModalProps) {
  const lessonSchema = useMemo(() => {
    return z.object({
      title: z.string().min(3, "Judul misi minimal 3 karakter").max(255),
      lessonSequence: z.number({ message: "Urutan harus berupa angka" }).int().positive("Urutan harus dimulai dari 1").refine((val) => {
        if (initialData && initialData.lessonSequence === val) return true;
        return !usedSequences.includes(val);
      }, { message: "Urutan misi ini sudah digunakan dalam modul ini" }),
      type: z.enum(["THEORY", "QUIZ"]),
      xpReward: z.number({ message: "XP harus berupa angka" }).int().nonnegative("XP tidak boleh negatif"),
      isPublished: z.boolean(),
    });
  }, [usedSequences, initialData]);

  type LessonFormValues = z.infer<typeof lessonSchema>;


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: "",
      lessonSequence: 1,
      type: "THEORY",
      xpReward: 50,
      isPublished: false,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          title: initialData.title,
          lessonSequence: initialData.lessonSequence,
          type: initialData.type as "THEORY" | "QUIZ",
          xpReward: initialData.xpReward,
          isPublished: initialData.isPublished,
        });
      } else {
        const nextSequence = usedSequences.length > 0 ? Math.max(...usedSequences) + 1 : 1;
        reset({
          title: "",
          lessonSequence: nextSequence,
          type: "THEORY",
          xpReward: 50,
          isPublished: false,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialData, reset]);

  if (!isOpen) return null;

  const onSubmit = (data: LessonFormValues) => {
    const isDuplicate = usedSequences.includes(data.lessonSequence) && (!initialData || initialData.lessonSequence !== data.lessonSequence);
    
    if (isDuplicate) {
      toast.error("Urutan misi ini sudah digunakan dalam modul ini");
      return;
    }
    
    onSave(data);
  };

  const onInvalid = (formErrors: any) => {
    if (formErrors.lessonSequence) {
      toast.error(formErrors.lessonSequence.message as string);
    } else {
      toast.error("Mohon periksa kembali isian form Anda");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-base-100 rounded-2xl w-full max-w-lg shadow-xl border border-base-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-base-200 bg-base-200/30 shrink-0">
          <div>
            <h2 className="text-xl font-black text-base-content">
              {initialData ? "Edit Misi" : "Tambah Misi Baru"}
            </h2>
            <p className="text-xs text-base-content/50 mt-0.5">
              {initialData ? "Perbarui informasi misi ini" : "Pilih tipe dan isi detail misi"}
            </p>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="p-6 space-y-6">
          {/* Judul */}
          <div className="form-control">
            <label className="label pb-1">
              <span className="label-text font-semibold text-base-content">Judul Misi</span>
            </label>
            <input
              type="text"
              className={clsx("input input-bordered w-full", errors.title && "input-error")}
              placeholder="Contoh: Pengenalan Topologi Jaringan"
              {...register("title")}
            />
            {errors.title && <span className="text-error text-xs mt-1">{errors.title.message}</span>}
          </div>

          {/* Urutan & Tipe */}
          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text font-semibold text-base-content">Urutan</span>
              </label>
              <input
                type="number"
                className={clsx("input input-bordered w-full", errors.lessonSequence && "input-error")}
                {...register("lessonSequence", { valueAsNumber: true })}
              />
              {errors.lessonSequence && (
                <span className="text-error text-xs mt-1">{errors.lessonSequence.message}</span>
              )}
            </div>

            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text font-semibold text-base-content">Tipe</span>
              </label>
              <select
                className={clsx("select select-bordered w-full", errors.type && "select-error")}
                {...register("type")}
              >
                <option value="THEORY">Theory (Materi)</option>
                <option value="QUIZ">Quiz (Soal)</option>
              </select>
              {errors.type && <span className="text-error text-xs mt-1">{errors.type.message}</span>}
            </div>
          </div>

          {/* XP Reward */}
          <div className="form-control">
            <label className="label pb-1 flex items-center justify-start gap-2">
              <span className="label-text font-semibold text-base-content">XP Reward</span>
              <Star className="w-4 h-4 text-warning fill-warning" />
            </label>
            <input
              type="number"
              className={clsx("input input-bordered w-full", errors.xpReward && "input-error")}
              {...register("xpReward", { valueAsNumber: true })}
            />
            {errors.xpReward && (
              <span className="text-error text-xs mt-1">{errors.xpReward.message}</span>
            )}
          </div>

          {/* Publish Toggle */}
          <div className="bg-base-200/50 p-4 rounded-xl border border-base-200">
            <label className="label cursor-pointer justify-start gap-4">
              <input
                type="checkbox"
                className="toggle toggle-primary toggle-md"
                {...register("isPublished")}
              />
              <div>
                <span className="label-text font-bold block text-base">Terbitkan Misi</span>
                <span className="text-xs text-base-content/60">
                  Misi akan langsung dapat diakses oleh student jika dicentang.
                </span>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn flex-1">
              Batal
            </button>
            <button type="submit" className="btn btn-primary flex-1" disabled={isPending}>
              {isPending && <span className="loading loading-spinner loading-xs" />}
              Simpan Misi
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
