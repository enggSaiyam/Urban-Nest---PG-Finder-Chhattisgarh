import React from 'react';
import { useGetTenantDashboard } from '@workspace/api-client-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Eye, Heart, AlertCircle, Building2, ChevronRight, Loader2, IndianRupee } from 'lucide-react';
import { Link } from 'wouter';

export default function TenantDashboard() {
  const { t } = useLanguage();
  const { data: dashboard, isLoading } = useGetTenantDashboard({ query: { queryKey: ['getTenantDashboard'] } });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-card border-b border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground">{t('dashboard.tenant')}</h1>
          <p className="text-muted-foreground mt-2">Manage your stays and tracking history.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-xl text-blue-600 dark:text-blue-400">
              <Eye className="w-8 h-8" />
            </div>
            <div>
              <p className="text-muted-foreground font-medium">{t('dash.pgs_viewed')}</p>
              <h3 className="text-3xl font-bold text-foreground">{dashboard?.totalPgsViewed || 0}</h3>
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
            <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-xl text-red-600 dark:text-red-400">
              <Heart className="w-8 h-8" />
            </div>
            <div>
              <p className="text-muted-foreground font-medium">{t('dash.saved_pgs')}</p>
              <h3 className="text-3xl font-bold text-foreground">{dashboard?.savedPgs || 0}</h3>
            </div>
          </div>

          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
            <div className="bg-amber-100 dark:bg-amber-900/30 p-4 rounded-xl text-amber-600 dark:text-amber-400">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <p className="text-muted-foreground font-medium">{t('dash.active_complaints')}</p>
              <h3 className="text-3xl font-bold text-foreground">{dashboard?.activeComplaints || 0}</h3>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/pgs" className="bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center justify-between transition-colors group">
            <div className="flex items-center gap-3 text-primary font-bold">
              <Building2 className="w-5 h-5" />
              Browse more PGs
            </div>
            <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/complaints" className="bg-secondary/10 hover:bg-secondary/20 border border-secondary/30 rounded-xl p-4 flex items-center justify-between transition-colors group">
            <div className="flex items-center gap-3 text-secondary-foreground font-bold">
              <AlertCircle className="w-5 h-5 text-secondary-foreground" />
              File a Complaint
            </div>
            <ChevronRight className="w-5 h-5 text-secondary-foreground group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Recent PGs */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Recently Added PGs</h2>
          {dashboard?.recentPgs && dashboard.recentPgs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboard.recentPgs.map(pg => (
                <Link key={pg.id} href={`/pgs/${pg.id}`} className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow flex gap-4">
                  <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden shrink-0">
                    {pg.images?.[0] ? (
                      <img src={pg.images[0]} alt={pg.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Building2 className="w-6 h-6 text-muted-foreground/50" /></div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center">
                    <h4 className="font-bold text-foreground line-clamp-1">{pg.name}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{pg.city}</p>
                    <div className="text-primary font-bold text-sm flex items-center">
                      <IndianRupee className="w-3 h-3" />{pg.rent}/mo
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <p className="text-muted-foreground">No recent properties available right now.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
