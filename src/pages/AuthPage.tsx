import { useEffect, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { LockKeyhole, Mail, PlusCircle, UserCircle } from 'lucide-react';
import HeaderNav from '../components/HeaderNav';
import WorkYaarLogo from '../components/WorkYaarLogo';
import { saveAuthUser, type AuthProvider, type AuthRole, type AuthUser } from '../lib/auth';

const authSlides = [
  {
    src: '/assets/auth-professional-laptop.jpg',
    alt: 'Professional candidate working on a laptop',
  },
  {
    src: '/assets/auth-hiring-team.jpg',
    alt: 'Hiring team reviewing candidates',
  },
];

const deviceAccounts: Record<Exclude<AuthProvider, 'email'>, Omit<AuthUser, 'role'>[]> = {
  google: [
    {
      id: 'google-vm',
      name: 'Venclave Mamidi',
      email: 'venclavemamidi2006@gmail.com',
      provider: 'google',
    },
    {
      id: 'google-work',
      name: 'Priya Sharma',
      email: 'priya.sharma@gmail.com',
      provider: 'google',
    },
  ],
  linkedin: [
    {
      id: 'linkedin-vm',
      name: 'Venclave Mamidi',
      email: 'venclave@linkedin.com',
      provider: 'linkedin',
    },
  ],
  microsoft: [
    {
      id: 'microsoft-vm',
      name: 'Venclave Mamidi',
      email: 'venclave@outlook.com',
      provider: 'microsoft',
    },
  ],
};

const AuthPage = ({ mode = 'login' }: { mode?: 'login' | 'register' }) => {
  const [role, setRole] = useState<'candidate' | 'employer'>('candidate');
  const [passwordMode, setPasswordMode] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [authSlide, setAuthSlide] = useState(0);
  const [accountProvider, setAccountProvider] = useState<Exclude<AuthProvider, 'email'> | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setInterval(() => {
      setAuthSlide((current) => (current + 1) % authSlides.length);
    }, 2600);

    return () => window.clearInterval(timer);
  }, []);

  const goToDashboard = () => {
    navigate(role === 'candidate' ? '/dashboard/candidate' : '/dashboard/employer');
  };

  const signInWithAccount = (account: Omit<AuthUser, 'role'>) => {
    saveAuthUser({ ...account, role: role as AuthRole });
    setAccountProvider(null);
    goToDashboard();
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    const fallbackName = email ? email.split('@')[0].replace(/[._-]/g, ' ') : role === 'candidate' ? 'Candidate User' : 'Employer User';
    saveAuthUser({
      id: `email-${Date.now()}`,
      name: fullName || fallbackName,
      email: email || `${role}@workyaar.local`,
      provider: 'email',
      role: role as AuthRole,
    });
    goToDashboard();
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex flex-col">
      <HeaderNav variant="auth" />

      {/* Main Auth Container */}
      <div className="flex-1 flex items-center justify-center p-4 py-20 relative overflow-hidden">
        {/* Decorative elements from screenshot */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-purple-200 rounded-full" />
        <div className="absolute top-40 right-40 w-6 h-6 bg-blue-100 rounded-full" />
        <div className="absolute bottom-20 left-1/4 w-8 h-8 bg-orange-100 rounded-full" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row max-w-5xl w-full min-h-[600px]"
        >
          {/* Left Side - Blue Panel */}
          <div className="md:w-[40%] bg-gradient-to-br from-[#0047FF] to-[#0034CC] p-12 text-white flex flex-col items-center justify-between text-center">
            <WorkYaarLogo
              className="rounded-2xl bg-white px-4 py-3 shadow-xl shadow-blue-950/10"
              imageClassName="h-16 w-16 rounded-2xl bg-white"
              textClassName="text-3xl text-[#111827]"
            />
            
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-[24px] border border-white/20 w-full">
              <div className="relative mb-4 h-48 overflow-hidden rounded-xl bg-white">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={authSlides[authSlide].src}
                    src={authSlides[authSlide].src}
                    alt={authSlides[authSlide].alt}
                    initial={{ x: -90, opacity: 0, scale: 1.04 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    exit={{ x: 90, opacity: 0, scale: 1.04 }}
                    transition={{ duration: 0.75, ease: 'easeInOut' }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </AnimatePresence>
              </div>
              <h3 className="text-xl font-bold mb-1">
                {role === 'candidate' ? 'Land Your Dream Job' : 'Hire Top Talent'}
              </h3>
              <p className="text-sm text-blue-100">
                {role === 'candidate' ? 'compete, learn & get hired' : 'post jobs & find the best'}
              </p>
            </div>
            
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-white" />
              <div className="w-2 h-2 rounded-full bg-white/30" />
              <div className="w-2 h-2 rounded-full bg-white/30" />
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="md:w-[60%] p-12 flex flex-col justify-center">
            <WorkYaarLogo imageClassName="h-12 w-12" textClassName="text-2xl" className="mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {mode === 'login' ? 'Your Next Opportunity Starts Here' : 'Create your WorkYaar account'}
            </h1>
            <p className="text-gray-500 mb-8">
              {mode === 'login' 
                ? 'Log in to discover competitions, jobs, and internships built for you.'
                : 'Sign up to discover competitions, jobs, and internships built for you.'}
            </p>

            {/* Role Selector */}
            <div className="flex bg-gray-100 p-1 rounded-xl mb-8 w-fit">
              <button 
                onClick={() => setRole('candidate')}
                className={`px-8 py-2 rounded-lg text-sm font-bold transition-all ${role === 'candidate' ? 'bg-white text-[#0047FF] shadow-sm' : 'text-gray-500'}`}
              >
                I'm a Candidate
              </button>
              <button 
                onClick={() => setRole('employer')}
                className={`px-8 py-2 rounded-lg text-sm font-bold transition-all ${role === 'employer' ? 'bg-white text-[#0047FF] shadow-sm' : 'text-gray-500'}`}
              >
                I'm an Employer
              </button>
            </div>

            {/* Social Logins */}
            <div className="space-y-4 mb-8">
              <button type="button" onClick={() => setAccountProvider('google')} className="w-full border border-gray-200 py-3 rounded-xl flex items-center justify-center gap-3 font-bold text-gray-700 hover:bg-gray-50">
                <GoogleLogo />
                {mode === 'login' ? 'Continue with Google' : 'Sign up with Google'}
              </button>
              <button type="button" onClick={() => setAccountProvider('linkedin')} className="w-full border border-gray-200 py-3 rounded-xl flex items-center justify-center gap-3 font-bold text-gray-700 hover:bg-gray-50">
                <LinkedInLogo />
                {mode === 'login' ? 'Continue with LinkedIn' : 'Sign up with LinkedIn'}
              </button>
              <button type="button" onClick={() => setAccountProvider('microsoft')} className="w-full border border-gray-200 py-3 rounded-xl flex items-center justify-center gap-3 font-bold text-gray-700 hover:bg-gray-50">
                <MicrosoftLogo />
                {mode === 'login' ? 'Continue with Microsoft' : 'Sign up with Microsoft'}
              </button>
            </div>

            <div className="relative mb-8 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
              <span className="relative px-4 bg-white text-gray-400 text-sm font-medium">OR</span>
            </div>

            {/* Main Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {mode === 'register' && (
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Full Name <span className="text-red-500">*</span></label>
                  <input value={fullName} onChange={(event) => setFullName(event.target.value)} type="text" placeholder="e.g. Priya Sharma" className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#0047FF] outline-none" />
                </div>
              )}
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Email <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="you@example.com" className="w-full border border-gray-200 pl-11 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-[#0047FF] outline-none" />
                </div>
              </div>

              {mode === 'login' && passwordMode && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-bold text-gray-700">Password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="password"
                      placeholder="Enter password"
                      className="w-full border border-gray-200 pl-11 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-[#0047FF] outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <button
                      type="button"
                      onClick={() => setForgotSent(true)}
                      className="font-bold text-[#0047FF] hover:underline"
                    >
                      Forgot password?
                    </button>
                    {forgotSent && <span className="font-semibold text-green-600">Reset link sent</span>}
                  </div>
                </motion.div>
              )}
              
              {mode === 'register' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-gray-700">Password <span className="text-red-500">*</span></label>
                    <input type="password" placeholder="Min. 6 chars" className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#0047FF] outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-gray-700">Confirm Password <span className="text-red-500">*</span></label>
                    <input type="password" placeholder="Repeat password" className="w-full border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#0047FF] outline-none" />
                  </div>
                </div>
              )}

              {mode === 'login' ? (
                <div className="space-y-6 pt-4">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setPasswordMode((current) => !current);
                        setForgotSent(false);
                      }}
                      className="text-sm font-bold text-[#0047FF] hover:underline"
                    >
                      {passwordMode ? 'Use OTP instead' : 'Login via Password'}
                    </button>
                  </div>
                  <button type="submit" className="w-full bg-[#0047FF] py-4 rounded-xl text-white font-bold transition-transform hover:-translate-y-0.5">
                    {passwordMode ? 'Login with Password' : 'Continue with OTP'}
                  </button>
                  <p className="text-center text-sm text-gray-500">
                    Don't have an account? <Link to="/register" className="text-[#0047FF] font-bold">Sign Up</Link>
                  </p>
                </div>
              ) : (
                <div className="space-y-6 pt-4">
                  <button type="submit" className="w-full bg-[#E5E7EB] py-4 rounded-xl text-gray-500 font-bold hover:bg-[#0047FF] hover:text-white transition-colors">
                    Create Account
                  </button>
                  <p className="text-center text-sm text-gray-500">
                    Already have an account? <Link to="/login" className="text-[#0047FF] font-bold">Login</Link>
                  </p>
                </div>
              )}
            </form>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {accountProvider && (
          <AccountChooserModal
            provider={accountProvider}
            role={role}
            accounts={deviceAccounts[accountProvider]}
            onClose={() => setAccountProvider(null)}
            onSelect={signInWithAccount}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const providerLabels: Record<Exclude<AuthProvider, 'email'>, string> = {
  google: 'Google',
  linkedin: 'LinkedIn',
  microsoft: 'Microsoft',
};

const AccountChooserModal = ({
  provider,
  role,
  accounts,
  onClose,
  onSelect,
}: {
  provider: Exclude<AuthProvider, 'email'>;
  role: 'candidate' | 'employer';
  accounts: Omit<AuthUser, 'role'>[];
  onClose: () => void;
  onSelect: (account: Omit<AuthUser, 'role'>) => void;
}) => {
  const providerName = providerLabels[provider];

  const useOtherAccount = () => {
    onSelect({
      id: `${provider}-other-${Date.now()}`,
      name: role === 'candidate' ? 'New Candidate' : 'New Employer',
      email: role === 'candidate' ? `candidate@${provider}.com` : `employer@${provider}.com`,
      provider,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        className="w-full max-w-5xl overflow-hidden rounded-[32px] bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-3 text-xl font-medium text-gray-800">
            <ProviderLogo provider={provider} />
            Sign in with {providerName}
          </div>
          <button type="button" onClick={onClose} className="rounded-full px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100">
            Close
          </button>
        </div>

        <div className="grid gap-8 p-8 md:grid-cols-[1fr_1.2fr] md:p-12">
          <div>
            <WorkYaarLogo imageClassName="h-16 w-16" textClassName="text-3xl" className="mb-10" />
            <h2 className="text-4xl font-normal tracking-tight text-gray-950 md:text-5xl">Choose an account</h2>
            <p className="mt-6 text-xl text-gray-800">
              to continue to <span className="font-bold text-[#F56618]">WorkYaar</span>
            </p>
            <p className="mt-6 max-w-sm text-sm leading-6 text-gray-500">
              Select an existing account from this device. WorkYaar will sign you in automatically without asking you to sign up again.
            </p>
          </div>

          <div className="self-center">
            <div className="divide-y divide-gray-200 border-y border-gray-200">
              {accounts.map((account) => (
                <button
                  key={account.id}
                  type="button"
                  onClick={() => onSelect(account)}
                  className="flex w-full items-center gap-4 px-2 py-5 text-left transition-colors hover:bg-orange-50"
                >
                  <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-gray-900 text-sm font-black text-white">
                    {account.name
                      .split(' ')
                      .map((part) => part[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-950">{account.name}</p>
                    <p className="text-base text-gray-600">{account.email}</p>
                  </div>
                </button>
              ))}
              <button type="button" onClick={useOtherAccount} className="flex w-full items-center gap-4 px-2 py-5 text-left transition-colors hover:bg-orange-50">
                <UserCircle className="text-gray-500" size={30} />
                <span className="text-lg font-semibold text-gray-950">Use another account</span>
                <PlusCircle className="ml-auto text-[#F56618]" size={22} />
              </button>
            </div>
            <p className="mt-8 text-sm leading-6 text-gray-600">
              Before using this app, you can review WorkYaar's <span className="font-bold text-blue-600">Privacy Policy</span> and <span className="font-bold text-blue-600">Terms of Service</span>.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ProviderLogo = ({ provider }: { provider: Exclude<AuthProvider, 'email'> }) => {
  if (provider === 'google') return <GoogleLogo />;
  if (provider === 'linkedin') return <LinkedInLogo />;
  return <MicrosoftLogo />;
};

const GoogleLogo = () => (
  <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5">
    <path fill="#FFC107" d="M43.61 20.08H42V20H24v8h11.3C33.65 32.66 29.22 36 24 36c-6.63 0-12-5.37-12-12s5.37-12 12-12c3.06 0 5.84 1.15 7.96 3.04l5.66-5.66C34.05 6.05 29.27 4 24 4 12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20c0-1.34-.14-2.63-.39-3.92Z" />
    <path fill="#FF3D00" d="m6.31 14.69 6.57 4.82C14.66 15.11 18.96 12 24 12c3.06 0 5.84 1.15 7.96 3.04l5.66-5.66C34.05 6.05 29.27 4 24 4 16.32 4 9.66 8.34 6.31 14.69Z" />
    <path fill="#4CAF50" d="M24 44c5.17 0 9.86-1.98 13.41-5.19l-6.19-5.24C29.19 35.11 26.69 36 24 36c-5.2 0-9.62-3.31-11.28-7.93l-6.52 5.02C9.51 39.56 16.23 44 24 44Z" />
    <path fill="#1976D2" d="M43.61 20.08H42V20H24v8h11.3a12.04 12.04 0 0 1-4.08 5.57l6.19 5.24C36.97 39.21 44 34 44 24c0-1.34-.14-2.63-.39-3.92Z" />
  </svg>
);

const LinkedInLogo = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
    <rect width="24" height="24" rx="4" fill="#0A66C2" />
    <path fill="white" d="M6.94 8.98H4.72v10.3h2.22V8.98Zm.18-3.18c0-.72-.57-1.28-1.3-1.28-.74 0-1.32.56-1.32 1.28 0 .7.56 1.28 1.29 1.28h.02c.74 0 1.31-.58 1.31-1.28Zm12.38 7.56c0-2.77-1.48-4.05-3.46-4.05-1.59 0-2.3.87-2.7 1.48V8.98h-2.22c.03.68 0 10.3 0 10.3h2.22v-5.75c0-.31.02-.61.11-.83.24-.61.79-1.24 1.71-1.24 1.21 0 1.69.93 1.69 2.28v5.54h2.22v-5.92h.43Z" />
  </svg>
);

const MicrosoftLogo = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
    <path fill="#F25022" d="M3 3h8.4v8.4H3V3Z" />
    <path fill="#7FBA00" d="M12.6 3H21v8.4h-8.4V3Z" />
    <path fill="#00A4EF" d="M3 12.6h8.4V21H3v-8.4Z" />
    <path fill="#FFB900" d="M12.6 12.6H21V21h-8.4v-8.4Z" />
  </svg>
);

export default AuthPage;
