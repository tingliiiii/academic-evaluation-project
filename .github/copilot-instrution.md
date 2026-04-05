# 期末評語生成系統 - 開發指南

## 📌 專案概述

**快速評語生成系統** 是一個 Next.js 前後端Web應用，協助教師快速生成學生期末評語。

**流程：**
1. 老師輸入學生姓名、選擇四字箴言、選擇語氣
2. 系統自動生成發送給 Gemini API 的 prompt
3. 老師確認後，調用 Gemini API 生成最終評語
4. 評語保存至數據庫，可查詢歷史記錄
5. 後台管理：老師可動態管理四字箴言和語氣列表（CRUD）

---

## 🏗️ 技術棧

| 層次 | 技術 |
|------|------|
| **前端** | React 19 + Next.js 16 + shadcn/ui + Tailwind CSS |
| **後端** | Next.js API Routes + Node.js |
| **數據庫** | PostgreSQL (Supabase) + Prisma ORM |
| **AI集成** | Google Gemini API |
| **部署** | Vercel + GitHub Actions CI/CD |
| **表單管理** | react-hook-form + Zod |

---

## ✅ 完成進度

### 第一階段：項目初始化 ✓ 已完成
- [x] Next.js 項目初始化（TypeScript + App Router + Tailwind CSS）
- [x] 核心依賴安裝（@google/generative-ai、@prisma/client、react-hook-form、zod 等）
- [x] Prisma 初始化與配置
- [x] 環境變量設置（.env、.env.local）
- [x] shadcn/ui 組件庫初始化及預安裝（Button、Input、Select、Card、Dialog、Table 等）
- [x] 本地開發服務器驗證（http://localhost:3000 可訪問）

### 第二階段：數據層 & API 層 🚧 進行中
- [x] Prisma schema 定義（Wisdom、Tone、Student、Evaluation、EvaluationWisdom 五張表）
- [x] Prisma seed 腳本編寫（初始化默認四字箴言和語氣）
- [x] 環境配置文件優化（DATABASE_URL、DIRECT_URL 已配置）
- [x] TypeScript 類型定義（lib/types.ts）
- [ ] **進行中：** 數據庫遷移執行（`npx prisma migrate dev --name init`）
- [ ] **待做：** Gemini API 層實現（lib/gemini.ts）
- [ ] **待做：** API 路由實現
  - /api/prompt/generate — 生成 prompt 預覽
  - /api/evaluation/generate — 調用 Gemini 生成評語
  - /api/evaluations/list — 獲取評語歷史
  - /api/admin/wisdoms — 箴言 CRUD
  - /api/admin/tones — 語氣 CRUD

### 第三階段：前端 UI & 交互 ⏳ 待開始
- [ ] 表單組件（StudentInfoForm、WisdomSelector、ToneSelector、EvaluationForm）
- [ ] Prompt 預覽組件（PromptPreview）
- [ ] 評語展示與歷史頁面（EvaluationResult、EvaluationHistory）
- [ ] 後台管理頁面（Admin 頁面、WisdomManager、ToneManager）
- [ ] 全局佈局與導航（Navbar、Layout）

### 第四階段：測試 & 部署準備 ⏳ 待開始
- [ ] 本地開發測試
- [ ] 環境配置文件（.env.example、.gitignore）
- [ ] GitHub 初始化 & 推送
- [ ] GitHub Actions CI/CD 設置

### 第五階段：部署到 Vercel ⏳ 待開始
- [ ] Vercel 項目配置
- [ ] 數據庫部署（Supabase PostgreSQL）
- [ ] 首次生產環境驗證

---

## 🔧 本地開發指南

### 環境要求
- Node.js >= 18
- npm
- Supabase 帳戶（已配置）
- Gemini API Key（已配置於 .env）

### 啟動開發服務器
```bash
npm run dev
# 或
yarn dev
```

訪問 http://localhost:3000

### 數據庫操作
```bash
# 生成 Prisma Client
npx prisma generate

# 執行資料庫遷移
npx prisma migrate dev --name <migration_name>

# 推送 schema 到資料庫（不創建遷移記錄）
npx prisma db push

# 填充初始數據
npx prisma db seed

# 查看資料庫（Prisma Studio）
npx prisma studio
```

### 檢查
```bash
npm run lint
```

---

## 📁 專案結構

```
academic-evaluation/
├── app/
│   ├── layout.tsx                  # 布局
│   ├── page.tsx                    # 首頁（評語生成表單）
│   ├── globals.css                 # 全局樣式
│   ├── api/
│   │   ├── prompt/
│   │   │   └── generate/route.ts   # 生成 prompt 預覽
│   │   ├── evaluation/
│   │   │   └── generate/route.ts   # 生成評語（調用 Gemini）
│   │   ├── evaluations/
│   │   │   ├── list/route.ts       # 獲取評語列表
│   │   │   └── [id]/route.ts       # 獲取評語詳情
│   │   └── admin/
│   │       ├── wisdoms/route.ts    # 箴言 CRUD
│   │       └── tones/route.ts      # 語氣 CRUD
│   ├── history/
│   │   └── page.tsx                # 評語歷史頁面
│   └── admin/
│       ├── page.tsx                # 後台管理首頁
│       ├── wisdoms/page.tsx        # 四字箴言管理
│       ├── tones/page.tsx          # 語氣管理
│       └── layout.tsx              # 後台佈局
├── components/
│   ├── ui/                         # shadcn/ui 組件
│   ├── StudentInfoForm.tsx         # 學生信息輸入
│   ├── WisdomSelector.tsx          # 箴言選擇器
│   ├── ToneSelector.tsx            # 語氣選擇器
│   ├── EvaluationForm.tsx          # 整合表單
│   ├── PromptPreview.tsx           # Prompt 預覽
│   ├── EvaluationResult.tsx        # 評語展示
│   ├── EvaluationHistory.tsx       # 歷史列表
│   ├── WisdomManager.tsx           # 箴言管理組件
│   └── ToneManager.tsx             # 語氣管理組件
├── lib/
│   ├── types.ts                    # TypeScript 類型定義
│   ├── gemini.ts                   # Gemini API 封裝
│   ├── prompts.ts                  # Prompt 模板引擎
│   ├── prisma.ts                   # Prisma Client 實例
│   └── utils.ts                    # 工具函數
├── prisma/
│   ├── schema.prisma               # Prisma 數據模型
│   ├── seed.ts                     # 初始化腳本
│   └── migrations/                 # 數據庫遷移記錄
├── public/                         # 公開資源
├── .github/
│   └── workflows/                  # GitHub Actions 流水線
├── .env                            # 環境變量範本（Git 追蹤）
├── .env.local                      # 本地環境變量（Git 忽略）
├── .gitignore                      # Git 忽略配置
├── package.json                    # 項目依賴
├── tsconfig.json                   # TypeScript 配置
├── tailwind.config.js              # Tailwind CSS 配置
├── next.config.ts                  # Next.js 配置
└── README.md                       # 項目說明文檔
```

---

## 🔐 環境變量

### 必需變量
```env
# Supabase PostgreSQL 連接
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Gemini API
GEMINI_API_KEY=AIzaSy...
NEXT_PUBLIC_GEMINI_MODEL=gemini-2.0-flash

# 後台管理
ADMIN_PASSWORD=your_secure_password
```

### 本地開發
- 複製 `.env` 為 `.env.local`
- 填入本地測試值或 Supabase 連接字符串

### Vercel 部署
- 在 Vercel Dashboard 添加上述環境變量
- Prisma 遷移命令：`npx prisma migrate deploy`

---

## 📝 開發約定

### 代碼風格
- 使用 TypeScript（強類型）
- 遵循 ESLint 配置
- Tailwind CSS 優先於自定義 CSS
- shadcn/ui 組件優先於自定義 UI

### 命名規範
- **組件：** PascalCase（e.g., `StudentInfoForm.tsx`）
- **文件：** kebab-case（e.g., `student-info-form.tsx`）
- **函數/變量：** camelCase
- **常量：** UPPER_SNAKE_CASE

### API 路由規則
- 使用 RESTful 風格
- 請求驗證：Zod schema
- 錯誤響應：統一格式
  ```json
  {
    "success": false,
    "error": "Error message",
    "code": "ERROR_CODE"
  }
  ```

---

## 🚀 下一步行動

### 立即待做（第二階段）
1. ✅ 驗證 Prisma schema 正確性
2. ✅ 執行資料庫遷移
   ```bash
   npx prisma migrate dev --name init
   ```
3. ✅ 驗證 Supabase 中表已創建
4. 📍 **現在：** 實現 Gemini API 層（lib/gemini.ts）
5. 📍 **接下來：** 實現 API 路由（/api/...）

### 後續（第三、四、五階段）
- 開發前端組件和頁面
- 進行本地測試
- 部署到 GitHub 和 Vercel

---

## 📚 參考資源

| 資源 | 鏈接 |
|------|------|
| Next.js 文檔 | https://nextjs.org/docs |
| Prisma 文檔 | https://www.prisma.io/docs |
| shadcn/ui | https://ui.shadcn.com |
| Gemini API | https://ai.google.dev |
| Supabase | https://supabase.com |
| Vercel | https://vercel.com |
| Tailwind CSS | https://tailwindcss.com |

---

## ❓ 常見問題

### Q: 數據庫連接失敗？
A: 檢查 `.env` 中的 `DATABASE_URL` 和 `DIRECT_URL` 是否正確。確認 Supabase 網絡連接正常。

### Q: Prisma schema 修改後如何同步？
A: 
```bash
npx prisma migrate dev  # 創建遷移
# 或
npx prisma db push     # 直接推送（開發環境）
```

### Q: 如何重置數據庫？
A: 
```bash
npx prisma migrate reset  # 清空所有表並重新執行遷移
```

### Q: 本地開發時環境變量加載失敗？
A: 確認 `.env.local` 存在且正確設置。重啟開發服務器。

### Q: TypeScript 報錯 "Type 'string | null' is not assignable to type 'string | undefined'"？
A: 這是 Prisma schema 中可選字段（`String?`）返回 `null` 而非 `undefined` 引起的。使用 nullish coalescing operator 轉換：
```typescript
// 錯誤 ❌
toneDescription: tone.description

// 正確 ✅
toneDescription: tone.description ?? undefined
```

### Q: TypeScript 報錯 "Type 'string | boolean' is not assignable to type 'boolean'"？
A: 短路求值 (`condition &&`) 返回的不是純布爾值。使用雙感嘆號強制轉換：
```typescript
// 錯誤 ❌
return (
  prompt &&
  prompt.length > 50
)

// 正確 ✅
return !!(
  prompt &&
  prompt.length > 50
)
```

---

**Last Updated:** 2026-04-06  
**Project Status:** Phase 2 (In Progress)  

## 📋 已解決的 TypeScript 問題

| 日期 | 文件 | 問題 | 解決方案 |
|------|------|------|----------|
| 2026-04-06 | lib/prompts.ts | null vs undefined 類型不匹配 | 使用 `??` nullish coalescing 轉換 |
| 2026-04-06 | lib/prompts.ts | 短路求值返回 boolean \| string | 使用 `!!` 強制轉換為 boolean |
