import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  RefreshCw, 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  CreditCard, 
  Calendar,
  Globe,
  Code
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalMockProfileGeneratorProps {
  onBackToGrid?: () => void;
}

interface MockProfile {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  gender: 'Male' | 'Female';
  avatarBg: string;
  initials: string;
  age: number;
  birthDate: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  job: {
    title: string;
    company: string;
    department: string;
  };
  finance: {
    cardNumber: string;
    cardType: 'Visa' | 'Mastercard';
    cvv: string;
    exp: string;
  };
}

// In-Memory Localized Dictionaries for Sub-Second Processing
const DICTIONARIES = {
  maleFirstNames: {
    US: ['Liam', 'Noah', 'Oliver', 'James', 'Elijah', 'William', 'Henry', 'Lucas', 'Benjamin', 'Theodore'],
    UK: ['George', 'Arthur', 'Harry', 'Oscar', 'Leo', 'Charlie', 'Archie', 'Henry', 'Freddie', 'Alfie'],
    CA: ['Liam', 'Noah', 'Jackson', 'Lucas', 'Logan', 'Benjamin', 'Jacob', 'William', 'Ethan', 'Michael'],
    AU: ['Oliver', 'Noah', 'Jack', 'William', 'Leo', 'Lucas', 'Thomas', 'Henry', 'Charlie', 'James'],
    IN: ['Aarav', 'Vihaan', 'Vivaan', 'Aditya', 'Reyansh', 'Arjun', 'Sai', 'Aryan', 'Ishaan', 'Kabir'],
    DE: ['Noah', 'Matteo', 'Leon', 'Paul', 'Finn', 'Elias', 'Emil', 'Felix', 'Louis', 'Henry']
  },
  femaleFirstNames: {
    US: ['Olivia', 'Emma', 'Charlotte', 'Amelia', 'Sophia', 'Isabella', 'Ava', 'Mia', 'Evelyn', 'Harper'],
    UK: ['Olivia', 'Amelia', 'Isla', 'Ava', 'Ivy', 'Freya', 'Lily', 'Florence', 'Rosie', 'Sophia'],
    CA: ['Olivia', 'Emma', 'Charlotte', 'Amelia', 'Sophia', 'Chloe', 'Mia', 'Ava', 'Mila', 'Ella'],
    AU: ['Charlotte', 'Amelia', 'Isla', 'Olivia', 'Mia', 'Ava', 'Grace', 'Willow', 'Harper', 'Lily'],
    IN: ['Aanya', 'Diya', 'Saanvi', 'Ananya', 'Kiara', 'Pari', 'Myra', 'Ira', 'Riya', 'Avani'],
    DE: ['Emilia', 'Mia', 'Sophia', 'Emma', 'Hannah', 'Lina', 'Mila', 'Ella', 'Clara', 'Marie']
  },
  lastNames: {
    US: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson'],
    UK: ['Smith', 'Jones', 'Taylor', 'Brown', 'Williams', 'Wilson', 'Johnson', 'Davies', 'Patel', 'Robinson', 'Wright', 'Thompson', 'Evans', 'Walker', 'White'],
    CA: ['Smith', 'Brown', 'Tremblay', 'Martin', 'Roy', 'Wilson', 'Macdonald', 'Johnson', 'Taylor', 'Gagnon', 'Campbell', 'Anderson', 'Leblanc', 'Cote'],
    AU: ['Smith', 'Jones', 'Williams', 'Brown', 'Wilson', 'Taylor', 'Nguyen', 'Johnson', 'Martin', 'White', 'Anderson', 'Walker', 'Lee', 'Harris', 'Ryan'],
    IN: ['Sharma', 'Verma', 'Patel', 'Reddy', 'Gupta', 'Singh', 'Kumar', 'Joshi', 'Mehta', 'Nair', 'Deshmukh', 'Chatterjee', 'Bose', 'Iyer', 'Kaur'],
    DE: ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann', 'Schäfer', 'Koch', 'Bauer', 'Richter']
  },
  locations: {
    US: {
      cities: ['Seattle', 'Austin', 'San Francisco', 'Denver', 'Boston', 'Chicago', 'Atlanta', 'Portland'],
      states: ['WA', 'TX', 'CA', 'CO', 'MA', 'IL', 'GA', 'OR'],
      streets: ['Maple Avenue', 'Oak Street', 'Cedar Boulevard', 'Pine Crest Lane', 'Sunset Drive', 'Tech Park Way'],
      phoneCode: '+1 (555)'
    },
    UK: {
      cities: ['London', 'Manchester', 'Edinburgh', 'Bristol', 'Cambridge', 'Leeds', 'Birmingham', 'Oxford'],
      states: ['Greater London', 'Lancashire', 'Midlothian', 'Somerset', 'Cambridgeshire', 'West Yorkshire'],
      streets: ['High Street', 'Victoria Road', 'Church Lane', 'Station Approach', 'King Street', 'Queen Road'],
      phoneCode: '+44 20'
    },
    CA: {
      cities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Edmonton', 'Quebec City', 'Halifax'],
      states: ['ON', 'BC', 'QC', 'AB', 'ON', 'AB', 'QC', 'NS'],
      streets: ['Main Street', 'King Street West', 'Robson Boulevard', 'Jasper Avenue', 'Saint-Laurent Blvd'],
      phoneCode: '+1 (416)'
    },
    AU: {
      cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Canberra', 'Hobart', 'Gold Coast'],
      states: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'ACT', 'TAS', 'QLD'],
      streets: ['George Street', 'Collins Street', 'Queen Street Mall', 'St Georges Terrace', 'King William St'],
      phoneCode: '+61 2'
    },
    IN: {
      cities: ['Bengaluru', 'Mumbai', 'Hyderabad', 'Pune', 'New Delhi', 'Chennai', 'Gurugram', 'Noida'],
      states: ['KA', 'MH', 'TS', 'MH', 'DL', 'TN', 'HR', 'UP'],
      streets: ['MG Road', 'Outer Ring Road', 'Hitec City Blvd', 'FC Road', 'Barakhamba Road', 'Anna Salai'],
      phoneCode: '+91 98'
    },
    DE: {
      cities: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Stuttgart', 'Cologne', 'Düsseldorf', 'Leipzig'],
      states: ['BE', 'BY', 'HH', 'HE', 'BW', 'NW', 'NW', 'SN'],
      streets: ['Friedrichstraße', 'Maximilianstraße', 'Hauptstraße', 'Königsallee', 'Bahnhofstraße'],
      phoneCode: '+49 30'
    }
  },
  jobs: [
    { title: 'Senior Full Stack Engineer', dept: 'Core Infrastructure' },
    { title: 'Product Design Lead', dept: 'User Experience' },
    { title: 'Site Reliability Engineer', dept: 'Cloud Ops' },
    { title: 'Data Scientist', dept: 'Machine Learning' },
    { title: 'Technical Product Manager', dept: 'Platform Strategy' },
    { title: 'QA Automation Architect', dept: 'Quality Engineering' },
    { title: 'Cybersecurity Analyst', dept: 'InfoSec' },
    { title: 'Frontend Systems Architect', dept: 'Design Systems' }
  ],
  companies: ['Stripe', 'Figma', 'Datadog', 'Vercel', 'Linear', 'Cloudflare', 'Retool', 'Notion', 'Supabase', 'Shopify'],
  avatarGradients: [
    'from-blue-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-purple-500 to-pink-600',
    'from-amber-500 to-orange-600',
    'from-cyan-500 to-blue-600',
    'from-rose-500 to-red-600'
  ]
};

export const UniversalMockProfileGenerator: React.FC<UniversalMockProfileGeneratorProps> = ({
  onBackToGrid
}) => {
  const [count, setCount] = useState<number>(3);
  const [genderFilter, setGenderFilter] = useState<'any' | 'male' | 'female'>('any');
  const [countryFilter, setCountryFilter] = useState<'ALL' | 'US' | 'UK' | 'CA' | 'AU' | 'IN' | 'DE'>('ALL');
  const [profiles, setProfiles] = useState<MockProfile[]>([]);
  const [copiedAllJson, setCopiedAllJson] = useState(false);
  const [copiedCardId, setCopiedCardId] = useState<string | null>(null);

  // Generate Profiles Algorithm
  const generateProfiles = () => {
    playSound('tap');
    const newProfiles: MockProfile[] = [];

    const availableCountries: ('US' | 'UK' | 'CA' | 'AU' | 'IN' | 'DE')[] = 
      countryFilter === 'ALL' ? ['US', 'UK', 'CA', 'AU', 'IN', 'DE'] : [countryFilter];

    for (let i = 0; i < count; i++) {
      const country = availableCountries[Math.floor(Math.random() * availableCountries.length)];
      const locData = DICTIONARIES.locations[country];

      // Determine gender
      let gender: 'Male' | 'Female' = 'Male';
      if (genderFilter === 'any') {
        gender = Math.random() > 0.5 ? 'Male' : 'Female';
      } else if (genderFilter === 'female') {
        gender = 'Female';
      }

      // Name pick
      const firstNameList = gender === 'Male' 
        ? DICTIONARIES.maleFirstNames[country] 
        : DICTIONARIES.femaleFirstNames[country];
      const lastNameList = DICTIONARIES.lastNames[country];

      const firstName = firstNameList[Math.floor(Math.random() * firstNameList.length)];
      const lastName = lastNameList[Math.floor(Math.random() * lastNameList.length)];
      const fullName = `${firstName} ${lastName}`;

      // Email
      const domains = ['example.com', 'testmail.org', 'devtest.io', 'qa-sandbox.net'];
      const emailDomain = domains[Math.floor(Math.random() * domains.length)];
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 89 + 10)}@${emailDomain}`;

      // Phone
      const phoneRandom = Math.floor(Math.random() * 899999 + 100000);
      const phone = `${locData.phoneCode} ${phoneRandom}`;

      // Location
      const cityIdx = Math.floor(Math.random() * locData.cities.length);
      const city = locData.cities[cityIdx];
      const state = locData.states[cityIdx] || 'CA';
      const streetNum = Math.floor(Math.random() * 899 + 100);
      const streetName = locData.streets[Math.floor(Math.random() * locData.streets.length)];
      const zip = `${Math.floor(Math.random() * 89999 + 10000)}`;

      // Job
      const jobItem = DICTIONARIES.jobs[Math.floor(Math.random() * DICTIONARIES.jobs.length)];
      const company = DICTIONARIES.companies[Math.floor(Math.random() * DICTIONARIES.companies.length)];

      // Age & Birth
      const age = Math.floor(Math.random() * 38 + 22);
      const currentYear = 2026;
      const birthYear = currentYear - age;
      const birthMonth = String(Math.floor(Math.random() * 12 + 1)).padStart(2, '0');
      const birthDay = String(Math.floor(Math.random() * 28 + 1)).padStart(2, '0');
      const birthDate = `${birthYear}-${birthMonth}-${birthDay}`;

      // Mock Payment Info (Test masked cards)
      const isVisa = Math.random() > 0.5;
      const cardPrefix = isVisa ? '4111' : '5500';
      const cardMid = `${Math.floor(Math.random() * 8999 + 1000)} ${Math.floor(Math.random() * 8999 + 1000)}`;
      const cardEnd = `${Math.floor(Math.random() * 8999 + 1000)}`;
      const cardNumber = `${cardPrefix} ${cardMid} ${cardEnd}`;
      const cvv = String(Math.floor(Math.random() * 899 + 100));
      const expMonth = String(Math.floor(Math.random() * 12 + 1)).padStart(2, '0');
      const exp = `${expMonth}/29`;

      const avatarBg = DICTIONARIES.avatarGradients[Math.floor(Math.random() * DICTIONARIES.avatarGradients.length)];
      const initials = `${firstName[0]}${lastName[0]}`;

      newProfiles.push({
        id: `usr_${Math.random().toString(36).substring(2, 9)}`,
        fullName,
        firstName,
        lastName,
        gender,
        avatarBg,
        initials,
        age,
        birthDate,
        email,
        phone,
        address: {
          street: `${streetNum} ${streetName}`,
          city,
          state,
          zip,
          country
        },
        job: {
          title: jobItem.title,
          company,
          department: jobItem.dept
        },
        finance: {
          cardNumber,
          cardType: isVisa ? 'Visa' : 'Mastercard',
          cvv,
          exp
        }
      });
    }

    setProfiles(newProfiles);
  };

  useEffect(() => {
    generateProfiles();
  }, [count, genderFilter, countryFilter]);

  // Copy All as JSON
  const copyAllJson = () => {
    playSound('bell');
    const jsonStr = JSON.stringify(profiles, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopiedAllJson(true);
    setTimeout(() => setCopiedAllJson(false), 2200);
  };

  // Download All as JSON file
  const downloadJson = () => {
    playSound('tap');
    const blob = new Blob([JSON.stringify(profiles, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mock-profiles-${profiles.length}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copy Single Profile Card
  const copySingleCardJson = (profile: MockProfile) => {
    playSound('bell');
    navigator.clipboard.writeText(JSON.stringify(profile, null, 2));
    setCopiedCardId(profile.id);
    setTimeout(() => setCopiedCardId(null), 2000);
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-2.5">
          {onBackToGrid && (
            <button
              onClick={onBackToGrid}
              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-white/60 transition-colors"
              title="Back to tools"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Users className="w-4 h-4" />
            </span>
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              Mock Random Profile & User Generator
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/20 text-purple-600 dark:text-purple-300">
              QA Testing
            </span>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={generateProfiles}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md hover:shadow-purple-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin-hover" />
            <span>Generate New</span>
          </button>
          <button
            onClick={copyAllJson}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-white text-xs font-bold transition-all cursor-pointer"
          >
            {copiedAllJson ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>JSON Copied!</span>
              </>
            ) : (
              <>
                <Code className="w-3.5 h-3.5 text-purple-400" />
                <span>Copy JSON Dump</span>
              </>
            )}
          </button>
          <button
            onClick={downloadJson}
            className="p-1.5 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white transition-colors"
            title="Download JSON File"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Parameters Bar */}
      <div className="p-4 rounded-3xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
        {/* Count Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600 dark:text-white/70">Profiles:</span>
          <div className="flex items-center p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 text-xs font-bold">
            {[1, 3, 6, 12].map((num) => (
              <button
                key={num}
                onClick={() => {
                  setCount(num);
                  playSound('tap');
                }}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  count === num
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Gender Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600 dark:text-white/70">Gender:</span>
          <div className="flex items-center p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 text-xs font-bold">
            {(['any', 'male', 'female'] as const).map((g) => (
              <button
                key={g}
                onClick={() => {
                  setGenderFilter(g);
                  playSound('tap');
                }}
                className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                  genderFilter === g
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Country Locale Template Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600 dark:text-white/70 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-purple-400" />
            Locale:
          </span>
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-purple-500"
          >
            <option value="ALL">All Countries (Global)</option>
            <option value="US">United States (US)</option>
            <option value="UK">United Kingdom (UK)</option>
            <option value="CA">Canada (CA)</option>
            <option value="AU">Australia (AU)</option>
            <option value="IN">India (IN)</option>
            <option value="DE">Germany (DE)</option>
          </select>
        </div>
      </div>

      {/* Mock Identity Card Visualization Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {profiles.map((p) => (
          <div
            key={p.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-purple-500/40 transition-all duration-200 space-y-4 relative group"
          >
            {/* Top Identity Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${p.avatarBg} text-white font-black text-sm flex items-center justify-center shadow-md shrink-0`}>
                  {p.initials}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">
                    {p.fullName}
                  </h4>
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-medium truncate">
                    {p.job.title}
                  </p>
                  <span className="text-[10px] text-slate-400">
                    {p.gender} • Age {p.age} • Born {p.birthDate}
                  </span>
                </div>
              </div>

              {/* Single Card Copy Trigger */}
              <button
                onClick={() => copySingleCardJson(p)}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-purple-500/20 text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 transition-colors shrink-0"
                title="Copy Profile JSON"
              >
                {copiedCardId === p.id ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Profile Attributes List */}
            <div className="space-y-2 text-xs text-slate-600 dark:text-white/70 pt-2 border-t border-slate-100 dark:border-white/5">
              {/* Email */}
              <div className="flex items-center gap-2 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-mono text-[11px] truncate select-all">{p.email}</span>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-mono text-[11px] select-all">{p.phone}</span>
              </div>

              {/* Address */}
              <div className="flex items-center gap-2 truncate">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-[11px] truncate select-all">
                  {p.address.street}, {p.address.city}, {p.address.state} {p.address.zip} ({p.address.country})
                </span>
              </div>

              {/* Company */}
              <div className="flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-[11px] select-all">{p.job.company} • {p.job.department}</span>
              </div>
            </div>

            {/* Mock Credit Card Badge for QA Testing */}
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/5 space-y-1">
              <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-white/40 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <CreditCard className="w-3 h-3 text-purple-400" />
                  Mock {p.finance.cardType} (Sandbox)
                </span>
                <span>EXP {p.finance.exp}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-800 dark:text-cyan-300 tracking-wider">
                  {p.finance.cardNumber}
                </span>
                <span className="font-mono text-[10px] text-slate-400">
                  CVV {p.finance.cvv}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
