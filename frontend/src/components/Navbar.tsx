import React from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Building2, Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/pgs', label: t('nav.pgs') },
    ...(user ? [
      { href: user.role === 'owner' ? '/dashboard/owner' : '/dashboard/tenant', label: t('nav.dashboard') },
      { href: '/complaints', label: t('nav.complaints') }
    ] : [])
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-card/90 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2" data-testid="nav-logo">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="font-bold text-xl text-foreground hidden sm:block tracking-tight">Urban Nest</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${location === link.href ? 'text-primary' : 'text-foreground/80'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-transparent border border-border rounded-md text-sm py-1.5 px-2 text-foreground focus:ring-primary focus:border-primary outline-none cursor-pointer"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="bn">বাংলা</option>
              <option value="ta">தமிழ்</option>
              <option value="te">తెలుగు</option>
              <option value="pa">ਪੰਜਾਬੀ</option>
            </select>

            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-muted/50 py-1.5 px-3 rounded-full border border-border">
                  <div className="bg-secondary text-secondary-foreground rounded-full p-1">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{user.name.split(' ')[0]}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-full hover:bg-muted"
                  data-testid="btn-logout"
                  title={t('nav.logout')}
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                  {t('nav.login')}
                </Link>
                <Link href="/register" className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium py-2 px-4 rounded-lg transition-colors">
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-transparent border border-border rounded-md text-sm py-1 px-1 text-foreground"
            >
              <option value="en">EN</option>
              <option value="hi">HI</option>
            </select>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-card overflow-hidden"
          >
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${location === link.href ? 'bg-primary/10 text-primary' : 'text-foreground/80 hover:bg-muted hover:text-foreground'}`}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <button
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-destructive hover:bg-muted"
                >
                  {t('nav.logout')}
                </button>
              ) : (
                <div className="mt-4 grid grid-cols-2 gap-3 px-3">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center border border-border py-2 rounded-md font-medium text-foreground">
                    {t('nav.login')}
                  </Link>
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center bg-primary text-primary-foreground py-2 rounded-md font-medium">
                    {t('nav.register')}
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
