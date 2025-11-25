export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabase();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user ?? null;

  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen">
        <ClientNavWrapper initialUser={user} />
        <main className="pt-10">{children}</main>
      </body>
    </html>
  );
}
