import Link from 'next/link'

export default function NotFound() {
  return (
    // You can customize this container and its content
    // Remove background classes here if you want the layout's blur to show through
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4">
      <h2 className="text-3xl font-semibold mb-4">404</h2>
      <p className="text-lg text-muted-foreground mb-8">Oops! Page Not Found.</p>
      <p className="max-w-md text-muted-foreground mb-8">
        The page you are looking for might have been removed, had its name changed, 
        or is temporarily unavailable.
      </p>
      <Link 
        href="/" 
        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      >
        Return to Dashboard
      </Link>
    </div>
  )
} 