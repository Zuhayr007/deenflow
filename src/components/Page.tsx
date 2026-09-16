import AppHeader from "./AppHeader";
export default function Page({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="safe-bottom min-h-screen">
      <AppHeader />
      <main id="main-content" className="px-5 py-3 space-y-4">
        <h1 className="text-3xl font-bold">{title}</h1>
        {intro && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {intro}
          </p>
        )}
        {children}
      </main>
    </div>
  );
}
