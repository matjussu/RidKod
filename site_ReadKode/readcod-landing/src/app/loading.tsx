export default function Loading() {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
          <div className="absolute inset-0 border-4 border-transparent border-t-accent-orange rounded-full animate-spin" />
        </div>

        {/* Text */}
        <p className="text-white/60 text-sm font-medium">Chargement...</p>
      </div>
    </div>
  );
}
