/**
 * 簡單的認證系統 - 針對教師登入
 * 使用 localStorage 儲存登入狀態
 */

const STORAGE_KEY = 'academic_eval_auth';

export interface AuthState {
  isLoggedIn: boolean;
  loginTime?: number;
}

/**
 * 獲取當前認證狀態
 */
export function getAuthState(): AuthState {
  if (typeof window === 'undefined') {
    return { isLoggedIn: false };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { isLoggedIn: false };
    }

    const state = JSON.parse(stored) as AuthState;
    // 簡單檢查：確保存儲的狀態有效
    return state.isLoggedIn ? state : { isLoggedIn: false };
  } catch {
    return { isLoggedIn: false };
  }
}

/**
 * 執行登入：非同步 (async) 呼叫後端 API 進行驗證
 * @param password - 用戶輸入的密碼
 * @returns 是否登入成功
 */
export async function login(password: string): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });

    if (response.ok) {
      const authState: AuthState = {
        isLoggedIn: true,
        loginTime: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authState));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Login failed:", error);
    return false;
  }
}
/**
 * 執行登出
 */
export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * 檢查是否已登入（用於服務端組件）
 */
export function isLoggedIn(): boolean {
  const state = getAuthState();
  return state.isLoggedIn;
}
