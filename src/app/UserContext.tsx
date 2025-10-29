"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import * as jose from "jose";
import { useRouter } from "next/navigation";

interface UserData {
  isReady: boolean;
  isLoggedIn: boolean;
  userId: string | null;
  token: string | null;
  refreshToken: string | null;
  accessTokenExpiry: number;
  register: (username: string, password: string, confirmPassword: string) => Promise<boolean>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<string>;
  getToken: () => Promise<string>;
}

export const UserContext = createContext<UserData>({
  isReady: false,
  isLoggedIn: false,
  userId: null,
  token: null,
  refreshToken: null,
  accessTokenExpiry: 0,
  register: () => new Promise((resolve) => resolve(false)),
  login: () => new Promise((resolve) => resolve()),
  logout: () => new Promise((resolve) => resolve()),
  refresh: () => {
    console.log("Used default func");
    return new Promise((resolve) => resolve("Invalid"));
  },
  getToken: () => new Promise((resolve) => resolve("Invalid")),
});

export const useAuth = () => useContext(UserContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isReady, setIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [accessTokenExpiry, setAccessTokenExpiry] = useState(0);
  const router = useRouter();

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
    setToken(localStorage.getItem("token"));
    setRefreshToken(localStorage.getItem("refreshToken"));
    setAccessTokenExpiry(parseInt(localStorage.getItem("accessTokenExpiry") ?? "0"));
    setIsLoggedIn(!!localStorage.getItem("userId"));
    setIsReady(true);
  }, []);

  const register = async (username: string, password: string, confirmPassword: string) => {
    const body = { gameUser: { userName: username }, password, confirmPassword };
    const response = await fetch("https://ajj-sig-test.azurewebsites.net/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    return response.ok;
  };

  const login = async (username: string, password: string) => {
    const body = { userName: username, password };
    const response = await fetch("https://ajj-sig-test.azurewebsites.net/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const res = await response.json();
      localStorage.setItem("userId", res.username);
      setUserId(res.username);
      const tokenDetails = jose.decodeJwt(res.token);
      localStorage.setItem("accessTokenExpiry", `${tokenDetails.exp}`);
      setAccessTokenExpiry(tokenDetails.exp ?? 0);
      localStorage.setItem("token", res.token);
      setToken(res.token);
      localStorage.setItem("refreshToken", res.refreshToken);
      setRefreshToken(res.refreshToken);
      setIsLoggedIn(true);
    } else {
      setUserId(null);
      setToken(null);
      setRefreshToken(null);
      setAccessTokenExpiry(0);
      setIsLoggedIn(false);
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessTokenExpiry");
    }
  };

  const refresh = async () => {
    if (!token || !refreshToken) return "Failed";
    const body = { accessToken: localStorage.getItem("token"), refreshToken: localStorage.getItem("refreshToken") };
    const response = await fetch("https://ajj-sig-test.azurewebsites.net/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const res: { token: string; refreshToken: string } = await response.json();
      localStorage.setItem("token", res.token);
      const tokenDetails = jose.decodeJwt(res.token);
      localStorage.setItem("accessTokenExpiry", `${tokenDetails.exp}`);
      setAccessTokenExpiry(tokenDetails.exp ?? 0);
      setToken(res.token);
      localStorage.setItem("refreshToken", res.refreshToken);
      setRefreshToken(res.refreshToken);
      setIsLoggedIn(true);
      return res.token;
    } else {
      setUserId(null);
      setToken(null);
      setRefreshToken(null);
      setAccessTokenExpiry(0);
      setIsLoggedIn(false);
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessTokenExpiry");
      return "Failed";
    }
  };

  const logout = async () => {
    setUserId(null);
    setToken(null);
    setRefreshToken(null);
    setAccessTokenExpiry(0);
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessTokenExpiry");
    setIsLoggedIn(false);
  };

  async function getToken() {
    if (isReady && !token) {
      router.push("/");
    }

    if (accessTokenExpiry < Math.floor(new Date().getTime() / 1000)) {
      const newToken = await refresh();
      if (newToken === "Failed") throw new Error("Invalid token");
      return newToken;
    }
    return token ?? "";
  }

  return (
    <UserContext.Provider
      value={{
        isReady,
        isLoggedIn,
        userId,
        token,
        refreshToken,
        accessTokenExpiry,
        register,
        login,
        logout,
        refresh,
        getToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
