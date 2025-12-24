import { ApiResponse } from "../../shared/types"
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    const headers = new Headers(init?.headers || {});
    if (init?.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    const res = await fetch(path, {
      headers,
      ...init
    });
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text();
      console.error(`[API ERROR] Non-JSON response from ${path}:`, {
        status: res.status,
        statusText: res.statusText,
        bodyPreview: text.slice(0, 200)
      });
      throw new Error(`Server returned non-JSON response (${res.status} ${res.statusText})`);
    }
    const json = (await res.json()) as ApiResponse<T> & { detail?: string };
    if (!res.ok || !json.success) {
      const errorMessage = json.detail || json.error || res.statusText;
      console.error(`[API ERROR] Request to ${path} failed:`, errorMessage);
      throw new Error(errorMessage || `Request failed with status ${res.status}`);
    }
    if (json.data === undefined) {
      throw new Error('API response success but data is missing');
    }
    return json.data;
  } catch (error) {
    if (error instanceof Error) {
      console.warn(`[API CLIENT] Error fetching ${path}:`, error.message);
      throw error;
    }
    throw new Error('An unknown network error occurred');
  }
}