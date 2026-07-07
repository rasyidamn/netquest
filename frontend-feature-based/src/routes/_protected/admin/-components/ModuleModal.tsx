import { useEffect, useMemo } from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import clsx from "clsx";
import type { ModuleType } from "@/feature/module/schema/module.schema";

import toast from "react-hot-toast";

interface ModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<ModuleType>) => void;
  initialData?: ModuleType | null;
  isPending?: boolean;
  usedSequences?: number[];
}

export function ModuleModal({ isOpen, onClose, onSave, initialData, isPending, usedSequences = [] }: ModuleModalProps) {
  const moduleSchema = useMemo(() => {
    return z.object({
      title: z.string().min(3, "Judul modul minimal 3 karakter").max(255),
      description: z.string().optional(),
      sequence: z.number({ message: "Urutan harus berupa angka" }).int().positive("Urutan modul harus dimulai dari 1").refine((val) => {
        // Jika sedang edit, abaikan sequence miliknya sendiri
        if (initialData && initialData.sequence === val) return true;
        return !usedSequences.includes(val);
      }, { message: "Urutan ini sudah digunakan modul lain" }),
      isPublished: z.boolean(),
    });
  }, [usedSequences, initialData]);

  type ModuleFormValues = z.infer<typeof moduleSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ModuleFormValues>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      title: "",
      description: "",
      sequence: 1,
      isPublished: false,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          title: initialData.title,
          description: initialData.description || "",
          sequence: initialData.sequence,
          isPublished: initialData.isPublished,
        });
      } else {
        const nextSequence = usedSequences.length > 0 ? Math.max(...usedSequences) + 1 : 1;
        reset({
          title: "",
          description: "",
          sequence: nextSequence,
          isPublished: false,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialData, reset]);

  if (!isOpen) return null;

  const onSubmit = (data: ModuleFormValues) => {
    // Validasi manual untuk memastikan sequence tidak duplikat
    // Ini memastikan error tidak bocor ke server meskipun schema Zod telat update
    const isDuplicate = usedSequences.includes(data.sequence) && (!initialData || initialData.sequence !== data.sequence);
    
    if (isDuplicate) {
      toast.error("Urutan ini sudah digunakan modul lain");
      return; // Cegah request ke backend
    }
    
    onSave(data);
  };

  const onInvalid = (formErrors: any) => {
    if (formErrors.sequence) {
      toast.error(formErrors.sequence.message as string);
    } else {
      toast.error("Mohon periksa kembali isian form Anda");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-base-100 rounded-2xl w-full max-w-md shadow-xl border border-base-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-base-200 bg-base-200/30 shrink-0">
          <div>
            <h2 className="text-xl font-black text-base-content">
              {initialData ? "Edit Modul" : "Tambah Modul Baru"}
            </h2>
            <p className="text-xs text-base-content/50 mt-0.5">
              {initialData ? "Perbarui informasi modul" : "Isi detail untuk modul baru"}
            </p>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="p-6 space-y-5">
            {/* Judul */}
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text font-semibold text-base-content">Judul Modul</span>
              </label>
              <input
                type="text"
                className={clsx("input input-bordered w-full", errors.title && "input-error")}
                placeholder="Contoh: Pengenalan Jaringan Komputer"
                {...register("title")}
              />
              {errors.title && <span className="text-error text-xs mt-1">{errors.title.message}</span>}
            </div>

            {/* Deskripsi */}
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text font-semibold text-base-content">Deskripsi</span>
              </label>
              <textarea
                className={clsx("textarea textarea-bordered h-24 w-full", errors.description && "textarea-error")}
                placeholder="Penjelasan singkat mengenai modul ini..."
                {...register("description")}
              ></textarea>
              {errors.description && <span className="text-error text-xs mt-1">{errors.description.message}</span>}
            </div>

            {/* Urutan */}
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text font-semibold text-base-content">Urutan (Sequence)</span>
              </label>
              <input
                type="number"
                className={clsx("input input-bordered w-full", errors.sequence && "input-error")}
                {...register("sequence", { valueAsNumber: true })}
              />
              {errors.sequence && <span className="text-error text-xs mt-1">{errors.sequence.message}</span>}
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
                  <span className="label-text font-bold block text-base">Terbitkan Modul</span>
                  <span className="text-xs text-base-content/60 text-wrap leading-0">
                    Modul akan langsung dapat diakses oleh student jika dicentang.
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
                Simpan Modul
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
