import React from 'react';
import { useGetOwnerDashboard, useDeletePg } from '@workspace/api-client-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Building2, Users, BedDouble, AlertCircle, Plus, Edit, Trash2, IndianRupee, Loader2, Eye } from 'lucide-react';
import { Link } from 'wouter';
import { useQueryClient } from '@tanstack/react-query';

export default function OwnerDashboard() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: dashboard, isLoading } = useGetOwnerDashboard({ query: { queryKey: ['getOwnerDashboard'] } });
  const deleteMutation = useDeletePg();

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      deleteMutation.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Listing deleted" });
          queryClient.invalidateQueries({ queryKey: ['getOwnerDashboard'] });
        },
        onError: () => {
          toast({ title: "Failed to delete", variant: "destructive" });
        }
      });
    }
  };

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('dashboard.owner')}</h1>
            <p className="text-muted-foreground mt-2">Manage your properties and tenants.</p>
          </div>
          <Link href="/list-pg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-6 rounded-xl shadow-md transition-transform hover:-translate-y-1 flex items-center gap-2">
            <Plus className="w-5 h-5" /> {t('listpg.title')}
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-primary/10 p-3 rounded-lg text-primary"><Building2 className="w-6 h-6" /></div>
              <p className="text-muted-foreground font-medium">{t('dash.total_listings')}</p>
            </div>
            <h3 className="text-3xl font-bold text-foreground">{dashboard?.totalListings || 0}</h3>
          </div>
          
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-secondary/20 p-3 rounded-lg text-secondary-foreground"><BedDouble className="w-6 h-6" /></div>
              <p className="text-muted-foreground font-medium">{t('dash.total_rooms')}</p>
            </div>
            <h3 className="text-3xl font-bold text-foreground">{dashboard?.totalRooms || 0}</h3>
          </div>

          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg text-green-600"><Users className="w-6 h-6" /></div>
              <p className="text-muted-foreground font-medium">{t('dash.available_rooms')}</p>
            </div>
            <h3 className="text-3xl font-bold text-foreground">{dashboard?.availableRooms || 0}</h3>
          </div>

          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg text-red-600"><AlertCircle className="w-6 h-6" /></div>
              <p className="text-muted-foreground font-medium">{t('dash.active_complaints')}</p>
            </div>
            <h3 className="text-3xl font-bold text-foreground">{dashboard?.activeComplaints || 0}</h3>
          </div>
        </div>

        {/* My PGs Table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
            <h2 className="text-xl font-bold text-foreground">My Properties</h2>
          </div>
          
          <div className="overflow-x-auto">
            {dashboard?.myPgs && dashboard.myPgs.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="p-4 font-semibold text-muted-foreground text-sm">Property</th>
                    <th className="p-4 font-semibold text-muted-foreground text-sm">Location</th>
                    <th className="p-4 font-semibold text-muted-foreground text-sm">Rent</th>
                    <th className="p-4 font-semibold text-muted-foreground text-sm">Occupancy</th>
                    <th className="p-4 font-semibold text-muted-foreground text-sm text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {dashboard.myPgs.map(pg => (
                    <tr key={pg.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-muted rounded overflow-hidden shrink-0">
                            {pg.images?.[0] ? <img src={pg.images[0]} className="w-full h-full object-cover"/> : <Building2 className="w-5 h-5 m-2 text-muted-foreground" />}
                          </div>
                          <div>
                            <p className="font-bold text-foreground line-clamp-1">{pg.name}</p>
                            <span className="text-xs uppercase bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">{pg.pgType}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-foreground">{pg.city}</td>
                      <td className="p-4 text-sm font-bold flex items-center h-full pt-6"><IndianRupee className="w-3 h-3"/>{pg.rent}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-muted rounded-full h-2 max-w-[100px]">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${((pg.totalRooms - pg.availableRooms) / pg.totalRooms) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-muted-foreground">{pg.totalRooms - pg.availableRooms}/{pg.totalRooms}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <Link href={`/pgs/${pg.id}`} className="inline-flex p-2 text-muted-foreground hover:text-primary transition-colors bg-background rounded-lg border border-border">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button className="p-2 text-muted-foreground hover:text-blue-500 transition-colors bg-background rounded-lg border border-border">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(pg.id)}
                          disabled={deleteMutation.isPending}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors bg-background rounded-lg border border-border"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center">
                <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-bold text-foreground mb-1">No properties listed</h3>
                <p className="text-muted-foreground mb-6">You haven't added any PGs or hostels yet.</p>
                <Link href="/list-pg" className="bg-primary text-primary-foreground font-bold py-2 px-4 rounded-lg inline-flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Your First PG
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
