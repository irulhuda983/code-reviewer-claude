# 前端 Code Review 檢核清單

> 本檢核清單適用於 **Next.js + React + TypeScript** 技術棧的前端專案。
> 基於內部專案 (`ai-training-partner`、`ai-training-partner-admin`) 的最佳實踐整理而成。
> 實際技術版本與架構請參考各專案的 `package.json`，部分檢核項目可能需依實際專案調整。

---

## 目錄

- [AI Code Review 核心檢核清單](#ai-code-review-核心檢核清單)（推薦 AI 優先使用）
- [快速檢核表](#快速檢核表)（開發者自檢用）
- [1. 架構與設計](#1-架構與設計-architecture--design)
- [2. 程式碼風格與品質](#2-程式碼風格與品質-code-style--quality)
- [3. React / Next.js 最佳實踐](#3-react--nextjs-最佳實踐-best-practices)
- [4. 狀態管理與資料流](#4-狀態管理與資料流-state-management--data-flow)
- [5. 安全性](#5-安全性-security)
- [6. 錯誤處理與邊界情境](#6-錯誤處理與邊界情境-error-handling--edge-cases)
- [7. 效能優化](#7-效能優化-performance-optimization)
- [8. 測試與驗證](#8-測試與驗證-testing--validation)
- [9. 套件與依賴管理](#9-套件與依賴管理-package-management)
- [10. MR 流程與協作規範](#10-mr-流程與協作規範-mr-workflow--collaboration)
- [常見風險與錯誤模式](#常見風險與錯誤模式)
- [進階參考](#進階參考)
- [參考資源](#參考資源)

---

## AI Code Review 核心檢核清單

> **使用說明**
>
> - 本清單專為 AI Code Review 設計，聚焦核心原則與關鍵風險
> - 檢核時應依據專案架構（SSR/CSR）調整檢核標準
> - 發現問題時可參考詳細章節獲取更多說明

### 🔴 嚴重問題（必須修正）

#### 安全性

- [ ] **無硬編碼敏感資訊**：API Key、Token、密碼未出現在程式碼中
- [ ] **Token 儲存安全**：未使用 localStorage 儲存敏感 Token（應使用 httpOnly Cookie）
- [ ] **環境變數正確使用**：敏感資訊透過環境變數管理，且已在 `env.mjs` 中定義驗證
- [ ] **XSS 防護**：避免使用 `dangerouslySetInnerHTML`，若必須使用需先 sanitize

#### 錯誤處理

- [ ] **API 呼叫有錯誤處理**：所有 API 呼叫都處理 loading、error、empty 狀態
- [ ] **錯誤訊息友善**：錯誤情況下顯示使用者友善的訊息
- [ ] **避免未捕獲的 Promise**：async 函式有適當的錯誤處理

#### 型別安全

- [ ] **無 TypeScript 錯誤**：程式碼通過型別檢查
- [ ] **避免使用 any**：不使用 `any` 型別（特殊情況需註解說明）
- [ ] **型別定義完整**：函式參數、回傳值、元件 Props 都有明確型別

### 🟡 重要問題（應該修正）

#### 程式碼品質

- [ ] **程式碼通過基本檢查**：通過 lint、type-check、build（CI/CD 會自動執行）
- [ ] **移除調試程式碼**：無不必要的 `console.log`、註解掉的程式碼、未使用的 import
- [ ] **移除 Mock Data**：若已完成 API 串接，確保移除測試用的 mock data（若為純 UI MR 則不適用）
- [ ] **API 環境同步**：串接的 API 已上版至對應環境，非 local API（若有 API 串接）
- [ ] **適當的註解**：複雜元件或邏輯有註解說明
- [ ] **元件職責單一**：元件遵循單一職責原則，不過度複雜
- [ ] **避免重複程式碼**：重複邏輯抽取為 Custom Hooks 或 Utils
- [ ] **命名清晰**：變數、函式、元件命名有意義且一致

#### React 最佳實踐

- [ ] **useEffect 依賴完整**：useEffect 依賴陣列包含所有使用的變數
- [ ] **useEffect Cleanup**：有適當的 cleanup 邏輯，避免記憶體洩漏
- [ ] **Key Props 正確**：列表渲染使用穩定且唯一的 key（避免用 index）
- [ ] **避免不必要的 re-render**：適當使用 useMemo、useCallback（針對效能瓶頸）

#### 資料流管理

- [ ] **狀態放置合理**：區分本地狀態（useState）、伺服器狀態、全域狀態（Context）
- [ ] **資料獲取方式正確**（依專案架構而定）：
  - **ai-training-partner**：使用 React Query（useQuery / useMutation），mutation 成功後 invalidate 相關 queries
  - **ai-training-partner-admin**：優先使用 Server Components 直接獲取資料，或在 Client Components 中使用 useState + useEffect

### 🟢 建議改進（可選）

#### 架構設計

- [ ] **檔案結構一致**：遵循專案既有的資料夾與檔案組織方式
- [ ] **使用既有元件**：優先使用專案既有的 UI 元件（如 shadcn/ui），避免重複造輪子
- [ ] **容器與展示分離**：Page 負責資料獲取，Component 負責 UI 渲染
- [ ] **適當的元件拆分**：元件大小適中，可重用性高

#### 效能優化

- [ ] **圖片優化**：根據專案架構選擇適當方案（Next.js Image / 原生 img）
- [ ] **Code Splitting**：大型元件使用 dynamic import 延遲載入
- [ ] **避免過度優化**：不在非瓶頸處過度使用 memo/useMemo
- [ ] **Bundle 大小**：避免引入不必要的大型函式庫

#### 使用者體驗

- [ ] **Loading 狀態**：資料載入時有適當的 loading 提示
- [ ] **Empty 狀態**：資料為空時有友善的提示
- [ ] **防止重複操作**：提交按鈕避免重複點擊（使用 loading 狀態）
- [ ] **響應式設計**：在不同螢幕尺寸下正常顯示（若專案有要求）

#### 測試與文件

- [ ] **測試覆蓋**：重要功能有適當的測試覆蓋（若專案有要求）
- [ ] **Error Boundary**：關鍵區域使用 Error Boundary 捕捉錯誤

### 📋 MR 品質檢查

- [ ] **MR Description 完整**：包含功能說明、變更內容、測試情境
- [ ] **提供截圖/影片**：展示功能運作情況
- [ ] **程式碼通過 CI/CD**：lint、type-check、build 都成功
- [ ] **處理 Review Comments**：所有 comment thread 都有回覆或處理

---

## 快速檢核表

> 此清單供開發者提交 MR 前自檢使用

提交 MR 前，請確認以下基本項目：

### 必要項目 (Must Have)

- [ ] 程式碼通過 `npm run lint` 檢查
- [ ] 程式碼通過 TypeScript 型別檢查（註：在執行 `npm run build` 時會自動檢查）
- [ ] 程式碼通過 `npm run build` 建置成功（註：CI/CD 會在 MR 階段自動執行此檢查）
- [ ] 敏感資訊（API Key、Token）未硬編碼
- [ ] 所有 API 呼叫都有錯誤處理（loading / error / empty state）
- [ ] 串接的 API 已上版至對應環境（非 local API；若有 API 串接）
- [ ] MR Description 包含完整測試情境與截圖/影片
- [ ] 不必要的 `console.log`、註解掉的程式碼已移除
- [ ] 測試用 Mock Data 已移除（若已完成 API 串接；純 UI MR 不適用）

### 建議項目 (Should Have)

- [ ] 複雜元件或邏輯有適當的註解
- [ ] 使用既有的 UI 元件（如 shadcn/ui），避免重複造輪子
- [ ] 遵循專案既有的檔案命名與資料夾結構
- [ ] 重要功能有適當的測試覆蓋（若專案有測試需求）
- [ ] 響應式設計在不同螢幕尺寸都正常

---

## 1. 架構與設計 (Architecture & Design)

### 檢核項目

- [ ] **檔案結構一致性**：遵循專案既有的資料夾與檔案組織方式
- [ ] **元件職責單一**：每個元件只負責一件事，避免過度複雜
- [ ] **容器與展示元件分離**：Page 處理資料獲取，Component 負責 UI 渲染
- [ ] **共用邏輯抽取**：重複的邏輯抽取為 Custom Hooks 或 Utils
- [ ] **避免循環依賴**：檔案之間不應該有循環引用
- [ ] **合理的元件拆分**：單一元件關注點是否單一(Single Responsibility)，是否能被重複使用，是否狀態與資料流清楚

### 設計原則

#### 容器與展示元件分離

**原則：** Page 負責資料獲取與狀態管理，Component 負責 UI 渲染

```tsx
// ✅ Page 處理資料邏輯
export default function ProfilePage() {
  const { data, isLoading, isError } = useUserProfile();
  if (isLoading) return <LoadingSpinner />;
  return <ProfileCard user={data} />;
}

// ✅ Component 純粹負責 UI
export function ProfileCard({ user }: { user: User }) {
  return <Card>{user.name}</Card>;
}

// ❌ 避免：UI 元件中混雜資料獲取
export function ProfileCard() {
  const [user, setUser] = useState(null);
  useEffect(() => { fetch('/api/user')... }, []); // ❌
  return <Card>...</Card>;
}
```

#### 共用邏輯抽取

**原則：** 重複的邏輯抽取為 Custom Hooks 或 Utils

```tsx
// ✅ 抽取為 Custom Hook
export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserProfile(userId),
  });
}

// ❌ 避免：直接在元件中重複 API 呼叫邏輯
```

#### 檔案組織

**原則：** 依據功能或類型組織檔案，保持結構清晰

參考現有專案結構（`src/app/`, `src/components/`, `src/hooks/`, `src/lib/`），保持一致性。

---

## 2. 程式碼風格與品質 (Code Style & Quality)

### 檢核項目

- [ ] **命名規範**：
  - 元件：`PascalCase` (如 `UserProfile`, `LoginForm`)
  - 函式/變數：`camelCase` (如 `getUserData`, `isLoading`)
  - 常數：`UPPER_SNAKE_CASE` (如 `MAX_FILE_SIZE`, `API_BASE_URL`)
  - 檔案：依照專案慣例（檢查現有專案風格）
- [ ] **TypeScript 型別**：所有函式參數和回傳值都有明確型別
- [ ] **避免 any**：不使用 `any` 型別（特殊情況需註解說明原因）
- [ ] **格式化一致**：通過 Prettier/ESLint 格式化
- [ ] **移除無用程式碼**：刪除未使用的 import、變數、函式、console.log、註解掉的程式碼
- [ ] **註解品質**：複雜邏輯有適當註解，避免過時或誤導的註解

### TypeScript 型別規範

#### Interface vs Type 使用時機

- **Interface**：定義物件結構、元件 Props、資料模型（可擴展）
- **Type**：聯合型別、交集型別、函式型別、複雜型別組合

```typescript
// ✅ Interface 用於物件結構
interface User {
  id: string;
  name: string;
}

// ✅ Type 用於聯合型別
type Status = "pending" | "active" | "inactive";
type ApiResponse<T> = { success: true; data: T } | { success: false; error: string };

// ✅ 函式有完整型別
async function fetchUser(userId: string): Promise<User> { ... }

// ❌ 避免：缺少型別
function fetchUser(userId) { ... } // ❌
```

### 程式碼整潔度

```typescript
// ❌ 避免：無用程式碼、調試訊息、測試資料
import { useState, useMemo } from "react"; // ❌ useMemo 未使用
console.log("debug"); // ❌ 調試訊息
const unused = () => {}; // ❌ 未使用的函式
const mockData = [{ id: 1, name: "test" }]; // ❌ 若已串接 API 應移除

// ✅ 正確：乾淨簡潔
import { useState } from "react";
```

#### Mock Data 使用原則

**開發階段：**

- ✅ API 尚未完成時，可使用 mock data 進行 UI 開發
- ✅ Mock data 應定義明確的型別（與實際 API 一致）
- ✅ 建議將 mock data 放在獨立檔案 或在元件中清楚定義
- **提交 MR 時：**

- ✅ **純 UI MR**：可保留 mock data（需在 MR Description 中說明）
- ❌ **API 串接完成的 MR**：必須移除 mock data，使用實際 API
- ⚠️ **部分串接的 MR**：需在程式碼註解中標註哪些使用 mock、哪些使用實際 API

```typescript
// ❌ 避免：API 已串接但仍使用 mock data
const mockUsers = [{ id: 1, name: "Mock User" }];
return <UserList users={mockUsers} />;

// ✅ 純 UI MR：保留 mock data（需在 MR 中說明）
// TODO: 待 API 完成後移除 mock data
const mockUsers: User[] = [{ id: 1, name: "Mock User" }];
return <UserList users={mockUsers} />;

// ✅ 正確：使用實際 API
const { data: users } = useGetUsers();
return <UserList users={users} />;
```

#### API 環境同步原則

**🚨 重要：避免 API 環境不同步導致的問題**

- ❌ **禁止**：串接 local 開發環境的 API 就發布 MR
- ❌ **禁止**：串接尚未上版的 API 就發布 MR
- ✅ **必須**：確認後端 API 已上版到對應環境（staging/main）
- ✅ **必須**：MR 中使用的 API 與目標環境的 API 版本一致

**環境對齊檢查：**

```typescript
// ❌ 避免：使用 local API 或未上版的 API
const API_URL = "http://localhost:3001/api"; // 僅供 local 開發
const { data } = useQuery(
  ["users"],
  () => fetch(`${API_URL}/users-new-endpoint`).then((r) => r.json()), // 新 endpoint 尚未上版
);

// ✅ 正確：使用已上版的 API endpoint
const { data } = useQuery(
  ["users"],
  () => fetch("/api/users").then((r) => r.json()), // 已在 staging/production 上版
);
```

**MR 發布前確認清單：**

- [ ] 確認後端 API 已上版至對應環境（staging/main）
- [ ] API endpoint 與參數格式與目標環境一致
- [ ] 已在目標環境（非 local）測試 API 串接正常
- [ ] MR Description 中註明對應的後端 API endpoint

---

## 3. React / Next.js 最佳實踐 (Best Practices)

> **註：依據專案架構調整（SSR 適用所有項目；CSR 靜態導出需調整 Server Components、Image 優化等）**

### 檢核項目

- [ ] **Server/Client Components 正確使用**：（僅 SSR）預設用 Server Components，需互動才用 `'use client'`
- [ ] **避免不必要的 re-render**：針對效能瓶頸使用 `useMemo`, `useCallback`, `React.memo`
- [ ] **Key Props 正確性**：列表使用穩定唯一的 key（避免用 index）
- [ ] **useEffect 依賴項完整**：依賴陣列包含所有使用的變數
- [ ] **useEffect Cleanup**：處理 cleanup 避免記憶體洩漏
- [ ] **圖片優化**：依據專案選擇方案（Next.js Image / 原生 img + 手動優化）
- [ ] **路由導航**：使用 Next.js `Link` 或 `useRouter`，避免原生 `<a>`

### 核心原則

#### useEffect 使用

```tsx
// ❌ 避免：遺漏依賴、未處理 cleanup
useEffect(() => {
  fetchUser(userId); // ❌ userId 未在依賴中
}, []);

// ✅ 正確：完整依賴 + cleanup
useEffect(() => {
  const controller = new AbortController();
  fetchData(userId, { signal: controller.signal });
  return () => controller.abort(); // cleanup
}, [userId]); // 完整依賴
```

#### Key Props

```tsx
// ❌ 避免：使用 index
items.map((item, index) => <li key={index}>{item.name}</li>);

// ✅ 正確：使用唯一 ID
items.map((item) => <li key={item.id}>{item.name}</li>);
```

#### 效能優化

```tsx
// ⚠️ 僅在效能瓶頸處使用
const memoValue = useMemo(() => expensiveCalc(data), [data]);
const memoCallback = useCallback(() => handleClick(), []);

// ❌ 避免：過度優化非瓶頸處
```

#### 圖片與導航

```tsx
// ✅ 圖片：依專案架構選擇
<Image src="..." /> // SSR 或 CSR with unoptimized
<img src="..." loading="lazy" /> // CSR 手動優化

// ✅ 導航：使用 Next.js 元件
<Link href="/path">Link</Link>
router.push('/path')
```

````

---

## 4. 狀態管理與資料流 (State Management & Data Flow)

### 檢核項目

- [ ] **資料獲取方式正確**（依專案架構而定）：
  - **ai-training-partner**：使用 React Query（`useQuery` / `useMutation`），設定適當的 `queryKey` 和 `staleTime`，mutation 成功後 `invalidateQueries`
  - **ai-training-partner-admin**：優先使用 Server Components 直接獲取資料，需要互動性時才使用 Client Components + `useState` / `useEffect`
- [ ] **狀態放置位置正確**：
  - 本地 UI 狀態：`useState`
  - 伺服器狀態：依專案架構選擇（React Query / Server Components）
  - 全域狀態：Context 或狀態管理庫
- [ ] **避免競態條件**：連續操作使用適當的同步機制（如 `mutateAsync` 或 `await`）

### 核心原則

#### 資料獲取方式（依專案架構）

**ai-training-partner（Static Export + React Query）**

```typescript
// ✅ useQuery 獲取資料
export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserProfile(userId),
    staleTime: 5 * 60 * 1000,
  });
}

// ✅ useMutation 變更資料
export function useUpdateUser(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
  });
}
```

**ai-training-partner-admin（SSR + Server Components）**

```typescript
// ✅ Server Component 直接獲取資料
export default async function UserProfilePage({ params }: { params: { userId: string } }) {
  const user = await getUserProfile(params.userId);
  return <ProfileCard user={user} />;
}

// ✅ Client Component 使用 useState + useEffect
'use client';
export function UserProfileClient({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getUserProfile(userId).then(setUser).finally(() => setIsLoading(false));
  }, [userId]);

  if (isLoading) return <LoadingSpinner />;
  return <ProfileCard user={user} />;
}
````

#### 狀態分類

```tsx
// ✅ 本地 UI 狀態
const [isOpen, setIsOpen] = useState(false);

// ✅ 伺服器狀態（ai-training-partner 使用 React Query）
const { data } = useUserProfile(userId);

// ✅ 伺服器狀態（ai-training-partner-admin 使用 Server Components）
// 在 Server Component 中直接 await
const user = await getUserProfile(userId);

// ✅ 全域狀態
const ThemeContext = createContext<"light" | "dark">("light");
```

#### 避免競態條件

```typescript
// ❌ 避免：連續非同步操作未等待
mutate1();
mutate2(); // 可能衝突

// ✅ 正確：使用 async/await（React Query）
await mutateAsync1();
await mutateAsync2();

// ✅ 正確：使用 Promise.then 鏈
mutate1().then(() => mutate2());
```

---

## 5. 安全性 (Security)

### 檢核項目

- [ ] **無硬編碼敏感資訊**：API Key、Token、密碼使用環境變數
- [ ] **Token 儲存安全**：
  - ❌ 避免用 localStorage 存 JWT Token（XSS 風險）
  - ✅ 使用 httpOnly Cookie（推薦）或 sessionStorage
- [ ] **XSS 防護**：避免 `dangerouslySetInnerHTML`，必須使用時需 sanitize
- [ ] **API 金鑰保護**：敏感 API Key 不暴露到前端（使用 Server Component / API Route）
- [ ] **輸入驗證**：所有表單輸入驗證（使用 Zod / Yup）
- [ ] **環境變數驗證**：在 `env.mjs` 中定義並驗證環境變數

### 核心原則

#### 環境變數管理

```typescript
// ✅ 在 src/env.mjs 中驗證環境變數
export const env = createEnv({
  server: {
    AUTH_SECRET: z.string().min(1), // 不會暴露到前端
    API_KEY: z.string(),
  },
  client: {
    NEXT_PUBLIC_APP_NAME: z.string(), // 暴露到前端（需 NEXT_PUBLIC_ 前綴）
  },
  runtimeEnv: { ... },
});

// ❌ 避免：硬編碼
const API_KEY = "sk-123..."; // ❌ 絕對不要
```

#### Token 儲存

```typescript
// ❌ 避免：localStorage（XSS 風險）
localStorage.setItem("token", token); // ❌

// ✅ 推薦：httpOnly Cookie
cookies().set("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
});

// ✅ 次要選擇：sessionStorage
sessionStorage.setItem("token", token);
```

#### XSS 防護

```tsx
// ❌ 避免
<div dangerouslySetInnerHTML={{ __html: userInput }} />; // ❌

// ✅ React 自動轉義
<div>{userInput}</div>; // ✅

// ✅ 必須用時先 sanitize
const clean = DOMPurify.sanitize(html);
<div dangerouslySetInnerHTML={{ __html: clean }} />;
```

#### API 金鑰保護

```typescript
// ❌ 避免：前端暴露 API Key
fetch(url, {
  headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}` },
}); // ❌

// ✅ 使用 API Route 或 Server Component
// app/api/data/route.ts
export async function GET() {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.API_KEY}` }, // ✅ 僅伺服器端
  });
  return Response.json(await response.json());
}
```

#### 輸入驗證

```typescript
// ✅ 使用 Zod 驗證
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const validated = schema.parse(userInput); // throws if invalid
```

````

---

## 6. 錯誤處理與邊界情境 (Error Handling & Edge Cases)

### 檢核項目

- [ ] **完整的狀態處理**：Loading / Error / Empty / Success 狀態都有處理
- [ ] **API 錯誤分類**：400/401/403/404/409/422/429/500 等錯誤有適當處理與提示
- [ ] **邊界情境**：空值（null/undefined）、空陣列、極端數值都有處理
- [ ] **防止重複操作**：提交按鈕使用 loading 狀態禁用
- [ ] **Error Boundary**：關鍵區域使用 Error Boundary 捕捉錯誤

### 核心原則

#### 完整狀態處理

```tsx
// ✅ 處理所有狀態
export function UserProfilePage({ userId }: { userId: string }) {
  const { data, isLoading, isError, error } = useUserProfile(userId);

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage message={error.message} />;
  if (!data) return <EmptyState message="User not found" />;

  return <ProfileCard user={data} />;
}
```


#### 防止重複點擊

```tsx
// ✅ 使用 loading 狀態
export function SubmitButton() {
  const { mutate, isPending } = useSubmitForm();

  return (
    <button onClick={() => mutate()} disabled={isPending}>
      {isPending ? "Submitting..." : "Submit"}
    </button>
  );
}
```

#### 邊界情境處理

```typescript
// ✅ 處理空值與極端情況
function formatName(user?: { firstName?: string }): string {
  return user?.firstName?.trim() || 'Anonymous';
}

function renderList(items: Item[]) {
  if (items.length === 0) return <EmptyState />;
  return <List items={items} />;
}

function calculateProgress(current: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, (current / total) * 100));
}
```

---

## 7. 效能優化 (Performance Optimization)

### 檢核項目

- [ ] **圖片優化**：依專案架構使用適當方案（Next.js Image / 原生 img + 優化）
- [ ] **Code Splitting**：大型元件使用 `dynamic()` 延遲載入
- [ ] **快取策略**：依專案選擇適當方案（ai-training-partner: React Query 的 `staleTime` 和 `gcTime`）
- [ ] **Bundle 大小**：避免引入不必要的大型函式庫
- [ ] **防抖與節流**：搜尋輸入使用 debounce，滾動事件使用 throttle
- [ ] **避免過度優化**：僅在效能瓶頸處使用 memo/useMemo

### 核心原則

#### Code Splitting

```tsx
// ✅ 延遲載入大型元件
import dynamic from "next/dynamic";

const HeavyChart = dynamic(() => import("@/components/HeavyChart"), {
  loading: () => <LoadingSpinner />,
  ssr: false, // CSR 專案或不需 SSR 時
});
```

#### 防抖（Debounce）

```typescript
// ✅ 搜尋輸入使用 debounce
export function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  const { data } = useSearchResults(debouncedQuery);

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

#### 快取策略（ai-training-partner）

**React Query 快取設定**

```typescript
// ✅ 適當設定 staleTime
useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  staleTime: 5 * 60 * 1000, // 5 分鐘內不重新獲取
});

// ✅ 預載資料
queryClient.prefetchQuery({ queryKey: ['user', id], queryFn: () => fetchUser(id) });
```

**ai-training-partner-admin 注意事項**

- Server Components 預設會快取，需要時可使用 `fetch` 的 `cache` 選項
- 使用 `revalidate` 控制資料重新驗證時間

#### 避免過度優化

```tsx
// ⚠️ 僅在效能瓶頸處使用
const memoValue = useMemo(() => expensiveCalc(data), [data]);

// ❌ 避免：簡單運算不需要 memo
const sum = useMemo(() => a + b, [a, b]); // 不必要
```

---

## 8. 測試與驗證 (Testing & Validation)

### 檢核項目

- [ ] **MR 測試要求**：
  - MR Description 包含完整測試情境
  - 提供實際操作的截圖或影片
  - 測試情境涵蓋正常流程與錯誤情境
- [ ] **跨瀏覽器測試**：
  - 在 Chrome、Safari、Firefox 測試（依專案需求）
- [ ] **響應式測試**：
  - 測試不同螢幕尺寸（手機、平板、桌面）
- [ ] **功能測試**：
  - 正常流程運作正常
  - 錯誤情境顯示正確錯誤訊息
  - 重新整理頁面不會遺失狀態（若需要）
  - 返回上一頁行為正確
- [ ] **單元測試**（若專案有要求）：
  - 工具函式有測試
  - Custom Hooks 有測試
  - 關鍵元件有測試

### 本地測試檢查清單

在提交 MR 前，請完成以下測試：

#### 功能測試

- [ ] 正常流程：功能運作正常
- [ ] 錯誤流程：
  - API 失敗時顯示錯誤訊息
  - 網路離線時的行為
  - 表單驗證錯誤提示
- [ ] 邊界情境：
  - 空資料時的顯示
  - 超長文字的處理
  - 特殊字元輸入
- [ ] 重新載入測試：
  - 重新整理頁面是否正常
  - 返回上一頁是否正常
  - 直接存取 URL 是否正常

#### 響應式測試

- [ ] 手機 (375px-767px)
- [ ] 平板 (768px-1023px)
- [ ] 桌面 (1024px+)
- [ ] 橫向與直向模式

#### 效能測試

- [ ] 頁面載入時間合理
- [ ] 圖片正確載入且最佳化
- [ ] 無不必要的網路請求
- [ ] 無 console 錯誤或警告

---

## 9. 套件與依賴管理 (Package Management)

### 檢核項目

- [ ] **套件更新評估**：
  - 確認更新不會破壞現有功能
  - 特別注意 Major 版本更新的 breaking changes
  - 更新後執行完整測試
- [ ] **避免重複依賴**：
  - 檢查是否已有類似功能的套件
  - 優先使用專案既有的套件
- [ ] **套件大小評估**：
  - 評估新套件對 bundle 大小的影響
  - 考慮使用更輕量的替代方案
- [ ] **使用既有元件**：
  - 優先使用 shadcn/ui 元件
  - 避免安裝功能重複的 UI 函式庫


### 新增套件評估

```bash
# 在新增套件前，先評估：
# 1. 是否真的需要？能否用既有功能實現？
# 2. 套件大小？使用 bundlephobia.com 查詢
# 3. 維護狀況？最後更新時間、issue 數量
# 4. 社群評價？GitHub stars、npm downloads

# 範例：新增日期處理函式庫
# ❌ moment.js (332 KB) - 過大且已停止維護
# ❌ dayjs (6.5 KB) - 較小，但專案已有 date-fns
# ✅ date-fns (已在專案中) - 使用既有套件
```

---

## 10. MR 流程與協作規範 (MR Workflow & Collaboration)

### 檢核項目

- [ ] **MR 範圍明確**：
  - 一個 MR 只處理一個功能或修正
  - MR 不會過大（建議 < 500 行變更）
- [ ] **MR Description 完整**：
  - 說明此 MR 的目的
  - 列出主要變更內容
  - 提供測試情境與步驟
  - 附上截圖或操作影片
  - 標註相關 Issue
- [ ] **Branch 命名規範**：
  - `feature/功能名稱`
  - `fix/修正項目`
  - `refactor/修正項目`
- [ ] **Commit Message 規範**：
  - 使用 Conventional Commits
  - 用英文撰寫
- [ ] **Rebase develop**：
  - 發布 MR 前 rebase 最新的 develop
  - 使用 `--force-with-lease` 推送
- [ ] **CI/CD Pipeline 通過**：
  - ESLint 檢查通過
  - TypeScript 型別檢查通過
  - Build 成功
- [ ] **Review Comments 處理**：
  - 所有 comment thread 都有回覆
  - 修改後通知 reviewer

### MR Description 模板

```markdown
## Description

簡述此 MR 完成的功能或修復的問題。

## Changes

- 新增使用者個人資料頁面
- 實作個人資料編輯功能
- 新增頭像上傳功能

## Test Plan

### 測試情境 1：查看個人資料

1. 登入系統
2. 點擊右上角頭像
3. 點擊「個人資料」
4. 驗證資料正確顯示

![Profile View](screenshot-1.png)

### 測試情境 2：編輯個人資料

1. 在個人資料頁面點擊「編輯」
2. 修改姓名和 Email
3. 點擊「儲存」
4. 驗證資料已更新

![Profile Edit](demo.gif)

### 測試情境 3：錯誤處理

1. 嘗試輸入無效的 Email 格式
2. 驗證顯示錯誤訊息
3. 模擬 API 失敗情境
4. 驗證顯示適當的錯誤提示

## Related Issues

Closes #123
Relates to #124

## Checklist

- [x] 程式碼通過 lint 和 type-check
- [x] 已在本地測試所有情境
- [x] 已測試響應式設計
- [x] 已移除不必要的 console.log
- [x] 已更新相關文件（若需要）
```

### 協作開發原則

#### 避免的行為

- ❌ MR 已進入 review，又 push 大量新功能
- ❌ MR 閒置過久沒有通知 reviewer
- ❌ 未處理 review comments 就要求 merge
- ❌ 在一個 MR 中修改無關的程式碼
- ❌ Description 與最終程式碼不一致

#### 建議的行為

- ✅ MR 範圍明確且可獨立 review
- ✅ 主動通知 reviewer 進度
- ✅ 及時回覆 review comments
- ✅ 有新 commit 時更新 description
- ✅ 定期 rebase develop 保持同步

---

## 常見風險與錯誤模式

### 🔴 安全風險

1. **localStorage 儲存敏感 Token** - XSS 攻擊風險 → 使用 httpOnly Cookie
2. **dangerouslySetInnerHTML 未 sanitize** - XSS 攻擊風險 → 使用 DOMPurify 或避免使用
3. **環境變數未驗證** - 部署失敗風險 → 在 `env.mjs` 中定義驗證

### 🟡 邏輯錯誤

4. **競態條件** - 快取不一致或資料衝突 → 使用適當的同步機制（如 `mutateAsync`、`await`、Promise 鏈）
5. **useEffect 無限迴圈** - 效能問題 → 檢查依賴項，避免在 effect 中修改依賴
6. **useEffect 缺少 cleanup** - 記憶體洩漏 → 返回 cleanup 函式
7. **API 環境不同步** - 串接 local 或未上版的 API → merge 後系統錯誤 → 確認 API 已上版至對應環境
8. **API 已串接但保留 mock data** - 資料不一致 → 移除 mock data，使用實際 API

```tsx
// ❌ 無限迴圈
useEffect(() => {
  setData(processData(data)); // 修改依賴項
}, [data]);

// ✅ 正確
useEffect(() => {
  const controller = new AbortController();
  fetchData({ signal: controller.signal });
  return () => controller.abort(); // cleanup
}, []);
```

### 🟢 協作問題

9. **MR 測試資料過時** - push 新 commit 後未更新截圖/影片 → 及時更新 description
10. **環境變數未記錄** - 團隊成員無法運行 → 在 MR 中說明新增的環境變數

---

## 進階參考

> **說明**：本檢核清單已精簡為核心原則與關鍵範例。若需要更詳細的實作範例，請參考以下資源。

### 完整實作範例請參考

- **Error Boundary 完整實作**：參考 React 官方文件
- **API Client 完整實作**：參考專案現有的 `lib/api/client.ts`
- **React Query 進階模式**：參考 TanStack Query 官方文件
- **環境變數驗證範本**：參考專案 `src/env.mjs`

---

## 參考資源

### 內部文件

- [Development Workflow](./development-workflow.md)
- [Code Review Report Template](./code-review-report-template.md)
- [Code Review Prompt](./code-review-prompt.md)
- [README - 使用指南](./README.md)

### 外部參考

- [Next.js Best Practices](https://nextjs.org/docs/app/building-your-application)
- [React Query Best Practices](https://tanstack.com/query/latest/docs/react/guides/query-functions)
- [TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [React Best Practices](https://react.dev/learn)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [OWASP Frontend Security](https://cheatsheetseries.owasp.org/)

---

_最後更新：2026-01-15_
````
