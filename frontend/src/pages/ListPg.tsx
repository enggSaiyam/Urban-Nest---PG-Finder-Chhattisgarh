import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreatePg, PgInputPgType, PgInputGender } from '@workspace/api-client-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { ChevronRight, ChevronLeft, Upload, X, Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

const pgSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  city: z.string().min(2, "City is required"),
  address: z.string().min(5, "Full address is required"),
  description: z.string().optional(),
  rent: z.coerce.number().min(500, "Rent must be realistic"),
  pgType: z.enum(['pg', 'hostel']),
  gender: z.enum(['male', 'female', 'any']),
  totalRooms: z.coerce.number().min(1, "Must have at least 1 room"),
  availableRooms: z.coerce.number().min(0),
});

type PgFormValues = z.infer<typeof pgSchema>;

const AMENITIES_LIST = [
  'WiFi', 'AC', 'Meals', 'Laundry', 'CCTV', 
  'Parking', 'Geyser', 'Gym', 'Security Guard', 'TV'
];

export default function ListPg() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createMutation = useCreatePg();
  
  const [step, setStep] = useState(1);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]); // base64 strings

  const form = useForm<PgFormValues>({
    resolver: zodResolver(pgSchema),
    defaultValues: {
      name: '', city: '', address: '', description: '',
      rent: 0, pgType: 'pg', gender: 'any',
      totalRooms: 1, availableRooms: 1
    }
  });

  const toggleAmenity = (am: string) => {
    setAmenities(prev => 
      prev.includes(am) ? prev.filter(a => a !== am) : [...prev, am]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (images.length + files.length > 5) {
      toast({ title: "Limit reached", description: "Maximum 5 photos allowed", variant: "destructive" });
      return;
    }

    Array.from(files).forEach(file => {
      if (file.size > 20 * 1024 * 1024) {
        toast({ title: "File too large", description: `${file.name} exceeds 20MB limit`, variant: "destructive" });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: PgFormValues) => {
    const payload = {
      ...data,
      pgType: data.pgType as PgInputPgType,
      gender: data.gender as PgInputGender,
      amenities,
      images
    };

    createMutation.mutate({ data: payload }, {
      onSuccess: () => {
        toast({ title: "Property Listed successfully!" });
        queryClient.invalidateQueries({ queryKey: ['getOwnerDashboard'] });
        setLocation('/dashboard/owner');
      },
      onError: (err: any) => {
        toast({ title: "Failed to list property", description: err.error, variant: "destructive" });
      }
    });
  };

  const nextStep = async () => {
    let isValid = false;
    if (step === 1) isValid = await form.trigger(['name', 'city', 'address', 'pgType', 'gender']);
    if (step === 2) isValid = await form.trigger(['rent', 'totalRooms', 'availableRooms']);
    
    if (isValid) setStep(step + 1);
  };

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-foreground mb-2">{t('listpg.title')}</h1>
          
          {/* Progress Bar */}
          <div className="flex items-center mt-6">
            {[1, 2, 3, 4].map(num => (
              <React.Fragment key={num}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10 ${step >= num ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground border border-border'}`}>
                  {num}
                </div>
                {num < 4 && (
                  <div className={`flex-1 h-1 ${step > num ? 'bg-primary' : 'bg-border'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs font-medium text-muted-foreground px-1">
            <span>Basic Info</span>
            <span>Pricing & Rooms</span>
            <span>Amenities</span>
            <span>Photos</span>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-xl">
          
          {/* Step 1: Basic Info */}
          <div className={step === 1 ? 'block' : 'hidden'}>
            <h2 className="text-xl font-bold text-foreground mb-6">Basic Information</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Property Name</label>
                <input {...form.register('name')} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none" placeholder="e.g. Sai Homes PG" />
                {form.formState.errors.name && <p className="text-destructive text-xs mt-1">{form.formState.errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">City</label>
                  <input {...form.register('city')} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none" placeholder="e.g. Raipur" />
                  {form.formState.errors.city && <p className="text-destructive text-xs mt-1">{form.formState.errors.city.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Property Type</label>
                  <select {...form.register('pgType')} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none">
                    <option value="pg">PG</option>
                    <option value="hostel">Hostel</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Target Gender</label>
                <select {...form.register('gender')} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none">
                  <option value="male">Male Only</option>
                  <option value="female">Female Only</option>
                  <option value="any">Any / Co-ed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Full Address</label>
                <textarea {...form.register('address')} rows={3} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none resize-none" placeholder="Complete address..." />
                {form.formState.errors.address && <p className="text-destructive text-xs mt-1">{form.formState.errors.address.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description (Optional)</label>
                <textarea {...form.register('description')} rows={3} className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none resize-none" placeholder="Describe your property..." />
              </div>
            </div>
          </div>

          {/* Step 2: Pricing & Rooms */}
          <div className={step === 2 ? 'block' : 'hidden'}>
            <h2 className="text-xl font-bold text-foreground mb-6">Pricing & Room Availability</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Monthly Rent (₹)</label>
                <input {...form.register('rent')} type="number" className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none" placeholder="e.g. 5000" />
                {form.formState.errors.rent && <p className="text-destructive text-xs mt-1">{form.formState.errors.rent.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Total Rooms</label>
                  <input {...form.register('totalRooms')} type="number" className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none" />
                  {form.formState.errors.totalRooms && <p className="text-destructive text-xs mt-1">{form.formState.errors.totalRooms.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Available Rooms</label>
                  <input {...form.register('availableRooms')} type="number" className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none" />
                  {form.formState.errors.availableRooms && <p className="text-destructive text-xs mt-1">{form.formState.errors.availableRooms.message}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Amenities */}
          <div className={step === 3 ? 'block' : 'hidden'}>
            <h2 className="text-xl font-bold text-foreground mb-6">Select Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {AMENITIES_LIST.map(am => (
                <label key={am} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${amenities.includes(am) ? 'border-primary bg-primary/5 text-primary font-medium' : 'border-border bg-background text-foreground hover:border-primary/50'}`}>
                  <input 
                    type="checkbox" 
                    checked={amenities.includes(am)}
                    onChange={() => toggleAmenity(am)}
                    className="accent-primary w-4 h-4"
                  />
                  {am}
                </label>
              ))}
            </div>
          </div>

          {/* Step 4: Photos */}
          <div className={step === 4 ? 'block' : 'hidden'}>
            <h2 className="text-xl font-bold text-foreground mb-2">Property Photos</h2>
            <p className="text-muted-foreground text-sm mb-6">Upload up to 5 images. Max size 20MB per image.</p>
            
            <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center bg-background hover:bg-muted/50 transition-colors relative">
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={images.length >= 5}
              />
              <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
              <p className="font-medium text-foreground">Click or drag images to upload</p>
              <p className="text-xs text-muted-foreground mt-2">{images.length}/5 uploaded</p>
            </div>

            {images.length > 0 && (
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {images.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-border group">
                    <img src={src} className="w-full h-full object-cover" alt="" />
                    <button 
                      type="button" 
                      onClick={() => removeImage(i)}
                      className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-10 pt-6 border-t border-border">
            {step > 1 ? (
              <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-2.5 rounded-xl border border-border font-medium text-foreground hover:bg-muted transition-colors flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            ) : <div />}
            
            {step < 4 ? (
              <button type="button" onClick={nextStep} className="px-8 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-md">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button type="submit" disabled={createMutation.isPending} className="px-8 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-md disabled:opacity-70">
                {createMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Listing"}
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}
