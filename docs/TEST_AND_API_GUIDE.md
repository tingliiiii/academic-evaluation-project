# 測試和 API 文檔指南

## 目錄

1. [查看 OpenAPI 文檔](#查看-openapi-文檔)
2. [運行測試](#運行測試)
3. [測試文件結構](#測試文件結構)
4. [API 端點列表](#api-端點列表)
5. [常見測試場景](#常見測試場景)

---

## 查看 OpenAPI 文檔

### 方式 1：使用 Swagger UI（推薦）

#### 設置 Swagger UI 服務器

1. **安裝依賴**（如果尚未安裝）
   ```bash
   npm install swagger-ui-express
   ```

2. **在 Next.js 中集成 Swagger UI**
   
   創建文件 `app/api/docs/route.ts`：
   ```typescript
   import { openApiSpec } from '@/lib/openapi';

   export async function GET() {
     return Response.json(openApiSpec);
   }
   ```

3. **創建 Swagger UI 頁面**
   
   在 `public/swagger.html` 創建：
   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <title>API 文檔</title>
     <meta charset="UTF-8"/>
     <meta name="viewport" content="width=device-width, initial-scale=1" />
     <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@3/swagger-ui.css" />
   </head>
   <body>
     <div id="swagger-ui"></div>
     <script src="https://unpkg.com/swagger-ui-dist@3/swagger-ui-bundle.js"></script>
     <script>
       window.onload = () => {
         SwaggerUIBundle({
           url: 'http://localhost:3000/api/docs',
           dom_id: '#swagger-ui',
           presets: [
             SwaggerUIBundle.presets.apis,
             SwaggerUIBundle.SwaggerUIStandalonePreset
           ],
           layout: "BaseLayout"
         });
       }
     </script>
   </body>
   </html>
   ```

4. **訪問 API 文檔**
   - 啟動開發服務器：`npm run dev`
   - 在瀏覽器打開：`http://localhost:3000/swagger.html`

### 方式 2：在 IDE 中查看源代碼

開啟文件 [lib/openapi.ts](lib/openapi.ts) 查看完整規範。

結構：
```
openApiSpec
├── info              // 基本信息
├── servers          // 伺服器列表
├── paths            // API 端點定義
│   ├── /api/auth/login
│   ├── /api/auth/logout
│   ├── /api/evaluations
│   ├── /api/evaluations/{id}
│   ├── /api/prompts/generate
│   ├── /api/admin/tones
│   └── /api/admin/wisdoms
└── components       // 數據模型定義
```

### 方式 3：導出為 JSON

在 Node.js REPL 中：
```bash
# 進入 Node.js
node

# 引入並導出
const { openApiSpec } = require('./lib/openapi.ts');
console.log(JSON.stringify(openApiSpec, null, 2));
```

---

## 運行測試

### 前置條件

1. **安裝依賴**
   ```bash
   npm install
   ```

2. **確保 Vitest 已安裝**
   ```bash
   npm list vitest
   ```
   若未安裝，執行：
   ```bash
   npm install --save-dev vitest
   ```

3. **配置測試環境**
   
   創建/確認文件 `vitest.config.ts`：
   ```typescript
   import { defineConfig } from 'vitest/config';

   export default defineConfig({
     test: {
       environment: 'node',
       globals: true,
     },
   });
   ```

### 運行所有測試

```bash
# 運行所有測試
npm run test

# 或者使用 vitest 直接
vitest

# 監視模式（自動重新運行）
vitest --watch
```

### 運行特定測試套件

```bash
# 僅運行 API 測試
npx vitest tests/api/

# 僅運行組件測試
npx vitest tests/components/

# 僅運行集成測試
npx vitest tests/integration/

# 運行特定文件
npx vitest tests/api/evaluations.test.ts
```

### 運行特定測試用例

```bash
# 運行包含 "應該成功生成評語" 的測試
npx vitest -t "應該成功生成評語"

# 運行 "POST /api/evaluations" 的所有測試
npx vitest -t "POST /api/evaluations"
```

### 查看測試覆蓋率

```bash
# 生成覆蓋率報告
npx vitest --coverage

# 以 HTML 格式查看
# 在 ./coverage/index.html 中打開
```

### 常用命令

```bash
# 在 package.json 中添加這些命令
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest --coverage",
    "test:api": "vitest tests/api/",
    "test:components": "vitest tests/components/",
    "test:integration": "vitest tests/integration/"
  }
}
```

---

## 測試文件結構

### 目錄布局

```
tests/
├── api/
│   └── evaluations.test.ts          [24 個測試用例]
│       ├── POST /api/evaluations    (7 個測試)
│       ├── GET /api/evaluations     (7 個測試)
│       ├── DELETE /api/evaluations  (2 個測試)
│       ├── Authentication           (2 個測試)
│       └── Error Handling           (3 個測試)
│
├── components/
│   ├── EvaluationForm.test.tsx      [60+ 個測試用例]
│   │   ├── 初始化
│   │   ├── 表單驗證
│   │   ├── 提交流程
│   │   ├── 錯誤處理
│   │   ├── 重試機制
│   │   └── 導航
│   │
│   ├── StudentInfoForm.test.tsx     [40+ 個測試用例]
│   │   ├── 渲染
│   │   ├── 輸入驗證
│   │   ├── 值變更
│   │   ├── 初始值重置
│   │   ├── 禁用狀態
│   │   └── 訪問性
│   │
│   ├── ToneSelector.test.tsx        [30+ 個測試用例]
│   ├── WisdomSelector.test.tsx      [50+ 個測試用例]
│   └── EvaluationHistory.test.tsx   [70+ 個測試用例]
│
└── integration/
    └── end-to-end.test.ts           [60+ 個測試用例]
        ├── 完整工作流程
        ├── 驗證失敗和重試
        ├── 批量操作
        ├── 搜索和刪除
        ├── 數據一致性
        ├── 權限和安全
        ├── 性能和超時
        ├── 用戶指導反饋
        ├── 邊界異常情況
        └── 真實場景模擬
```

### 每個測試文件的用途

| 文件 | 用途 | 何時使用 |
|-----|------|--------|
| `evaluations.test.ts` | API 端點測試 | 驗證後端邏輯、驗證規則、API 響應 |
| `EvaluationForm.test.tsx` | 表單組件測試 | 測試表單驗證、提交流程、錯誤處理 |
| `StudentInfoForm.test.tsx` | 輸入組件測試 | 測試文本輸入、驗證、字符限制 |
| `ToneSelector.test.tsx` | 選擇器測試 | 測試下拉選擇、數據加載 |
| `WisdomSelector.test.tsx` | 多選測試 | 測試複選框、多選邏輯、驗證 |
| `EvaluationHistory.test.tsx` | 列表組件測試 | 測試列表渲染、分頁、搜索、刪除 |
| `end-to-end.test.ts` | 集成測試 | 測試完整用戶工作流程 |

---

## API 端點列表

### 認證 (Authentication)

#### POST /api/auth/login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"your-password"}'
```
**期望響應 (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### POST /api/auth/logout
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer <token>"
```

### 評語 (Evaluations)

#### GET /api/evaluations
列出所有評語，支持分頁和搜索
```bash
curl "http://localhost:3000/api/evaluations?page=1&pageSize=10&studentName=張" \
  -H "Authorization: Bearer <token>"
```

**查詢參數:**
- `page` (可選): 頁碼，預設 1
- `pageSize` (可選): 每頁項目數，預設 10
- `studentName` (可選): 學生名稱搜索

#### POST /api/evaluations
生成新的評語
```bash
curl -X POST http://localhost:3000/api/evaluations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "studentName": "張三",
    "toneId": "encouraging",
    "wisdomIds": ["wisdom_1", "wisdom_2"],
    "prompt": "..."
  }'
```

#### GET /api/evaluations/{id}
取得特定評語詳情
```bash
curl http://localhost:3000/api/evaluations/eval_123 \
  -H "Authorization: Bearer <token>"
```

#### DELETE /api/evaluations/{id}
刪除評語
```bash
curl -X DELETE http://localhost:3000/api/evaluations/eval_123 \
  -H "Authorization: Bearer <token>"
```

### 提示詞 (Prompts)

#### POST /api/prompts/generate
生成提示詞預覽
```bash
curl -X POST http://localhost:3000/api/prompts/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "studentName": "張三",
    "toneId": "encouraging",
    "wisdomIds": ["wisdom_1"]
  }'
```

### 管理員 (Admin)

#### POST /api/admin/tones
建立新的語氣
```bash
curl -X POST http://localhost:3000/api/admin/tones \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"name":"鼓勵","description":"..."}' \
```

#### GET /api/admin/wisdoms
列出所有箴言
```bash
curl http://localhost:3000/api/admin/wisdoms \
  -H "Authorization: Bearer <token>"
```

---

## 常見測試場景

### 場景 1：完整的評語生成流程

```bash
#!/bin/bash

# 1. 登入
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"your-password"}' | jq -r '.token')

# 2. 取得語氣列表
curl -s http://localhost:3000/api/admin/tones \
  -H "Authorization: Bearer $TOKEN" | jq

# 3. 取得箴言列表
curl -s http://localhost:3000/api/admin/wisdoms \
  -H "Authorization: Bearer $TOKEN" | jq

# 4. 生成評語
EVAL_ID=$(curl -s -X POST http://localhost:3000/api/evaluations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "studentName":"張三",
    "toneId":"1",
    "wisdomIds":["1","2"],
    "prompt":"..."
  }' | jq -r '.id')

# 5. 查看詳情
curl -s http://localhost:3000/api/evaluations/$EVAL_ID \
  -H "Authorization: Bearer $TOKEN" | jq

# 6. 刪除評語
curl -X DELETE http://localhost:3000/api/evaluations/$EVAL_ID \
  -H "Authorization: Bearer $TOKEN"
```

### 場景 2：運行所有單元測試

```bash
cd /Users/liutingli/project/academic-evaluation

# 運行 API 測試
npm run test:api

# 運行組件測試
npm run test:components

# 運行集成測試
npm run test:integration

# 運行所有測試和生成覆蓋率
npm run test:coverage
```

### 場景 3：使用 Postman/Insomnia 進行手動測試

1. 導入 OpenAPI 規範：
   - 進入 Postman → File → Import
   - 選擇 URL：`http://localhost:3000/api/docs`
   - 自動導入所有端點

2. 設置環境變量：
   ```json
   {
     "base_url": "http://localhost:3000",
     "token": "eyJhbGciOiJIUzI1NiIs..."
   }
   ```

3. 使用變量調用 API：
   ```
   GET {{base_url}}/api/evaluations
   Header: Authorization: Bearer {{token}}
   ```

---

## 故障排除

### 問題：測試找不到模塊

**解決方案：**
```bash
# 確保 TypeScript 路徑別名配置正確
# 檢查 tsconfig.json 中的 paths
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### 問題：API 返回 401 Unauthorized

**解決方案：**
1. 確保有有效的令牌
2. 檢查令牌是否過期
3. 檢查 Authorization header 格式：`Bearer <token>`

### 問題：測試超時

**解決方案：**
增加超時時間：
```typescript
it('應該成功生成評語', async () => {
  // 測試代碼
}, 30000); // 30 秒超時
```

### 問題：Swagger UI 不顯示

**解決方案：**
1. 確保 `/api/docs` 端點正確配置
2. 檢查 CORS 設置
3. 在瀏覽器開發者工具中查看控制台錯誤

---

## 下一步

- 📖 閱讀 OpenAPI 規範：[lib/openapi.ts](lib/openapi.ts)
- 🧪 運行測試：`npm run test`
- 📊 查看覆蓋率：`npm run test:coverage`
- 🚀 設置 CI/CD：見 `.github/workflows/` 目錄

---

## 相關文件

- [OpenAPI 規範](lib/openapi.ts)
- [類型定義](lib/types.ts)
- [API 路由](app/api/)
- [測試套件](tests/)
