# 快速開始：測試和 API 文檔

## 🚀 5 分鐘上手

### 1. 查看 API 文檔（Swagger UI）

```bash
# 啟動開發伺服器
npm run dev

# 在瀏覽器中打開（會自動重定向）
# http://localhost:3000/swagger.html
```

**效果：** 交互式的 API 文檔頁面，可以直接測試 API

### 2. 查看 OpenAPI 規範（JSON）

```bash
# 方式 1：在瀏覽器中查看
# http://localhost:3000/api/docs

# 方式 2：在代碼編輯器中查看
# 打開 lib/openapi.ts
```

### 3. 運行所有測試

```bash
# 運行所有測試
npm run test

# 僅一次性運行（不監視）
npm run test:run

# 監視模式（文件變化時自動重新運行）
npm run test:watch

# 生成覆蓋率報告
npm run test:coverage
```

---

## 📋 測試命令速查表

| 命令 | 說明 | 何時使用 |
|-----|------|--------|
| `npm run test` | 運行所有測試（監視模式） | 開發期間實時測試 |
| `npm run test:run` | 一次性運行所有測試 | CI/CD 流程 |
| `npm run test:watch` | 監視模式 | 開發期間 |
| `npm run test:api` | 僅運行 API 測試 | 測試後端邏輯 |
| `npm run test:components` | 僅運行組件測試 | 測試 UI 組件 |
| `npm run test:integration` | 僅運行集成測試 | 測試完整工作流程 |
| `npm run test:coverage` | 生成覆蓋率報告 | 檢查測試覆蓋率 |

---

## 🧪 運行特定測試

### 運行單個文件的測試

```bash
npx vitest tests/api/evaluations.test.ts
```

### 運行匹配特定名稱的測試

```bash
# 運行所有包含 "成功生成評語" 的測試
npx vitest -t "成功生成評語"

# 運行所有 POST 相關測試
npx vitest -t "POST /api"
```

### 運行特定測試套件

```bash
# 只運行 API 目錄下的測試
npx vitest tests/api/

# 只運行組件測試
npx vitest tests/components/

# 只運行集成測試
npx vitest tests/integration/
```

---

## 📊 查看測試覆蓋率

```bash
# 生成覆蓋率報告
npm run test:coverage

# 在瀏覽器中查看 HTML 報告
open coverage/index.html
```

**覆蓋率指標：**
- Statements（語句）: 執行的代碼語句百分比
- Branches（分支）: if/else 等分支覆蓋率
- Functions（函數）: 被調用的函數百分比
- Lines（行）: 執行的代碼行百分比

---

## 🔍 使用 Postman 或 Insomnia 測試 API

### 導入 OpenAPI 規範

**Postman：**
1. File → Import
2. 選擇 "Link" 標籤
3. 粘貼：`http://localhost:3000/api/docs`
4. 自動導入所有端點

**Insomnia：**
1. Create → Import → From URL
2. 輸入：`http://localhost:3000/api/docs`
3. 自動導入所有端點

### 手動測試 API

```bash
# 登入
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"your-password"}'

# 取得評語列表
curl "http://localhost:3000/api/evaluations?page=1&pageSize=10" \
  -H "Authorization: Bearer YOUR_TOKEN"

# 生成評語
curl -X POST http://localhost:3000/api/evaluations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "studentName":"張三",
    "toneId":"1",
    "wisdomIds":["1","2"],
    "prompt":"..."
  }'
```

---

## 🐛 調試測試

### 在測試中添加日誌

```typescript
it('應該成功生成評語', async () => {
  const result = await generateEvaluation(...);
  
  console.log('結果:', result);  // 在測試輸出中查看
  console.log('詳細信息:', JSON.stringify(result, null, 2));
  
  expect(result.success).toBe(true);
});
```

運行測試時會顯示這些日誌。

### 同時打印和測試

```bash
# 運行時顯示所有 console.log
npx vitest --reporter=verbose
```

### 僅運行一個測試進行調試

```typescript
// 臨時修改 it() → it.only()
it.only('應該成功生成評語', async () => {
  // 只有這個測試會運行
});
```

---

## 📁 測試文件位置

```
tests/
├── api/
│   └── evaluations.test.ts       # API 端點測試
├── components/
│   ├── EvaluationForm.test.tsx
│   ├── StudentInfoForm.test.tsx
│   ├── ToneSelector.test.tsx
│   ├── WisdomSelector.test.tsx
│   └── EvaluationHistory.test.tsx
└── integration/
    └── end-to-end.test.ts        # 完整工作流程測試
```

---

## 🎯 最常見的工作流程

### 開發期間測試新功能

```bash
# 終端 1：啟動開發伺服器
npm run dev

# 終端 2：在監視模式下運行測試
npm run test:watch

# 編輯代碼時，測試會自動重新運行
```

### 提交代碼前驗證

```bash
# 運行所有測試一次
npm run test:run

# 檢查覆蓋率
npm run test:coverage

# 如果所有測試通過，提交 GitHub
git add .
git commit -m "feat: add new evaluation feature"
```

### 調查測試失敗

```bash
# 1. 查看失敗的測試名稱
npm run test:run

# 2. 只運行失敗的測試
npx vitest -t "failing test name"

# 3. 使用 --reporter=verbose 查看詳細信息
npx vitest --reporter=verbose

# 4. 查看源代碼和測試
# 編輯器中打開相應的測試文件，檢查斷言
```

---

## 📚 詳細文檔

看完本文檔後，查看：
- [完整測試和 API 指南](TEST_AND_API_GUIDE.md)
- [OpenAPI 規範](lib/openapi.ts)
- [API 路由源代碼](app/api/)
- [測試源代碼](tests/)

---

## 💡 常見問題

**Q: 為什麼某些測試失敗？**
A: 測試文件中的測試用例還未實現。目前它們只是框架和描述。可以逐步添加實際的測試邏輯。

**Q: 如何跳過某個測試？**
A: 使用 `it.skip()` 代替 `it()`：
```typescript
it.skip('暫時跳過的測試', () => {
  // 這個測試會被跳過
});
```

**Q: 如何只運行某個測試？**
A: 使用 `it.only()`：
```typescript
it.only('重要的測試', () => {
  // 只有這個測試會運行
});
```

**Q: 測試超時了怎麼辦？**
A: 增加超時時間：
```typescript
it('長時間操作', async () => {
  // 測試代碼
}, 60000); // 60 秒
```

**Q: 覆蓋率報告在哪裡？**
A: 執行 `npm run test:coverage` 後，在 `coverage/` 目錄中，用瀏覽器打開 `index.html`。

---

## 🔗 相關資源

- [Vitest 官方文檔](https://vitest.dev)
- [OpenAPI 3.0 規範](https://spec.openapis.org/oas/v3.0.0)
- [Google Gemini API 文檔](https://ai.google.dev)
- [Next.js 測試文檔](https://nextjs.org/docs/app/building-your-application/testing)
