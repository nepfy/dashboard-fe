export default function getDomain() {
  const protocol =
    process.env.NEXT_PUBLIC_VERCEL_ENV === "production" ? "https" : "http";

  const host = process.env.NEXT_PUBLIC_VERCEL_URL
    ? process.env.NEXT_PUBLIC_VERCEL_URL
    : "nepfy.dev";

  return `${protocol}://${host}`;
}
