import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink-950 text-center text-ink-50">
      <Compass size={28} className="text-gold-400" strokeWidth={1.5} />
      <h1 className="text-2xl font-medium">Page not found</h1>
      <p className="max-w-sm text-sm text-ink-300">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="text-sm text-gold-400 underline-offset-4 hover:underline">
        Back to Aureon
      </Link>
    </div>
  );
}
