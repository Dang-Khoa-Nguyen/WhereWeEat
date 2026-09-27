// Base URL for the backend API.
// Set NEXT_PUBLIC_API_URL in Vercel (and .env.local) to your deployed backend.
// Falls back to localhost for local development.
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";
