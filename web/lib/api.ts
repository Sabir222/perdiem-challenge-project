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
  const headers: any = {
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

export async function getStoreInfo() {
  const backendUrl = getBackendUrl();

  try {
    const response = await fetch(`${backendUrl}/`, {
      method: "GET",
      headers: getHeaders(false),
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching store info:", error);
    throw error;
  }
}

export async function signup(email: string, password: string) {
  const backendUrl = getBackendUrl();

  try {
    const response = await fetch(`${backendUrl}/signup`, {
      method: "POST",
      headers: getHeaders(false),
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error during signup:", error);
    throw error;
  }
}

export async function login(email: string, password: string) {
  const backendUrl = getBackendUrl();

  try {
    const response = await fetch(`${backendUrl}/login`, {
      method: "POST",
      headers: getHeaders(false),
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
}

export async function getProfile() {
  const backendUrl = getBackendUrl();

  try {
    const response = await fetch(`${backendUrl}/profile`, {
      method: "GET",
      headers: getHeaders(true), // Auth needed for profile
    });
    return await response.json();
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
