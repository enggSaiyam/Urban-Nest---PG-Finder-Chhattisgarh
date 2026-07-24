import React from 'react';
import { Building2 } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          <div className="flex flex-col items-center md:items-start max-w-xs">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="font-bold text-xl text-foreground tracking-tight">Urban Nest</span>
            </div>
            <p className="text-muted-foreground text-sm text-center md:text-left leading-relaxed">
              The premier marketplace for finding the best PGs and hostels across Chhattisgarh. Safe, affordable, and trustworthy.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Contact Administration</h3>
            <div className="bg-muted/50 p-4 rounded-xl border border-border text-center md:text-right">
              <p className="font-medium text-foreground">Saiyam Chopda</p>
              <p className="text-sm text-muted-foreground mt-1">+91 9755376105</p>
              <p className="text-sm text-primary hover:underline mt-1">
                <a href="mailto:enggsaiyam@gmail.com">enggsaiyam@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Urban Nest. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
