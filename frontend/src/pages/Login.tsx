import React from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Background3D } from '@/components/Background3D';
import { useAuth } from '@/contexts/AuthContext';
import { useLoginUser } from '@workspace/api-client-react';
import { useToast } from '@/hooks/use-toast';
import { Building2, User, Mail, Lock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const loginMutation = useLoginUser();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate({ data }, {
      onSuccess: (res) => {
        login(res.user, res.token);
        toast({
          title: "Welcome back!",
          description: "Logged in successfully.",
        });
        if (res.user.role === 'owner') {
          setLocation('/dashboard/owner');
        } else {
          setLocation('/dashboard/tenant');
        }
      },
      onError: (err: any) => {
        toast({
          title: "Login failed",
          description: err.error || "Invalid credentials",
          variant: "destructive"
        });
      }
    });
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-4">
      <Background3D />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-card/90 backdrop-blur-xl border border-border shadow-2xl rounded-3xl overflow-hidden relative z-10"
      >
        <div className="p-8">
          <div className="flex justify-center mb-8">
            <div className="bg-primary/10 p-4 rounded-2xl">
              <Building2 className="w-10 h-10 text-primary" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-center text-foreground mb-2">Welcome Back</h2>
          <p className="text-center text-muted-foreground mb-8">Sign in to your Urban Nest account</p>
          
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <input 
                  {...form.register('email')}
                  type="email"
                  className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl bg-background text-foreground focus:ring-primary focus:border-primary outline-none transition-colors"
                  placeholder="you@example.com"
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-destructive text-xs mt-1 ml-1">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input 
                  {...form.register('password')}
                  type="password"
                  className="block w-full pl-10 pr-3 py-3 border border-border rounded-xl bg-background text-foreground focus:ring-primary focus:border-primary outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>
              {form.formState.errors.password && (
                <p className="text-destructive text-xs mt-1 ml-1">{form.formState.errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all mt-4 disabled:opacity-70"
            >
              {loginMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <span 
              onClick={() => setLocation('/register')}
              className="font-medium text-primary hover:text-primary/80 cursor-pointer"
            >
              Register here
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
