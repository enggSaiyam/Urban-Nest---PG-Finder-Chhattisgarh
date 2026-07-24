import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Background3D } from '@/components/Background3D';
import { useAuth } from '@/contexts/AuthContext';
import { useRegisterUser } from '@workspace/api-client-react';
import { useToast } from '@/hooks/use-toast';
import { Building2, User, Mail, Lock, Phone, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const registerMutation = useRegisterUser();
  const [role, setRole] = useState<'tenant' | 'owner'>('tenant');

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', phone: '', password: '' },
  });

  const onSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate({ data: { ...data, role } }, {
      onSuccess: (res) => {
        login(res.user, res.token);
        toast({
          title: "Registration successful!",
          description: "Welcome to Urban Nest.",
        });
        if (res.user.role === 'owner') {
          setLocation('/dashboard/owner');
        } else {
          setLocation('/dashboard/tenant');
        }
      },
      onError: (err: any) => {
        toast({
          title: "Registration failed",
          description: err.error || "An error occurred",
          variant: "destructive"
        });
      }
    });
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-4 py-12">
      <Background3D />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-card/90 backdrop-blur-xl border border-border shadow-2xl rounded-3xl overflow-hidden relative z-10"
      >
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-secondary/20 p-4 rounded-2xl">
              <Building2 className="w-10 h-10 text-secondary-foreground" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-center text-foreground mb-2">Create Account</h2>
          <p className="text-center text-muted-foreground mb-8">Join Urban Nest today</p>
          
          <div className="flex p-1 bg-muted rounded-xl mb-8">
            <button
              onClick={() => setRole('tenant')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${role === 'tenant' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              I am a Tenant
            </button>
            <button
              onClick={() => setRole('owner')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${role === 'owner' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              I am a PG Owner
            </button>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <input 
                  {...form.register('name')}
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl bg-background text-foreground focus:ring-primary focus:border-primary outline-none transition-colors"
                  placeholder="Full Name"
                />
              </div>
              {form.formState.errors.name && <p className="text-destructive text-xs ml-1">{form.formState.errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <input 
                  {...form.register('email')}
                  type="email"
                  className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl bg-background text-foreground focus:ring-primary focus:border-primary outline-none transition-colors"
                  placeholder="Email Address"
                />
              </div>
              {form.formState.errors.email && <p className="text-destructive text-xs ml-1">{form.formState.errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                </div>
                <input 
                  {...form.register('phone')}
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl bg-background text-foreground focus:ring-primary focus:border-primary outline-none transition-colors"
                  placeholder="Phone Number"
                />
              </div>
              {form.formState.errors.phone && <p className="text-destructive text-xs ml-1">{form.formState.errors.phone.message}</p>}
            </div>

            <div className="space-y-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input 
                  {...form.register('password')}
                  type="password"
                  className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl bg-background text-foreground focus:ring-primary focus:border-primary outline-none transition-colors"
                  placeholder="Password (min 6 chars)"
                />
              </div>
              {form.formState.errors.password && <p className="text-destructive text-xs ml-1">{form.formState.errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all mt-6 disabled:opacity-70"
            >
              {registerMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <span 
              onClick={() => setLocation('/login')}
              className="font-medium text-primary hover:text-primary/80 cursor-pointer"
            >
              Sign in
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
