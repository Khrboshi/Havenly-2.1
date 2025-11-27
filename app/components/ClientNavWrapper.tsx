"use client";

interface Props {
  children: React.ReactNode;
}

export default function ClientNavWrapper({ children }: Props) {
  return <>{children}</>;
}
