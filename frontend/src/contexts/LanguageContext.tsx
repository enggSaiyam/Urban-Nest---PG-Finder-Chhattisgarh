import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'hi' | 'bn' | 'ta' | 'te' | 'pa';

interface Translations {
  [key: string]: {
    [key in Language]?: string;
  };
}

const translations: Translations = {
  'nav.home': { en: 'Home', hi: 'मुख्य पृष्ठ', bn: 'হোम', ta: 'முகப்பு', te: 'హోమ్', pa: 'ਮੁੱਖ ਪੰਨਾ' },
  'nav.pgs': { en: 'Find PGs', hi: 'पीजी खोजें', bn: 'পিজি খুঁজুন', ta: 'PG தேடு', te: 'PG వెతకండి', pa: 'ਪੀਜੀ ਲੱਭੋ' },
  'nav.dashboard': { en: 'Dashboard', hi: 'डैशबोर्ड', bn: 'ড্যাশবোর্ড', ta: 'டாஷ்போர்டு', te: 'డాష్‌బోర్డ్', pa: 'ਡੈਸ਼ਬੋਰਡ' },
  'nav.complaints': { en: 'Complaints', hi: 'शिकायतें', bn: 'অভিযোগ', ta: 'புகார்கள்', te: 'ఫిర్యాదులు', pa: 'ਸ਼ਿਕਾਇਤਾਂ' },
  'nav.login': { en: 'Login', hi: 'लॉग इन', bn: 'লগইন', ta: 'உள்நுழை', te: 'లాగిన్', pa: 'ਲਾਗਿਨ' },
  'nav.register': { en: 'Register', hi: 'पंजीकरण', bn: 'নিবন্ধন', ta: 'பதிவு', te: 'నమోదు', pa: 'ਰਜਿਸਟਰ' },
  'nav.logout': { en: 'Logout', hi: 'लॉग आउट', bn: 'লগআউট', ta: 'வெளியேறு', te: 'లాగ్అవుట్', pa: 'ਲਾਗਆਉਟ' },
  'hero.title': { en: 'Find Your Perfect PG in Chhattisgarh', hi: 'छत्तीसगढ़ में अपना आदर्श पीजी खोजें' },
  'hero.subtitle': { en: 'Safe, affordable, and comfortable stays for students and professionals.', hi: 'छात्रों और पेशेवरों के लिए सुरक्षित, किफायती और आरामदायक आवास।' },
  'btn.browse': { en: 'Browse Listings', hi: 'लिस्टिंग ब्राउज़ करें' },
  'btn.register': { en: 'Register Now', hi: 'अभी रजिस्टर करें' },
  'btn.search': { en: 'Search', hi: 'खोजें' },
  'search.city': { en: 'Select City', hi: 'शहर चुनें' },
  'search.keyword': { en: 'Search by PG name...', hi: 'पीजी नाम से खोजें...' },
  'stats.pgs': { en: 'Total PGs', hi: 'कुल पीजी' },
  'stats.cities': { en: 'Cities Covered', hi: 'कवर किए गए शहर' },
  'stats.tenants': { en: 'Happy Tenants', hi: 'संतुष्ट किरायेदार' },
  'hiw.title': { en: 'How it works', hi: 'यह कैसे काम करता है' },
  'hiw.1.title': { en: 'Search', hi: 'खोजें' },
  'hiw.1.desc': { en: 'Find PGs in your preferred city', hi: 'अपने पसंदीदा शहर में पीजी खोजें' },
  'hiw.2.title': { en: 'Compare', hi: 'तुलना करें' },
  'hiw.2.desc': { en: 'Check amenities, rent, and photos', hi: 'सुविधाएं, किराया और तस्वीरें देखें' },
  'hiw.3.title': { en: 'Connect', hi: 'संपर्क करें' },
  'hiw.3.desc': { en: 'Contact the owner directly', hi: 'सीधे मालिक से संपर्क करें' },
  'role.tenant': { en: 'Tenant', hi: 'किरायेदार' },
  'role.owner': { en: 'PG Owner', hi: 'पीजी मालिक' },
  'pgs.title': { en: 'Available PGs & Hostels', hi: 'उपलब्ध पीजी और हॉस्टल' },
  'pgs.filters': { en: 'Filters', hi: 'फ़िल्टर' },
  'pgs.type': { en: 'Type', hi: 'प्रकार' },
  'pgs.gender': { en: 'Gender', hi: 'लिंग' },
  'pgs.rent': { en: 'Rent Range', hi: 'किराया सीमा' },
  'btn.view_details': { en: 'View Details', hi: 'विवरण देखें' },
  'pg.rent_month': { en: '/ month', hi: '/ माह' },
  'pg.rooms_available': { en: 'rooms available', hi: 'कमरे उपलब्ध' },
  'pg.amenities': { en: 'Amenities', hi: 'सुविधाएं' },
  'pg.owner_contact': { en: 'Owner Contact', hi: 'मालिक संपर्क' },
  'complaints.title': { en: 'Complaints', hi: 'शिकायतें' },
  'complaints.file': { en: 'File a Complaint', hi: 'शिकायत दर्ज करें' },
  'complaints.my': { en: 'My Complaints', hi: 'मेरी शिकायतें' },
  'complaints.contact_admin': { en: 'Contact Web Owner', hi: 'वेब मालिक से संपर्क करें' },
  'dashboard.tenant': { en: 'Tenant Dashboard', hi: 'किरायेदार डैशबोर्ड' },
  'dashboard.owner': { en: 'Owner Dashboard', hi: 'मालिक डैशबोर्ड' },
  'dash.pgs_viewed': { en: 'PGs Viewed', hi: 'देखे गए पीजी' },
  'dash.saved_pgs': { en: 'Saved PGs', hi: 'सहेजे गए पीजी' },
  'dash.active_complaints': { en: 'Active Complaints', hi: 'सक्रिय शिकायतें' },
  'dash.total_listings': { en: 'Total Listings', hi: 'कुल लिस्टिंग' },
  'dash.total_rooms': { en: 'Total Rooms', hi: 'कुल कमरे' },
  'dash.available_rooms': { en: 'Available Rooms', hi: 'उपलब्ध कमरे' },
  'listpg.title': { en: 'List a New PG', hi: 'नया पीजी सूचीबद्ध करें' },
  'status.pending': { en: 'Pending', hi: 'लंबित' },
  'status.in_review': { en: 'In Review', hi: 'समीक्षा में' },
  'status.resolved': { en: 'Resolved', hi: 'हल हो गया' },
  'status.closed': { en: 'Closed', hi: 'बंद' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[key]?.[language] || translations[key]?.['en'] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
