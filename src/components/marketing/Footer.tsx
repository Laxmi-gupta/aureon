import { Link } from 'react-router-dom';
import { Logo } from '@/components/shared/Logo';
import { Container } from './Container';

const COLUMNS: { heading: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    heading: 'Platform',
    links: [
      { label: 'Product', href: '#product' },
      { label: 'Solutions', href: '#solutions' },
      { label: 'Features', href: '#features' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '#about' },
      { label: 'Login', href: '/login', external: true },
      { label: 'Explore Platform', href: '/app', external: true },
    ],
  },
];

export function Footer() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <footer className="border-t border-ink-800 bg-ink-950 py-16">
      <Container>
        <div className="flex flex-col justify-between gap-12 sm:flex-row">
          <div className="max-w-xs">
            <Logo tone="light" />
            <p className="mt-3 text-sm text-ink-400">Where work moves forward.</p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            {COLUMNS.map((column) => (
              <div key={column.heading}>
                <p className="text-xs font-medium uppercase tracking-wide text-ink-500">{column.heading}</p>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      {link.external ? (
                        <Link to={link.href} className="text-sm text-ink-300 transition-colors hover:text-ink-50">
                          {link.label}
                        </Link>
                      ) : (
                        <button
                          onClick={() => scrollTo(link.href)}
                          className="text-sm text-ink-300 transition-colors hover:text-ink-50"
                        >
                          {link.label}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col-reverse items-center justify-between gap-4 border-t border-ink-800 pt-6 sm:flex-row">
          <p className="text-xs text-ink-500">© {new Date().getFullYear()} Aureon. All rights reserved.</p>
          <p className="text-xs text-ink-500">Designed as a portfolio product concept.</p>
        </div>
      </Container>
    </footer>
  );
}
