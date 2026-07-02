# 📚 Backend NetQuest – Ringkasan Komprehensif

## 🧠 Gambaran Umum

Backend **NetQuest** adalah **RESTful API** berbasis **Express.js + TypeScript** untuk platform pembelajaran **gamifikasi jaringan komputer**. Dibangun dengan arsitektur **3-layer (Controller → Service → Prisma/DB)** dengan validasi Zod, autentikasi JWT, dan dokumentasi OpenAPI/Swagger.

---

## 🏗️ Struktur Arsitektur

### 1. Entry Point & Server

| File | Fungsi |
|------|--------|
| `src/server.ts` | Inisialisasi koneksi DB via Prisma, lalu menjalankan Express app di PORT (default 3000) |
| `src/app.ts` | Setup middleware global (CORS, cookie-parser, JSON parser, request logger), Swagger, router `/api`, dan error handler |

### 2. Routing (`routes/`)

Router utama di `index.routes.ts` menggabungkan 6 sub-router:

| Prefix | Router | Middleware | Endpoints |
|--------|--------|-----------|-----------|
| `/api/auth` | `auth.routes.ts` | Public + Auth | Register, Login, Profile (auth), Logout (auth) |
| `/api/modules` | `module.routes.ts` | Auth + Admin | GET all, GET lessons by module, POST/PATCH/DELETE module |
| `/api/lessons` | `lesson.routes.ts` | Auth + Admin | GET detail, CRUD lesson, upsert material, manage questions |
| `/api/gameplay` | `gameplay.routes.ts` | Auth | theoryDone, submitQuiz, completeQuiz, recoverHeart |
| `/api/progress` | `progress.routes.ts` | Auth + Admin | GET my progress (student), GET all progress (admin) |
| `/api/leaderboard` | `leaderboard.routes.ts` | Auth | GET leaderboard (sorted by XP) |

### 3. Controller Layer (`controllers/`)

Menerima request, melakukan **validasi Zod** pada `req.body`/`req.params`/`req.query`, memanggil **Service**, lalu mengirim response via `sendSuccess()`.

| Controller | Methods Utama |
|------------|---------------|
| `AuthController` | register, login, logout, getProfile |
| `ModuleController` | getAllModules, createModule, updateModule, deleteModule |
| `LessonController` | getLessonByModule, getLessonDetail, createLesson, updateLesson, deleteLesson, upsertMaterial, createQuestionWithOption, updateQuestionWithOption, deleteQuestion |
| `GameplayController` | theoryDone, submitQuiz, completeQuiz, recoverHeart |
| `ProgressController` | getMyProgress, getAllProgress |
| `LeaderboardController` | getLeaderboard |

### 4. Service Layer (`services/`)

Berisi **logika bisnis**, interaksi dengan database via Prisma, dan validasi tambahan:

| Service | Fungsi Utama & Logika |
|---------|----------------------|
| **AuthService** | Register (hash bcrypt + transaction: buat user + buka lesson pertama), Login (validasi NIM & password), GetProfile (auto-recover heart setiap 4 jam) |
| **ModuleService** | CRUD module (sequence-based ordering) |
| **LessonService** | CRUD lesson, upsert material (hanya untuk THEORY), CRUD question+options (hanya untuk QUIZ) |
| **GameplayService** | **theoryDone**: tandai COMPLETED, unlockNextLesson, tambah XP. **submitQuiz**: validasi heart (≥1), kurangi heart jika salah, tambah XP jika benar. **completeQuiz**: simpan bestScore, unlockNextLesson. **recoverHeart**: batas 3x/hari, baca materi ≥60 detik. **unlockNextLesson**: buka lesson berikutnya (dalam module yg sama atau module berikutnya) |
| **ProgressService** | **getMyProgress**: per-modul (status: LOCKED/ACTIVE/COMPLETED, bestScore total, currentLessonId). **getAllProgress**: rekap per mahasiswa per modul untuk admin |
| **LeaderboardService** | Ambil user MAHASISWA, sortir descending by XP, batas limit |

### 5. Schema Layer (`schemas/`) – Validasi Zod

Semua validasi request/response menggunakan **Zod** dengan ekstensi `zod-to-openapi`:

| Schema | Model | Request | Response |
|--------|-------|---------|----------|
| `user.schema.ts` | id, nim, name, password, role, xp, hearts, heartsUpdatedAt, recoveryCount, lastRecoveryDate, createdAt | REGISTER (nim, name, password), LOGIN (nim, password) | REGISTER_RESPONSE (tanpa password), GET_PROFILE_RESPONSE |
| `module.schema.ts` | id, title, sequence | CREATE (title, sequence), UPDATE (partial) | MODULE_MODEL |
| `lesson.schema.ts` | id, moduleId, title, lessonSequence, type, xpReward | CREATE (tanpa id/moduleId), UPDATE (partial) | LESSON_MODEL, LESSON_DETAIL (dibedakan admin vs mahasiswa — admin lihat isCorrect, mahasiswa tidak) |
| `material.schema.ts` | id, lessonId, content, mediaUrl | CREATE (content, mediaUrl?), UPDATE (partial) | MATERIAL_MODEL |
| `question.schema.ts` | id, lessonId, questionText, xpReward, type | CREATE_WITH_OPTIONS (questionText, xpReward, type, options[] min 2), UPDATE (partial) | QUESTION_OPTIONS_MODEL |
| `option.schema.ts` | id, questionId, optionText, isCorrect | CREATE (tanpa id) | OPTION_MODEL |
| `gameplay.schema.ts` | - | SUBMIT_ANSWER (lessondId, questionId, optionId), COMPLETE_QUIZ (lessonId, finalScore 0-100), RECOVER_HEART (lessonId, readDuration ≥60) | - |
| `leaderboard.schema.ts` | - | QUERY (limit, default 10) | LEADERBOARD_ITEM (rank, name, xp) |

### 6. Middleware (`middlewares/`)

| Middleware | Fungsi |
|-----------|--------|
| `auth.middleware.ts` | Ekstrak JWT dari cookie `access_token`, verifikasi, inject `req.user` (id, nim, role) |
| `isAdmin.middleware.ts` | Cek `req.user.role === ADMIN` |
| `error.middleware.ts` | Tangani ApiError (custom), ZodError (validation), dan error umum (500) |
| `request-logger.middleware.ts` | Logging request via Winston |

### 7. Utility (`utils/`)

| Utility | Fungsi |
|---------|--------|
| `catch-async.util.ts` | Wrapper untuk menangkap error async di controller |
| `api-error.util.ts` | Custom error class dengan status code |
| `response-formatter.util.ts` | `sendSuccess(res, code, message, data)` dan `sendError(res, code, message, errors?)` |
| `generateJWT.util.ts` | Generate JWT dengan payload {id, nim, role} |
| `leveling.engine.ts` | **Rumus level**: `level = floor(sqrt(totalXp / BASE_EXP)) + 1` dengan BASE_EXP=100. Menyediakan `calculateLevel`, `getXpThresholdForLevel`, `getProgressStats` |
| `logger.util.ts` | Winston logger |

### 8. Konfigurasi (`configs/`)

| Config | Fungsi |
|--------|--------|
| `database.config.ts` | Inisialisasi PrismaClient dengan adapter `@prisma/adapter-pg`, logging query/error/warn/info |
| `swagger.config.ts` | Generate OpenAPI 3.0 doc dari Zod schemas, ditampilkan di `/api-docs` via swagger-ui-express |
| `openapi.registry.ts` | Registry untuk `zod-to-openapi` |

---

## 🗄️ Database Schema (PostgreSQL via Prisma)

Terdapat 6 model + 3 enum:

### Enums

```prisma
enum RoleEnum {
  ADMIN
  MAHASISWA
}

enum LessonTypeEnum {
  THEORY
  QUIZ
}

enum ProgressStatusEnum {
  LOCKED
  ACTIVE
  COMPLETED
}
```

### Models

**User (`users`)**

| Field | Type | Default | Keterangan |
|-------|------|---------|------------|
| id | UUID | auto | Primary Key |
| nim | String | unique | NIM mahasiswa |
| name | String | - | Nama |
| password | String | - | Hash bcrypt |
| role | RoleEnum | MAHASISWA | Role user |
| xp | Int | 0 | Total XP |
| hearts | Int | 3 | Nyawa (max 3) |
| heartsUpdatedAt | DateTime | now() | Reset hearts otomatis |
| recoveryCount | Int | 0 | Pemulihan heart hari ini |
| lastRecoveryDate | DateTime | now() | Tanggal pemulihan terakhir |

**Module (`modules`)**

| Field | Type | Keterangan |
|-------|------|------------|
| id | UUID | PK |
| title | String | Judul modul |
| sequence | Int | Urutan modul |

**Lesson (`lessons`)**

| Field | Type | Keterangan |
|-------|------|------------|
| id | UUID | PK |
| moduleId | UUID (FK → Module) | Module parent, CASCADE delete |
| title | String | Judul lesson |
| lessonSequence | Int | Urutan dalam module |
| type | LessonTypeEnum | THEORY atau QUIZ |
| xpReward | Int | XP yang diberikan jika selesai |

**Material (`materials`)**

| Field | Type | Keterangan |
|-------|------|------------|
| id | UUID | PK |
| lessonId | UUID (FK → Lesson, unique) | 1 lesson = max 1 material, CASCADE |
| content | Text | Konten HTML/markdown |
| mediaUrl | String? | URL video/gambar |

**Question (`questions`)**

| Field | Type | Keterangan |
|-------|------|------------|
| id | UUID | PK |
| lessonId | UUID (FK → Lesson) | CASCADE delete |
| questionText | Text | Teks soal |
| xpReward | Int | 15 default |
| type | QuestionType | MULTIPLE_CHOICE | Tipe soal (MULTIPLE_CHOICE, CALCULATION_INPUT, COMMAND_TYPING, SORTING, MATCHING, IMAGE_LABELING) |

**Option (`options`)**

| Field | Type | Keterangan |
|-------|------|------------|
| id | UUID | PK |
| questionId | UUID (FK → Question) | CASCADE delete |
| optionText | String | Teks pilihan |
| isCorrect | Boolean | Jawaban benar? |

**UserProgress (`user_progress`)**

| Field | Type | Keterangan |
|-------|------|------------|
| id | UUID | PK |
| userId | UUID (FK → User) | CASCADE delete |
| lessonId | UUID (FK → Lesson) | CASCADE delete |
| status | ProgressStatusEnum | LOCKED/ACTIVE/COMPLETED |
| bestScore | Int | 0 default |
| @@unique([userId, lessonId]) | - | Mencegah duplikasi |

---

## 🔐 Autentikasi & Otorisasi

1. **Register**: Hash password (bcrypt, 10 salt rounds). Dalam 1 transaction: buat user + buka lesson pertama (sequence terendah).
2. **Login**: Validasi NIM & password, generate JWT (`{id, nim, role}`), simpan di **httpOnly cookie** (`access_token`).
3. **Middleware Chain**: `authMiddleware` → (opsional) `isAdminMiddleware`
4. **Auto Heart Recovery**: Setiap kali `getProfile` dipanggil, jika hearts < 3, hitung selisih waktu: setiap **4 jam** = +1 heart (max 3). Waktu geser agar sisa cooldown tidak hilang.

---

## 🎮 Sistem Gamifikasi

### Heart System

- Max 3 hearts
- **Berkurang** jika jawaban quiz salah (-1)
- **Pemulihan otomatis**: Setiap 4 jam +1 heart (via `getProfile`)
- **Pemulihan manual** (`recoverHeart`): 3x/hari, harus baca materi THEORY ≥60 detik

### XP & Leveling

- Rumus: `Level = floor(sqrt(totalXp / 100)) + 1` (dihitung di frontend)
- XP didapat dari: menyelesaikan theory (xpReward lesson), menjawab quiz benar (xpReward question)
- Backend hanya menyimpan total XP, level dihitung oleh frontend
- Helper `LevelingEngine` (backend) menyediakan: `calculateLevel`, `getXpThresholdForLevel`, `getProgressStats` (tidak dipakai di service, tersedia untuk keperluan lain)
- Frontend memiliki utility `leveling.util.ts` dengan rumus yang sama untuk menghitung level

### Progression System (Unlock)

- Saat registrasi: **lesson pertama** otomatis terbuka (ACTIVE)
- Saat menyelesaikan lesson (theory/quiz): **unlock next lesson** (dalam module sama atau module berikutnya)
- Progress disimpan di tabel `user_progress` dengan status LOCKED/ACTIVE/COMPLETED

---

## 📡 API Endpoints Lengkap

### Public

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register mahasiswa baru |
| POST | `/api/auth/login` | Login & dapatkan cookie JWT |

### Auth Required (Mahasiswa & Admin)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/auth/profile` | Profile user + auto heart recovery |
| POST | `/api/auth/logout` | Hapus cookie JWT |
| GET | `/api/modules` | Semua modul (urut sequence) |
| GET | `/api/modules/:id/lessons` | Lesson dalam modul |
| GET | `/api/lessons/:id` | Detail lesson (termasuk material/question/options) |
| POST | `/api/gameplay/theory-done` | Selesaikan lesson theory |
| POST | `/api/gameplay/submit-quiz` | Submit jawaban kuis |
| POST | `/api/gameplay/complete-quiz` | Selesaikan kuis, simpan score |
| POST | `/api/gameplay/recover-heart` | Pulihkan 1 heart |
| GET | `/api/progress` | Progress belajar pribadi |
| GET | `/api/leaderboard?limit=10` | Peringkat berdasarkan XP |

### Admin Only

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/modules` | Buat modul baru |
| PATCH | `/api/modules/:id` | Update modul |
| DELETE | `/api/modules/:id` | Hapus modul |
| POST | `/api/modules/:id/lessons` | Tambah lesson ke modul |
| POST | `/api/lessons` | Buat lesson |
| PUT | `/api/lessons/:id` | Update lesson |
| DELETE | `/api/lessons/:id` | Hapus lesson (cascade) |
| POST | `/api/lessons/:id/material` | Tambah/update materi |
| PUT | `/api/lessons/:id/material` | Tambah/update materi |
| POST | `/api/lessons/:id/questions` | Tambah soal + options |
| GET | `/api/progress/all` | Rekap progress semua mahasiswa |

---

## 🛠️ Tech Stack

- **Runtime**: Node.js + TypeScript 6.x
- **Framework**: Express 5.x
- **Database**: PostgreSQL + Prisma 7.x (dengan `@prisma/adapter-pg`)
- **Validation**: Zod 4.x + `zod-to-openapi`
- **Auth**: jsonwebtoken + bcrypt + cookie-parser
- **Docs**: Swagger UI + OpenAPI 3.0
- **Logging**: Winston
- **HTTP Status**: http-status-codes
- **CORS**: whitelist origin dari `CLIENT_URL` env

---

## 📁 File Structure Ringkas

```
backend/
├── prisma/
│   └── schema.prisma              # Skema database + enum
├── prisma.config.ts               # Konfigurasi Prisma
├── src/
│   ├── app.ts                     # Express app setup
│   ├── server.ts                  # Entry point
│   ├── configs/
│   │   ├── database.config.ts     # Prisma client init
│   │   ├── openapi.registry.ts
│   │   └── swagger.config.ts      # Swagger UI setup
│   ├── controllers/               # 6 controller files
│   │   ├── auth.controller.ts
│   │   ├── gameplay.controller.ts
│   │   ├── leaderboard.controller.ts
│   │   ├── lesson.controller.ts
│   │   ├── module.controller.ts
│   │   └── progress.controller.ts
│   ├── services/                  # 6 service files
│   │   ├── auth.service.ts
│   │   ├── gameplay.service.ts
│   │   ├── leaderboard.service.ts
│   │   ├── lesson.service.ts
│   │   ├── module.service.ts
│   │   └── progress.service.ts
│   ├── schemas/                   # 8 schema files (Zod)
│   │   ├── gameplay.schema.ts
│   │   ├── leaderboard.schema.ts
│   │   ├── lesson.schema.ts
│   │   ├── material.schema.ts
│   │   ├── module.schema.ts
│   │   ├── option.schema.ts
│   │   ├── question.schema.ts
│   │   ├── user-progress.schema.ts
│   │   └── user.schema.ts
│   ├── routes/                    # 7 route files
│   │   ├── auth.routes.ts
│   │   ├── gameplay.routes.ts
│   │   ├── index.routes.ts
│   │   ├── leaderboard.routes.ts
│   │   ├── lesson.routes.ts
│   │   ├── module.routes.ts
│   │   └── progress.routes.ts
│   ├── middlewares/               # 4 middleware files
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── isAdmin.middleware.ts
│   │   └── request-logger.middleware.ts
│   ├── utils/                     # 7 utility files
│   │   ├── api-error.util.ts
│   │   ├── catch-async.util.ts
│   │   ├── generateJWT.util.ts
│   │   ├── leveling.engine.ts
│   │   ├── logger.util.ts
│   │   └── response-formatter.util.ts
│   ├── types/
│   │   └── response.type.ts
│   └── generated/prisma/         # Generated Prisma client
├── tsconfig.json
└── package.json
```

---

## ✅ Kesimpulan

Backend ini adalah **RESTful API gamifikasi pembelajaran terstruktur** dengan:

- **Autentikasi JWT via httpOnly cookie** dengan role-based access (Mahasiswa/Admin)
- **Manajemen konten bertingkat**: Module → Lesson (THEORY/QUIZ) → Material/Question+Options
- **Progression system**: unlock bertahap dari lesson pertama hingga terakhir
- **Gamification**: XP (level dihitung frontend via rumus kuadratik), Heart system (max 3, recover 4 jam otomatis + 3x manual/hari), Leaderboard
- **Validasi ketat** di semua layer (Zod schema untuk request & response)
- **Dokumentasi API otomatis** via Swagger UI di `/api-docs`
- **Response format konsisten**: `{success, message, data/errors}`
- Database **PostgreSQL** dengan relasi lengkap (CASCADE delete, unique constraints)
- **Fitur admin**: CRUD konten, rekap progress semua mahasiswa