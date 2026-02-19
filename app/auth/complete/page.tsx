// app/auth/complete/page.tsx
import CompleteClient from "./CompleteClient";

export const dynamic = "force-dynamic";

function safeNext(pathname: string | undefined) {
  const v = (pathname || "/dashboard").trim();
  if (!v.startsWith("/")) return "/dashboard";
  if (v.startsWith("//")) return "/dashboard";
  return v;
}

export default function AuthCompletePage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  const next = safeNext(searchParams?.next);
  return <CompleteClient next={next} />;
}
