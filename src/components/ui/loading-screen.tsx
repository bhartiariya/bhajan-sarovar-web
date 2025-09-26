export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-background-primary flex items-center justify-center z-50">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
        </div>
        <div className="flex items-center justify-center mb-4">
          <span className="text-3xl mr-2">🕉️</span>
          <h1 className="text-2xl font-bold text-primary">Bhajan Sarovar</h1>
        </div>
        <p className="text-text-secondary">Loading spiritual melodies...</p>
      </div>
    </div>
  )
}
