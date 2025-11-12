"use client";

export async function jsonPost(path: string, body: any) {
  return await fetch(`${process.env.NEXT_PUBLIC_API}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
