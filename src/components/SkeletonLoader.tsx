export function PrayerSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center justify-between rounded-xl bg-muted px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 rounded bg-muted-foreground/20" />
            <div className="h-4 w-16 rounded bg-muted-foreground/20" />
          </div>
          <div className="h-4 w-14 rounded bg-muted-foreground/20" />
        </div>
      ))}
    </div>
  );
}

export function CountdownSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl bg-muted p-6 text-center">
      <div className="mx-auto h-3 w-20 rounded bg-muted-foreground/20" />
      <div className="mx-auto mt-3 h-7 w-24 rounded bg-muted-foreground/20" />
      <div className="mx-auto mt-4 h-10 w-40 rounded bg-muted-foreground/20" />
    </div>
  );
}

export function SurahListSkeleton() {
  return (
    <div className="space-y-2 animate-pulse px-5">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-xl bg-muted p-4">
          <div className="h-9 w-9 rounded-lg bg-muted-foreground/20" />
          <div className="flex-1">
            <div className="h-4 w-28 rounded bg-muted-foreground/20" />
            <div className="mt-2 h-3 w-40 rounded bg-muted-foreground/20" />
          </div>
        </div>
      ))}
    </div>
  );
}
