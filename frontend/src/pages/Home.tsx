import React from 'react';
import { Link, useLocation } from 'wouter';
import { Search, MapPin, Users, ShieldCheck, Building2 } from 'lucide-react';
import { Background3D } from '@/components/Background3D';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

export default function Home() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [city, setCity] = React.useState('');
  const [keyword, setKeyword] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.append('city', city);
    if (keyword) params.append('search', keyword);
    setLocation(`/pgs?${params.toString()}`);
  };

  const cities = ['Raipur', 'Bilaspur', 'Durg', 'Bhilai', 'Korba', 'Rajnandgaon'];

  return (
    <div className="min-h-[100dvh] flex flex-col relative">
      <Background3D />
      
      <main className="flex-grow flex flex-col items-center justify-center px-4 pt-20 pb-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl w-full mx-auto"
        >
          <span className="inline-block py-1.5 px-4 rounded-full bg-secondary/20 text-secondary-foreground border border-secondary/30 text-sm font-medium mb-6">
            Chhattisgarh's #1 PG Marketplace
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground tracking-tight leading-tight mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>

          <form onSubmit={handleSearch} className="bg-card p-2 md:p-3 rounded-2xl shadow-xl border border-border flex flex-col md:flex-row gap-3 max-w-4xl mx-auto mb-16">
            <div className="flex-1 flex items-center bg-background rounded-xl px-4 py-3 border border-border focus-within:border-primary transition-colors">
              <MapPin className="text-primary w-5 h-5 mr-3 shrink-0" />
              <select 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-foreground appearance-none cursor-pointer"
              >
                <option value="">{t('search.city')}</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            <div className="flex-1 flex items-center bg-background rounded-xl px-4 py-3 border border-border focus-within:border-primary transition-colors">
              <Search className="text-primary w-5 h-5 mr-3 shrink-0" />
              <input 
                type="text" 
                placeholder={t('search.keyword')}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>
            
            <button 
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg shrink-0"
            >
              {t('btn.search')}
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto border-t border-border/50 pt-12">
            <div className="flex flex-col items-center p-6 bg-card/60 backdrop-blur-md rounded-2xl border border-border/50">
              <div className="bg-primary/10 text-primary p-3 rounded-full mb-4">
                <Building2 className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-1">500+</h3>
              <p className="text-muted-foreground font-medium">{t('stats.pgs')}</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-card/60 backdrop-blur-md rounded-2xl border border-border/50">
              <div className="bg-secondary/20 text-secondary-foreground p-3 rounded-full mb-4">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-1">15+</h3>
              <p className="text-muted-foreground font-medium">{t('stats.cities')}</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-card/60 backdrop-blur-md rounded-2xl border border-border/50">
              <div className="bg-primary/10 text-primary p-3 rounded-full mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-1">10k+</h3>
              <p className="text-muted-foreground font-medium">{t('stats.tenants')}</p>
            </div>
          </div>
        </motion.div>

        <section className="mt-32 w-full max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">{t('hiw.title')}</h2>
            <div className="w-20 h-1.5 bg-primary mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center relative">
              <div className="w-20 h-20 bg-card border-2 border-primary text-primary rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg z-10 relative">1</div>
              <h3 className="text-xl font-bold text-foreground mb-3">{t('hiw.1.title')}</h3>
              <p className="text-muted-foreground">{t('hiw.1.desc')}</p>
              <div className="hidden md:block absolute top-10 left-[60%] w-full h-0.5 bg-border -z-10"></div>
            </div>
            <div className="text-center relative">
              <div className="w-20 h-20 bg-card border-2 border-secondary text-secondary-foreground rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg z-10 relative">2</div>
              <h3 className="text-xl font-bold text-foreground mb-3">{t('hiw.2.title')}</h3>
              <p className="text-muted-foreground">{t('hiw.2.desc')}</p>
              <div className="hidden md:block absolute top-10 left-[60%] w-full h-0.5 bg-border -z-10"></div>
            </div>
            <div className="text-center relative">
              <div className="w-20 h-20 bg-card border-2 border-primary text-primary rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg z-10 relative">3</div>
              <h3 className="text-xl font-bold text-foreground mb-3">{t('hiw.3.title')}</h3>
              <p className="text-muted-foreground">{t('hiw.3.desc')}</p>
            </div>
          </div>
        </section>

        <div className="mt-32 mb-10 flex gap-4">
          <Link href="/pgs" className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold hover:bg-primary/90 transition-transform hover:-translate-y-1 shadow-xl">
            {t('btn.browse')}
          </Link>
          <Link href="/register" className="bg-card text-foreground border border-border px-8 py-4 rounded-xl font-bold hover:bg-muted transition-transform hover:-translate-y-1 shadow-lg">
            {t('btn.register')}
          </Link>
        </div>
      </main>
    </div>
  );
}
