function getCurrentSubdomain(): string {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;

    const parts = hostname.split(".");
    if (parts.length >= 2 && parts[parts.length - 1] === "localhost") {
      return parts[0];
    }
    return "localhost";
  }
  return "localhost";
}

function getBackendUrl(): string {
  const subdomain = getCurrentSubdomain();
  return `http://${subdomain}.localhost:4000`;
}

function getHeaders(needAuth: boolean = true) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (needAuth) {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
}

import { StoreInfo, User, AuthResponse } from "@/lib/types";

export async function getStoreInfo(): Promise<StoreInfo> {
  const backendUrl = getBackendUrl();

  try {
    const response = await fetch(`${backendUrl}/`, {
      method: "GET",
      headers: getHeaders(false),
    });
    const result = await response.json();

    if (response.ok) {
      return result.data as StoreInfo;
    } else {
      throw new Error(result.error || "Failed to fetch store info");
    }
  } catch (error) {
    console.error("Error fetching store info:", error);
    throw error;
  }
}

export async function signup(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const backendUrl = getBackendUrl();

  try {
    const response = await fetch(`${backendUrl}/signup`, {
      method: "POST",
      headers: getHeaders(false),
      body: JSON.stringify({ email, password }),
    });
    const result = await response.json();

    if (response.ok) {
      return {
        ...result.data,
        success: true,
        message: result.message,
      } as AuthResponse; // Return data with success flag
    } else {
      return {
        success: false,
        error: result.error,
        message: result.message,
      } as AuthResponse;
    }
  } catch (error) {
    console.error("Error during signup:", error);
    return { success: false, error: "Network error" } as AuthResponse;
  }
}

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const backendUrl = getBackendUrl();

  try {
    const response = await fetch(`${backendUrl}/login`, {
      method: "POST",
      headers: getHeaders(false),
      body: JSON.stringify({ email, password }),
    });
    const result = await response.json();

    if (response.ok) {
      return {
        ...result.data,
        success: true,
        message: result.message,
      } as AuthResponse; // Return data with success flag
    } else {
      return {
        success: false,
        error: result.error,
        message: result.message,
      } as AuthResponse;
    }
  } catch (error) {
    console.error("Error during login:", error);
    return { success: false, error: "Network error" } as AuthResponse;
  }
}

export async function getProfile(): Promise<User> {
  const backendUrl = getBackendUrl();

  try {
    const response = await fetch(`${backendUrl}/profile`, {
      method: "GET",
      headers: getHeaders(true),
    });
    const result = await response.json();

    if (response.ok) {
      return result.data as User;
    } else {
      throw new Error(result.error || "Failed to fetch profile");
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
}

export function isAuthenticated(): boolean {
  const token = localStorage.getItem("token");
  return !!token;
}

export function logout() {
  localStorage.removeItem("token");
}
