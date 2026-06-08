/*
  Warnings:

  - You are about to drop the column `current_lesson_id` on the `user_progress` table. All the data in the column will be lost.
  - You are about to drop the column `module_id` on the `user_progress` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,lesson_id]` on the table `user_progress` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lesson_id` to the `user_progress` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user_progress" DROP CONSTRAINT "user_progress_current_lesson_id_fkey";

-- DropForeignKey
ALTER TABLE "user_progress" DROP CONSTRAINT "user_progress_module_id_fkey";

-- AlterTable
ALTER TABLE "user_progress" DROP COLUMN "current_lesson_id",
DROP COLUMN "module_id",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lesson_id" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_progress_user_id_lesson_id_key" ON "user_progress"("user_id", "lesson_id");

-- AddForeignKey
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
