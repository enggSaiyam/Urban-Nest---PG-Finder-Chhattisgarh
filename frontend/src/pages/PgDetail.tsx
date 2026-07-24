import React, { useState } from 'react';
import { useParams } from 'wouter';
import { useGetPg } from '@workspace/api-client-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, IndianRupee, Users, Home, BedDouble, CheckCircle2, Phone, User as UserIcon, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

export default function PgDetail() {
  const { id } = useParams();
  const { t } = useLanguage();
  const { data: pg, isLoading } = useGetPg(Number(id), { query: { enabled: !!id, queryKey: ['getPg', Number(id)] } });
  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!pg) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <h2 className="text-2xl font-bold text-foreground mb-4">PG Not Found</h2>
        <Link href="/pgs" className="text-primary hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to listings
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-card border-b border-border py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/pgs" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 text-sm font-medium w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to Search
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Gallery */}
            <div className="space-y-4">
              <div className="aspect-[16/9] w-full bg-muted rounded-2xl overflow-hidden border border-border">
                {pg.images && pg.images.length > 0 ? (
                  <img src={pg.images[activeImage]} alt={pg.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Home className="w-20 h-20 text-muted-foreground opacity-20" />
                  </div>
                )}
              </div>
              
              {pg.images && pg.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {pg.images.map((img, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setActiveImage(idx)}
                      className={`h-20 w-32 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Header Info */}
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{pg.pgType}</span>
                <span className="bg-secondary/20 text-secondary-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{pg.gender} Only</span>
              </div>
              <h1 className="text-3xl font-extrabold text-foreground mb-2">{pg.name}</h1>
              <p className="text-muted-foreground flex items-center text-lg">
                <MapPin className="w-5 h-5 mr-2 shrink-0 text-primary" />
                {pg.address}, {pg.city}
              </p>
            </div>

            {/* Description */}
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
              <h2 className="text-xl font-bold text-foreground mb-4">About this property</h2>
              <p className="text-muted-foreground leading-relaxed">
                {pg.description || "No description provided by the owner."}
              </p>
            </div>

            {/* Amenities */}
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
              <h2 className="text-xl font-bold text-foreground mb-6">{t('pg.amenities')}</h2>
              {pg.amenities && pg.amenities.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-2">
                  {pg.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-foreground font-medium">
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                      <span className="capitalize">{amenity}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No amenities listed.</p>
              )}
            </div>
          </div>

          {/* Right Column - Booking & Contact */}
          <div className="space-y-6">
            
            {/* Pricing Card */}
            <div className="bg-card p-6 rounded-2xl border border-border shadow-lg sticky top-24">
              <div className="flex items-end gap-1 mb-6 border-b border-border pb-6">
                <IndianRupee className="w-8 h-8 text-primary" />
                <span className="text-4xl font-extrabold text-foreground leading-none">{pg.rent}</span>
                <span className="text-muted-foreground font-medium mb-1">{t('pg.rent_month')}</span>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center bg-muted/50 p-3 rounded-xl border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground font-medium">
                    <BedDouble className="w-5 h-5" /> Total Rooms
                  </div>
                  <span className="font-bold text-foreground">{pg.totalRooms}</span>
                </div>
                <div className="flex justify-between items-center bg-muted/50 p-3 rounded-xl border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground font-medium">
                    <Users className="w-5 h-5" /> Available Now
                  </div>
                  <span className={`font-bold ${pg.availableRooms > 0 ? 'text-green-600' : 'text-destructive'}`}>
                    {pg.availableRooms}
                  </span>
                </div>
              </div>

              <button 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-xl shadow-md transition-transform hover:-translate-y-1"
                onClick={() => {
                  alert("Booking flow would initiate here.");
                }}
              >
                Request to Book
              </button>
            </div>

            {/* Owner Card */}
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
              <h3 className="font-bold text-foreground mb-4 uppercase tracking-wider text-sm">{t('pg.owner_contact')}</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-secondary/20 rounded-full flex items-center justify-center text-secondary-foreground border border-secondary/30">
                  <UserIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-lg text-foreground">{pg.ownerName || "Owner"}</p>
                  <p className="text-muted-foreground text-sm">Verified Host</p>
                </div>
              </div>
              
              <a 
                href={`tel:${pg.ownerPhone}`} 
                className="flex items-center justify-center gap-2 w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold py-3 rounded-xl transition-colors"
              >
                <Phone className="w-5 h-5" />
                {pg.ownerPhone || "Contact Number Hidden"}
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
