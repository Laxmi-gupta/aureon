import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Menu, X } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { Container } from './Container';
import { cn } from '@/lib/cn';
import { transition } from '@/lib/motion';

const LINKS = [
  { label: 'Product', href: '#product' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Features', href: '#features' },
  { label: 'About', href: '#about' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleAnchorClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.div
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...transition.base, delay: 0.1 }}
        className={cn(
          'transition-[background-color,border-color,box-shadow] duration-300 ease-out',
          scrolled
            ? 'border-b border-ink-700/80 bg-ink-950/75 shadow-[0_1px_0_0_rgba(0,0,0,0.4)] backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <Container className="flex h-[68px] items-center justify-between">
          <Link to="/" className="shrink-0" onClick={() => setMobileOpen(false)}>
            <Logo tone="light" />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleAnchorClick(link.href)}
                className="text-[13.5px] font-medium text-ink-200 transition-colors hover:text-ink-50"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to="/login"
              className="px-3 py-2 text-[13.5px] font-medium text-ink-200 transition-colors hover:text-ink-50"
            >
              Login
            </Link>
            <button
              onClick={() => navigate('/app')}
              className="group inline-flex h-9 items-center gap-1.5 rounded-full bg-gold-500 pl-4 pr-3 text-[13px] font-medium text-ink-950 transition-colors hover:bg-gold-400"
            >
              Explore Platform
              <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>

          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-ink-700 text-ink-100 lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </Container>
      </motion.div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={transition.base}
            className="border-b border-ink-700 bg-ink-950/98 px-6 pb-8 pt-4 backdrop-blur-xl lg:hidden"
          >
            <nav className="flex flex-col gap-1">
              {LINKS.map((link, index) => (
                <motion.button
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...transition.fast, delay: 0.04 * index }}
                  onClick={() => handleAnchorClick(link.href)}
                  className="rounded-lg px-3 py-3 text-left text-[15px] font-medium text-ink-100 transition-colors hover:bg-ink-800"
                >
                  {link.label}
                </motion.button>
              ))}
            </nav>
            <div className="mt-5 flex flex-col gap-3 border-t border-ink-700 pt-5">
              <Link
                to="/login"
                className="rounded-lg border border-ink-700 px-4 py-3 text-center text-sm font-medium text-ink-100"
              >
                Login
              </Link>
              <button
                onClick={() => navigate('/app')}
                className="rounded-lg bg-gold-500 px-4 py-3 text-center text-sm font-medium text-ink-950"
              >
                Explore Platform
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
