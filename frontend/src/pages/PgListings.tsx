import React from 'react';
import { useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { useListPgs } from '@workspace/api-client-react';
import { Search, MapPin, SlidersHorizontal, IndianRupee, Loader2, Building2 } from 'lucide-react';
import { Link } from 'wouter';

export default function PgListings() {
  const { t } = useLanguage();
  const [location] = useLocation();
  
  // Parse query params
  const searchParams = new URLSearchParams(window.location.search);
  const initialCity = searchParams.get('city') || '';
  const initialSearch = searchParams.get('search') || '';

  const [city, setCity] = React.useState(initialCity);
  const [search, setSearch] = React.useState(initialSearch);
  const [pgType, setPgType] = React.useState<any>('all');
  const [gender, setGender] = React.useState<any>('any');
  const [sortBy, setSortBy] = React.useState<any>('availability');
  const [rentFilter, setRentFilter] = React.useState(15000);

  // Debounce API calls for typing
  const [debouncedSearch, setDebouncedSearch] = React.useState(search);
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: pgs, isLoading } = useListPgs({
    city: city || undefined,
    search: debouncedSearch || undefined,
    pgType: pgType !== 'all' ? pgType : undefined,
    gender: gender !== 'any' ? gender : undefined,
    sortBy: sortBy,
    maxRent: rentFilter
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Search Header */}
      <div className="bg-card border-b border-border sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">{t('pgs.title')}</h1>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="flex items-center bg-background rounded-xl px-3 py-2 border border-border focus-within:border-primary">
                <MapPin className="text-muted-foreground w-4 h-4 mr-2" />
                <input 
                  type="text" 
                  placeholder={t('search.city')}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm w-32"
                />
              </div>
              <div className="flex items-center bg-background rounded-xl px-3 py-2 border border-border focus-within:border-primary">
                <Search className="text-muted-foreground w-4 h-4 mr-2" />
                <input 
                  type="text" 
                  placeholder={t('search.keyword')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm w-full sm:w-48"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8 w-full flex-grow">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4 font-semibold text-foreground border-b border-border pb-2">
              <SlidersHorizontal className="w-5 h-5" />
              <span>{t('pgs.filters')}</span>
            </div>

            <div className="space-y-6">
              {/* Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">{t('pgs.type')}</label>
                <div className="flex flex-col gap-2">
                  {['all', 'pg', 'hostel'].map((t) => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="pgType" 
                        value={t} 
                        checked={pgType === t}
                        onChange={(e) => setPgType(e.target.value)}
                        className="accent-primary w-4 h-4"
                      />
                      <span className="text-sm capitalize">{t}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">{t('pgs.gender')}</label>
                <div className="flex flex-col gap-2">
                  {['any', 'male', 'female'].map((g) => (
                    <label key={g} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="gender" 
                        value={g} 
                        checked={gender === g}
                        onChange={(e) => setGender(e.target.value)}
                        className="accent-primary w-4 h-4"
                      />
                      <span className="text-sm capitalize">{g}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rent */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-muted-foreground">Max Rent</label>
                  <span className="text-sm font-bold text-primary flex items-center">
                    <IndianRupee className="w-3 h-3" />{rentFilter}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="2000" 
                  max="30000" 
                  step="500" 
                  value={rentFilter}
                  onChange={(e) => setRentFilter(parseInt(e.target.value))}
                  className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Sort */}
              <div className="space-y-2 pt-4 border-t border-border">
                <label className="text-sm font-medium text-muted-foreground">Sort By</label>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-card border border-border rounded-lg p-2 text-sm focus:border-primary outline-none"
                >
                  <option value="availability">Availability</option>
                  <option value="rent_asc">Rent: Low to High</option>
                  <option value="rent_desc">Rent: High to Low</option>
                </select>
              </div>

            </div>
          </div>
        </aside>

        {/* Listings Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          ) : pgs && pgs.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {pgs.map((pg) => (
                <div key={pg.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
                  <div className="h-48 bg-muted relative overflow-hidden">
                    {pg.images && pg.images.length > 0 ? (
                      <img src={pg.images[0]} alt={pg.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Building2 className="w-12 h-12 opacity-20" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-card/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1">
                      {pg.pgType}
                    </div>
                    <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-bold uppercase">
                      {pg.gender}
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-foreground line-clamp-1 flex-1 pr-2">{pg.name}</h3>
                      <div className="text-primary font-bold flex items-center whitespace-nowrap">
                        <IndianRupee className="w-4 h-4" />
                        {pg.rent}
                        <span className="text-xs text-muted-foreground font-normal ml-1">/mo</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground flex items-center mb-4">
                      <MapPin className="w-3 h-3 mr-1 shrink-0" />
                      {pg.city} • <span className="truncate ml-1">{pg.address}</span>
                    </p>

                    <div className="flex items-center gap-4 text-xs font-medium text-foreground mb-6 bg-muted/50 p-2 rounded-lg border border-border">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">Available</span>
                        <span className={pg.availableRooms > 0 ? "text-green-600" : "text-destructive"}>
                          {pg.availableRooms} / {pg.totalRooms}
                        </span>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <Link href={`/pgs/${pg.id}`} className="block w-full text-center bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-2.5 rounded-xl transition-colors">
                        {t('btn.view_details')}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center bg-card border border-border rounded-2xl">
              <Building2 className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-foreground mb-2">No PGs Found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
