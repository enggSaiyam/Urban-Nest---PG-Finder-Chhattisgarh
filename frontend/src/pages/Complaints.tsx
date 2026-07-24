import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useListComplaints, useCreateComplaint, ComplaintInputCategory } from '@workspace/api-client-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Clock, CheckCircle, Info, Loader2, Send } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

const complaintSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  category: z.enum(['maintenance', 'noise', 'cleanliness', 'safety', 'billing', 'owner_behavior', 'other']),
  description: z.string().min(20, "Description must be at least 20 characters"),
});

type ComplaintFormValues = z.infer<typeof complaintSchema>;

export default function Complaints() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: complaints, isLoading } = useListComplaints({ query: { queryKey: ['getComplaints'] } });
  const createMutation = useCreateComplaint();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ComplaintFormValues>({
    resolver: zodResolver(complaintSchema),
    defaultValues: { subject: '', category: 'maintenance', description: '' }
  });

  const onSubmit = (data: ComplaintFormValues) => {
    setIsSubmitting(true);
    createMutation.mutate({ data: { ...data, category: data.category as ComplaintInputCategory } }, {
      onSuccess: () => {
        toast({ title: "Complaint submitted successfully" });
        form.reset();
        queryClient.invalidateQueries({ queryKey: ['getComplaints'] });
        setIsSubmitting(false);
      },
      onError: () => {
        toast({ title: "Failed to submit", variant: "destructive" });
        setIsSubmitting(false);
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-700 px-2 py-1 rounded"><Clock className="w-3 h-3" /> Pending</span>;
      case 'in_review': return <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700 px-2 py-1 rounded"><AlertTriangle className="w-3 h-3" /> In Review</span>;
      case 'resolved': return <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider bg-green-100 text-green-700 px-2 py-1 rounded"><CheckCircle className="w-3 h-3" /> Resolved</span>;
      default: return <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-700 px-2 py-1 rounded"><Info className="w-3 h-3" /> Closed</span>;
    }
  };

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <h1 className="text-3xl font-extrabold text-foreground">{t('complaints.title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* File Complaint Form */}
          <div className="lg:col-span-1">
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm mb-6">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                {t('complaints.file')}
              </h2>
              
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Subject</label>
                  <input {...form.register('subject')} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:border-primary outline-none" placeholder="Brief subject" />
                  {form.formState.errors.subject && <p className="text-destructive text-xs mt-1">{form.formState.errors.subject.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Category</label>
                  <select {...form.register('category')} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:border-primary outline-none">
                    <option value="maintenance">Maintenance</option>
                    <option value="noise">Noise</option>
                    <option value="cleanliness">Cleanliness</option>
                    <option value="safety">Safety</option>
                    <option value="billing">Billing</option>
                    <option value="owner_behavior">Owner Behavior</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                  <textarea {...form.register('description')} rows={5} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 focus:border-primary outline-none resize-none" placeholder="Provide details (min 20 chars)..." />
                  {form.formState.errors.description && <p className="text-destructive text-xs mt-1">{form.formState.errors.description.message}</p>}
                </div>
                
                <button type="submit" disabled={isSubmitting} className="w-full flex justify-center items-center gap-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold py-3 rounded-xl transition-colors">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Submit Complaint</>}
                </button>
              </form>
            </div>

            {/* Admin Contact Card */}
            <div className="bg-primary/5 p-6 rounded-2xl border-2 border-primary/20 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <AlertTriangle className="w-24 h-24 text-primary" />
              </div>
              <h3 className="font-bold text-primary mb-2 relative z-10">{t('complaints.contact_admin')}</h3>
              <p className="text-sm text-foreground/80 mb-4 relative z-10">For grievances that remain unresolved, contact the site administrator directly.</p>
              <div className="space-y-1 text-sm font-medium relative z-10">
                <p>Name: Saiyam Chopda</p>
                <p>Contact: +91 9755376105</p>
                <p>Email: enggsaiyam@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Complaints List */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-foreground mb-6">{t('complaints.my')}</h2>
            
            {isLoading ? (
              <div className="flex items-center justify-center h-48 bg-card border border-border rounded-2xl">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : complaints && complaints.length > 0 ? (
              <div className="space-y-4">
                {complaints.map(c => (
                  <div key={c.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-foreground">{c.subject}</h3>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">{c.category.replace('_', ' ')} • {new Date(c.createdAt).toLocaleDateString()}</p>
                      </div>
                      {getStatusBadge(c.status)}
                    </div>
                    <p className="text-muted-foreground text-sm bg-muted/50 p-3 rounded-xl border border-border mt-2">{c.description}</p>
                    
                    {c.response && (
                      <div className="mt-4 p-3 bg-secondary/10 border border-secondary/20 rounded-xl">
                        <p className="text-xs font-bold text-secondary-foreground mb-1 uppercase">Admin Response:</p>
                        <p className="text-sm text-foreground">{c.response}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 bg-card border border-border rounded-2xl text-center p-6">
                <CheckCircle className="w-12 h-12 text-green-500 mb-3 opacity-80" />
                <h3 className="font-bold text-foreground">No Complaints</h3>
                <p className="text-sm text-muted-foreground mt-1">You haven't filed any complaints yet.</p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
