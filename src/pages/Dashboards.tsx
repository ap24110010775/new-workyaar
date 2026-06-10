import { useMemo, useState, type ReactNode } from 'react';
import {
  ArrowRight,
  Bell,
  Bookmark,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Compass,
  Crown,
  HelpCircle,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  Send,
  Settings,
  User,
  Video,
  X,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import WorkYaarLogo from '../components/WorkYaarLogo';
import { clearAuthUser, getAuthUser, getInitials, type AuthUser } from '../lib/auth';
import { cn } from '../lib/utils';

type Role = 'admin' | 'candidate' | 'employer';
type NavigateHandler = (page: string) => void;

interface MenuItem {
  icon: typeof LayoutDashboard;
  label: string;
  page: string;
  badge?: string;
  premium?: boolean;
}

interface TopicCard {
  icon: typeof LayoutDashboard;
  title: string;
  text: string;
  to: string;
}

const dashboardNavTopics = [
  {
    label: 'Career Advice',
    items: ['Resume tips', 'Interview preparation', 'Salary guide', 'Career paths'],
  },
  {
    label: 'Events',
    items: ['Hiring challenges', 'Webinars', 'Job fairs', 'Campus events'],
  },
  {
    label: 'Internships',
    items: ['Summer internships', 'Paid internships', 'Work from home', 'College internships'],
  },
  {
    label: 'Campus Hiring',
    items: ['For colleges', 'Placement drives', 'Fresher programs', 'Employer branding'],
  },
  {
    label: 'Browse Jobs',
    items: ['Remote jobs', 'Fresher jobs', 'Part-time jobs', 'Startup jobs'],
  },
];

const menuItems: Record<Role, MenuItem[]> = {
  candidate: [
    { icon: Home, label: 'Dashboard', page: 'Dashboard' },
    { icon: User, label: 'Profile', page: 'Profile' },
    { icon: Briefcase, label: 'Jobs', page: 'Jobs' },
    { icon: Send, label: 'Applications', page: 'Applications' },
    { icon: Bookmark, label: 'Saved Jobs', page: 'Saved Jobs' },
    { icon: Compass, label: 'Discover', page: 'Discover' },
    { icon: Zap, label: 'On-Demand Gigs', page: 'On-Demand Gigs' },
    { icon: MessageSquare, label: 'Messages', page: 'Messages' },
    { icon: Calendar, label: 'Interviews', page: 'Interviews' },
    { icon: Crown, label: 'WorkYaar Pro', page: 'WorkYaar Pro', premium: true },
  ],
  employer: [
    { icon: Home, label: 'Dashboard', page: 'Dashboard' },
    { icon: Building2, label: 'Company Profile', page: 'Company Profile' },
    { icon: Plus, label: 'Post Job', page: 'Post Job' },
    { icon: Briefcase, label: 'Manage Jobs', page: 'Manage Jobs' },
    { icon: Send, label: 'Applications', page: 'Applications' },
    { icon: Calendar, label: 'Interviews', page: 'Interviews' },
  ],
  admin: [
    { icon: Home, label: 'Dashboard', page: 'Dashboard' },
    { icon: User, label: 'Users', page: 'Users' },
    { icon: Briefcase, label: 'Jobs', page: 'Jobs' },
    { icon: Building2, label: 'Companies', page: 'Companies' },
  ],
};

const defaultSubtitles: Record<Role, string> = {
  admin: 'Manage users, jobs and platform activity with ease.',
  candidate: 'Plan, prioritize, and accomplish your job search with ease.',
  employer: 'Plan, prioritize, and accomplish your tasks with ease.',
};

const topicDescriptions: Record<Role, Record<string, string>> = {
  candidate: {
    Profile: 'Update your resume, skills, education, and profile completion details.',
    Jobs: 'Browse verified jobs matched to your skills and preferred work style.',
    Applications: 'Track every job application and see the next step clearly.',
    'Saved Jobs': 'Review roles you saved and apply when you are ready.',
    Discover: 'Explore roles, learning paths, and companies recommended for you.',
    'On-Demand Gigs': 'Find quick projects and flexible earning opportunities.',
    Messages: 'Open recruiter and company conversations in one place.',
    Interviews: 'View upcoming interviews, meeting links, and preparation notes.',
    'WorkYaar Pro': 'Unlock priority matching, resume review, and premium career tools.',
    Settings: 'Control account preferences, privacy, and notifications.',
    Help: 'Find support articles and ways to contact the WorkYaar team.',
    Notifications: 'Review recent updates from jobs, messages, and interviews.',
  },
  employer: {
    'Company Profile': 'Show candidates your company story, hiring values, and benefits.',
    'Post Job': 'Create a verified role with requirements, location, salary, and screening questions.',
    'Manage Jobs': 'Edit active jobs, pause listings, and review performance.',
    Applications: 'Review candidates, shortlist profiles, and move people to interviews.',
    Interviews: 'Manage interview schedules, meeting links, and notes.',
    Settings: 'Control team access, billing preferences, and notification rules.',
    Help: 'Get hiring support and platform guidance.',
    Notifications: 'Review new applicant, job, and interview updates.',
  },
  admin: {
    Users: 'Review platform users, roles, and account activity.',
    Jobs: 'Moderate posted jobs and keep listings verified.',
    Companies: 'Manage employer accounts and company verification.',
    Settings: 'Control admin preferences and platform defaults.',
    Help: 'Open support and moderation documentation.',
    Notifications: 'Review platform alerts and moderation reminders.',
  },
};

const DashboardShell = ({
  role,
  renderDashboard,
}: {
  role: Role;
  renderDashboard: (navigate: NavigateHandler) => ReactNode;
}) => {
  const [activePage, setActivePage] = useState('Dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authUser] = useState<AuthUser | null>(() => getAuthUser());
  const header = useMemo(() => getHeaderCopy(role, activePage), [role, activePage]);
  const employerDetailPages = ['Company Profile', 'Post Job', 'Manage Jobs', 'Applications', 'Interviews'];
  const hideHeader = role === 'employer' && employerDetailPages.includes(activePage);

  const navigate = (page: string) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      <DashboardTopBar
        role={role}
        onNavigate={navigate}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen((open) => !open)}
      />
      <div className="flex">
        <Sidebar role={role} activePage={activePage} onNavigate={navigate} />
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <button
              type="button"
              aria-label="Close dashboard menu"
              className="absolute inset-0 bg-black/35"
              onClick={() => setMobileMenuOpen(false)}
            />
            <Sidebar role={role} activePage={activePage} onNavigate={navigate} mobile />
          </div>
        )}
        <div className="flex min-w-0 flex-1 flex-col">
          {!hideHeader && <Header role={role} title={header.title} subtitle={header.subtitle} onNavigate={navigate} authUser={authUser} />}
          <main className="p-4 sm:p-6 lg:p-8">
            {activePage === 'Dashboard' ? renderDashboard(navigate) : <TopicPanel role={role} page={activePage} onNavigate={navigate} />}
          </main>
        </div>
      </div>
    </div>
  );
};

const DashboardTopBar = ({
  role,
  onNavigate,
  mobileMenuOpen,
  onToggleMobileMenu,
}: {
  role: Role;
  onNavigate: NavigateHandler;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}) => {
  const [openTopic, setOpenTopic] = useState<string | null>(null);

  const toggleTopic = (topic: string) => {
    setOpenTopic((current) => (current === topic ? null : topic));
  };

  return (
    <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-100 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-4 sm:gap-8">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="rounded-xl border border-gray-200 p-2 text-gray-700 lg:hidden"
          aria-label="Open dashboard menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        {role === 'admin' && <WorkYaarLogo imageClassName="h-10 w-10" textClassName="text-2xl" />}
        <nav className="hidden items-center gap-1 text-sm font-bold text-gray-600 lg:flex">
          <Link to="/" className="rounded-full px-4 py-2 transition-colors hover:bg-orange-50 hover:text-[#F56618]">
            Home
          </Link>
          {dashboardNavTopics.map((topic) => (
            <div key={topic.label} className="relative">
              <button
                type="button"
                onClick={() => toggleTopic(topic.label)}
                className={cn(
                  'flex items-center gap-1 rounded-full px-4 py-2 transition-colors',
                  openTopic === topic.label ? 'bg-orange-50 text-[#F56618]' : 'hover:bg-orange-50 hover:text-[#F56618]',
                )}
                aria-expanded={openTopic === topic.label}
              >
                {topic.label}
                <ChevronDown size={16} className={cn('transition-transform', openTopic === topic.label && 'rotate-180')} />
              </button>

              {openTopic === topic.label && (
                <div className="absolute left-1/2 top-full mt-2 w-64 -translate-x-1/2 rounded-3xl border border-orange-100 bg-white p-3 shadow-2xl shadow-orange-100/80">
                  <p className="px-3 pb-2 text-[11px] font-black uppercase tracking-[0.22em] text-orange-300">
                    {topic.label}
                  </p>
                  <div className="space-y-1">
                    {topic.items.map((item) => (
                      <a
                        key={item}
                        href="/#opportunities"
                        onClick={() => setOpenTopic(null)}
                        className="block rounded-2xl px-3 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-orange-50 hover:text-[#F56618]"
                      >
                        {item}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onNavigate('Notifications')}
          className="relative rounded-full border border-gray-200 p-2.5 text-gray-500 transition-colors hover:border-[#F56618] hover:text-[#F56618]"
          aria-label="Open notifications"
        >
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#F56618]" />
        </button>
        {role === 'admin' && (
          <Link onClick={clearAuthUser} to="/login" className="rounded-lg border border-gray-200 bg-gray-50 px-5 py-2 text-sm font-bold text-gray-900 transition-colors hover:bg-white">
            Logout
          </Link>
        )}
      </div>
    </div>
  );
};

const getHeaderCopy = (role: Role, page: string) => {
  if (page === 'Dashboard') {
    return {
      title: role === 'admin' ? 'Admin Dashboard' : 'Dashboard',
      subtitle: defaultSubtitles[role],
    };
  }

  return {
    title: page,
    subtitle: topicDescriptions[role][page] ?? 'Open related tools and actions for this section.',
  };
};

const Sidebar = ({
  role,
  activePage,
  onNavigate,
  mobile = false,
}: {
  role: Role;
  activePage: string;
  onNavigate: NavigateHandler;
  mobile?: boolean;
}) => {
  const items = menuItems[role];

  return (
    <aside
      className={cn(
        'z-10 flex shrink-0 flex-col overflow-y-auto border-r border-gray-100 bg-white',
        mobile ? 'h-full w-72 shadow-2xl shadow-black/20' : 'sticky top-16 hidden h-[calc(100vh-4rem)] w-64 lg:flex',
      )}
    >
      <div className="p-6">
        <WorkYaarLogo
          className="mb-8 justify-center rounded-2xl bg-white px-3 py-3 shadow-xl shadow-orange-100"
          imageClassName="h-11 w-11 rounded-xl bg-white"
          textClassName="text-xl text-[#111827]"
        />

        <div className="space-y-1">
          <p className="mb-2 px-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Menu</p>
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.page;

            return (
              <button
                key={item.page}
                type="button"
                onClick={() => onNavigate(item.page)}
                className={cn(
                  'group flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-all',
                  isActive ? 'bg-[#F56618] text-white shadow-lg shadow-[#F56618]/20' : 'text-gray-500 hover:bg-gray-50',
                  item.premium && !isActive && 'border border-yellow-100 bg-yellow-50 text-yellow-700',
                )}
              >
                <span className="flex items-center gap-3">
                  <Icon size={20} className={cn(isActive ? 'text-white' : 'text-gray-400 group-hover:text-[#F56618]')} />
                  <span className="text-sm font-bold">{item.label}</span>
                </span>
                {item.badge && <span className="rounded-full bg-black px-2 py-0.5 text-[10px] text-white">{item.badge}</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-auto space-y-1 p-6">
        <p className="mb-2 px-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">General</p>
        <SidebarUtilityButton icon={Settings} label="Settings" active={activePage === 'Settings'} onClick={() => onNavigate('Settings')} />
        <SidebarUtilityButton icon={HelpCircle} label="Help" active={activePage === 'Help'} onClick={() => onNavigate('Help')} />
        <Link onClick={clearAuthUser} to="/login" className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-bold text-gray-500 hover:bg-gray-50">
          <LogOut size={20} className="text-gray-400" />
          <span className="text-sm">Logout</span>
        </Link>
      </div>
    </aside>
  );
};

const SidebarUtilityButton = ({ icon: Icon, label, active, onClick }: any) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'flex w-full items-center gap-3 rounded-xl px-4 py-3 font-bold transition-colors',
      active ? 'bg-[#F56618] text-white' : 'text-gray-500 hover:bg-gray-50',
    )}
  >
    <Icon size={20} className={active ? 'text-white' : 'text-gray-400'} />
    <span className="text-sm">{label}</span>
  </button>
);

const Header = ({
  role,
  title,
  subtitle,
  onNavigate,
  authUser,
}: {
  role: Role;
  title: string;
  subtitle: string;
  onNavigate: NavigateHandler;
  authUser: AuthUser | null;
}) => (
  <header className="flex flex-col gap-5 border-b border-gray-100 bg-white p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8">
    <div className="min-w-0">
      <h1 className="mb-1 text-3xl font-black text-gray-900">{title}</h1>
      <p className="text-sm font-medium text-gray-400">{subtitle}</p>
    </div>

    <div className="flex flex-wrap items-center gap-3 lg:gap-4">
      <div className="mr-2 flex items-center gap-3 lg:mr-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-sm font-black text-[#F56618]">
          {getInitials(authUser?.name ?? role)}
        </div>
        <div>
          <span className="block text-xs font-medium text-gray-400">Welcome</span>
          <span className="block text-sm font-black text-gray-900">{authUser?.name ?? role}</span>
        </div>
      </div>

      {role === 'admin' ? (
        <>
          <ActionButton icon={RefreshCw} label="Refresh" onClick={() => onNavigate('Dashboard')} primary />
          <ActionButton label="Manage Users" onClick={() => onNavigate('Users')} />
        </>
      ) : role === 'employer' ? (
        <>
          <ActionButton icon={Plus} label="Post Job" onClick={() => onNavigate('Post Job')} primary />
          <ActionButton label="Manage Jobs" onClick={() => onNavigate('Manage Jobs')} />
        </>
      ) : (
        <>
          <ActionButton icon={Search} label="Find Jobs" onClick={() => onNavigate('Jobs')} primary />
          <ActionButton label="Edit Profile" onClick={() => onNavigate('Profile')} />
        </>
      )}
      <button
        type="button"
        onClick={() => onNavigate('Notifications')}
        className="rounded-full bg-gray-50 p-2.5 text-gray-400 transition-colors hover:text-gray-900"
        aria-label="Open notifications"
      >
        <Bell size={20} />
      </button>
    </div>
  </header>
);

const ActionButton = ({ icon: Icon, label, onClick, primary = false }: any) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition-transform hover:-translate-y-0.5',
      primary ? 'bg-[#F56618] text-white shadow-lg shadow-[#F56618]/20' : 'border border-gray-200 bg-white text-gray-900 hover:bg-gray-50',
    )}
  >
    {Icon && <Icon size={18} />}
    {label}
  </button>
);

const StatCard = ({ label, value, trend, active, onClick }: any) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'flex h-48 flex-col justify-between rounded-[32px] border p-8 text-left transition-all hover:-translate-y-1',
      active ? 'border-transparent bg-[#F56618] text-white shadow-2xl shadow-[#F56618]/30' : 'border-gray-100 bg-white hover:shadow-xl hover:shadow-gray-200/60',
    )}
  >
    <div className="flex items-start justify-between">
      <span className={cn('text-lg font-bold', active ? 'text-white/90' : 'text-gray-500')}>{label}</span>
      <span className={cn('rounded-full p-1.5', active ? 'bg-white/20' : 'bg-gray-50')}>
        <ArrowRight size={16} className={active ? 'text-white' : 'text-gray-400'} />
      </span>
    </div>
    <div>
      <div className="mb-2 text-5xl font-black">{value}</div>
      <div className="flex items-center gap-1">
        <Plus size={14} className={active ? 'text-white' : 'text-[#F56618]'} />
        <span className={cn('text-xs font-bold', active ? 'text-white/80' : 'text-gray-400')}>{trend}</span>
      </div>
    </div>
  </button>
);

export const AdminDashboard = () => <DashboardShell role="admin" renderDashboard={(navigate) => <AdminHome onNavigate={navigate} />} />;

export const CandidateDashboard = () => <DashboardShell role="candidate" renderDashboard={(navigate) => <CandidateHome onNavigate={navigate} />} />;

export const EmployerDashboard = () => <DashboardShell role="employer" renderDashboard={(navigate) => <EmployerHome onNavigate={navigate} />} />;

const AdminHome = ({ onNavigate }: { onNavigate: NavigateHandler }) => (
  <>
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
      <StatCard label="Users" value="0" trend="Open user controls" active onClick={() => onNavigate('Users')} />
      <StatCard label="Jobs" value="0" trend="Review posted roles" onClick={() => onNavigate('Jobs')} />
      <StatCard label="Applications" value="0" trend="View platform activity" onClick={() => onNavigate('Users')} />
      <StatCard label="Companies" value="0" trend="Manage employers" onClick={() => onNavigate('Companies')} />
    </div>
    <Panel title="Platform Analytics">
      <div className="relative h-64 border-b border-l border-gray-100">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="absolute w-full border-t border-gray-50" style={{ top: `${i * 20}%` }} />
        ))}
      </div>
    </Panel>
  </>
);

const CandidateHome = ({ onNavigate }: { onNavigate: NavigateHandler }) => (
  <>
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
      <StatCard label="Applications" value="0" trend="Open applications" active onClick={() => onNavigate('Applications')} />
      <StatCard label="Saved Jobs" value="0" trend="Open saved jobs" onClick={() => onNavigate('Saved Jobs')} />
      <StatCard label="Profile Views" value="0" trend="Update profile" onClick={() => onNavigate('Profile')} />
      <StatCard label="Interviews" value="0" trend="Open interviews" onClick={() => onNavigate('Interviews')} />
    </div>

    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="space-y-8 lg:col-span-2">
        <Panel title="Application Activity">
          <EmptyState
            title="No activity yet"
            text="Your application chart will update after you start applying to jobs."
            actionLabel="Find Jobs"
            onAction={() => onNavigate('Jobs')}
          />
        </Panel>

        <Panel title="Recent Applications" action={<MiniButton label="View all" onClick={() => onNavigate('Applications')} />}>
          <EmptyState
            title="No applications yet"
            text="Applications will appear here after you apply for a role."
            actionLabel="Browse Jobs"
            onAction={() => onNavigate('Jobs')}
          />
        </Panel>
      </div>

      <div className="space-y-8">
        <Panel title="Upcoming Interview">
          <EmptyState
            title="No interviews scheduled"
            text="Interview invitations will appear here when recruiters respond."
            actionLabel="Open Interviews"
            onAction={() => onNavigate('Interviews')}
          />
        </Panel>

        <button type="button" onClick={() => onNavigate('Profile')} className="w-full text-left">
          <Panel title="Profile Completion">
            <ProgressGauge label="Completed" percent={0} />
          </Panel>
        </button>
      </div>
    </div>
  </>
);

const EmployerHome = ({ onNavigate }: { onNavigate: NavigateHandler }) => (
  <>
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
      <StatCard label="Total Jobs" value="0" trend="Manage jobs" active onClick={() => onNavigate('Manage Jobs')} />
      <StatCard label="Applications" value="0" trend="Review candidates" onClick={() => onNavigate('Applications')} />
      <StatCard label="Shortlisted" value="0" trend="Open shortlist" onClick={() => onNavigate('Applications')} />
      <StatCard label="Interviews" value="0" trend="Schedule interviews" onClick={() => onNavigate('Interviews')} />
    </div>

    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="space-y-8 lg:col-span-2">
        <Panel title="Project Analytics">
          <EmptyState
            title="No job analytics yet"
            text="Analytics will appear after you post a job and candidates start applying."
            actionLabel="Post Job"
            onAction={() => onNavigate('Post Job')}
          />
        </Panel>

        <Panel title="Team Collaboration" action={<MiniButton label="Add Member" icon={Plus} onClick={() => onNavigate('Company Profile')} />}>
          <EmptyState
            title="No team members yet"
            text="Team activity will update after you add hiring members."
            actionLabel="Company Profile"
            onAction={() => onNavigate('Company Profile')}
          />
        </Panel>
      </div>

      <div className="space-y-8">
        <Panel title="Project" action={<MiniButton label="New" icon={Plus} onClick={() => onNavigate('Post Job')} />}>
          <EmptyState
            title="No projects yet"
            text="Posted jobs and hiring projects will show here."
            actionLabel="Post Job"
            onAction={() => onNavigate('Post Job')}
          />
        </Panel>

        <button type="button" onClick={() => onNavigate('Manage Jobs')} className="w-full text-left">
          <Panel title="Project Progress">
            <ProgressGauge label="Project Progress" percent={0} />
          </Panel>
        </button>
      </div>
    </div>
  </>
);

const TopicPanel = ({ role, page, onNavigate }: { role: Role; page: string; onNavigate: NavigateHandler }) => {
  if (page === 'Notifications') return <NotificationCenter role={role} onNavigate={onNavigate} />;

  if (role === 'candidate') {
    if (page === 'Profile') return <CandidateProfilePage onNavigate={onNavigate} />;
    if (page === 'Jobs') return <CandidateJobsPage onNavigate={onNavigate} />;
    if (page === 'Applications') return <CandidateApplicationsPage onNavigate={onNavigate} />;
    if (page === 'Saved Jobs') return <CandidateSavedJobsPage onNavigate={onNavigate} />;
    if (page === 'Discover') return <CandidateDiscoverPage onNavigate={onNavigate} />;
    if (page === 'On-Demand Gigs') return <CandidateGigsPage onNavigate={onNavigate} />;
    if (page === 'Messages') return <CandidateMessagesPage onNavigate={onNavigate} />;
    if (page === 'Interviews') return <CandidateInterviewsPage onNavigate={onNavigate} />;
    if (page === 'WorkYaar Pro') return <WorkYaarProPage />;
  }

  if (role === 'employer') {
    if (page === 'Company Profile') return <CompanyProfilePage onNavigate={onNavigate} />;
    if (page === 'Post Job') return <PostJobPage onNavigate={onNavigate} />;
    if (page === 'Manage Jobs') return <ManageJobsPage onNavigate={onNavigate} />;
    if (page === 'Applications') return <EmployerApplicationsPage onNavigate={onNavigate} />;
    if (page === 'Interviews') return <EmployerInterviewsPage onNavigate={onNavigate} />;
  }

  const topic = getTopicCards(role, page);

  return (
    <div className="space-y-8">
      <Panel title={page} action={<MiniButton label="Back to Dashboard" onClick={() => onNavigate('Dashboard')} />}>
        <p className="mb-8 max-w-3xl text-gray-500">{topic.description}</p>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {topic.cards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.title}
                type="button"
                onClick={() => onNavigate(card.to)}
                className="rounded-3xl border border-gray-100 bg-gray-50 p-6 text-left transition-all hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-gray-200/70"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F56618] text-white">
                  <Icon size={20} />
                </div>
                <h3 className="mb-2 text-lg font-black text-gray-950">{card.title}</h3>
                <p className="mb-5 text-sm leading-6 text-gray-500">{card.text}</p>
                <span className="inline-flex items-center gap-2 text-sm font-black text-[#F56618]">
                  Open {card.to} <ArrowRight size={16} />
                </span>
              </button>
            );
          })}
        </div>
      </Panel>
    </div>
  );
};

const NotificationCenter = ({ role, onNavigate }: { role: Role; onNavigate: NavigateHandler }) => {
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'Unread', 'Jobs', 'Interviews'];
  const isEmployer = role === 'employer';
  const notificationCards = isEmployer
    ? [
        {
          icon: Send,
          title: 'Applications',
          text: 'New applicant alerts will appear here as candidates apply.',
          to: 'Applications',
        },
        {
          icon: Briefcase,
          title: 'Job Updates',
          text: 'Job approvals, edits, and listing performance updates will show here.',
          to: 'Manage Jobs',
        },
        {
          icon: Calendar,
          title: 'Interviews',
          text: 'Interview reminders and schedule changes will be collected here.',
          to: 'Interviews',
        },
      ]
    : [
        {
          icon: Briefcase,
          title: 'Job Matches',
          text: 'Fresh job matches and recommendations will appear here.',
          to: 'Jobs',
        },
        {
          icon: Send,
          title: 'Applications',
          text: 'Application status changes will be shown here.',
          to: 'Applications',
        },
        {
          icon: MessageSquare,
          title: 'Messages',
          text: 'Recruiter messages and replies will be collected here.',
          to: 'Messages',
        },
      ];

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[36px] border border-orange-100 bg-gradient-to-br from-[#FFF7F0] via-white to-[#FFE9D9] p-8 shadow-2xl shadow-orange-100/60">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#F56618]/10" />
        <div className="absolute -bottom-28 left-16 h-56 w-56 rounded-full bg-yellow-200/30" />
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-[#F56618] shadow-lg shadow-orange-100/60">
              <Bell size={16} /> Notification Center
            </div>
            <h2 className="text-3xl font-black text-gray-950">All caught up for now</h2>
            <p className="mt-3 max-w-2xl text-gray-500">
              Your important {isEmployer ? 'hiring' : 'career'} updates will appear here in one clean place.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate(isEmployer ? 'Applications' : 'Jobs')}
            className="rounded-2xl bg-[#F56618] px-6 py-4 font-black text-white shadow-xl shadow-orange-200 transition-transform hover:-translate-y-0.5"
          >
            {isEmployer ? 'Review Applications' : 'Find Jobs'}
          </button>
        </div>
      </section>

      <section className="rounded-[32px] border border-gray-100 bg-white p-6 sm:p-8">
        <div className="mb-6 flex flex-wrap gap-3">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={cn(
                'rounded-full px-5 py-2.5 text-sm font-black transition-colors',
                filter === item ? 'bg-[#F56618] text-white shadow-lg shadow-orange-100' : 'bg-orange-50 text-[#F56618] hover:bg-orange-100',
              )}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {notificationCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.title}
                type="button"
                onClick={() => onNavigate(card.to)}
                className="group rounded-3xl border border-orange-100 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-100/70"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-[#F56618] transition-colors group-hover:bg-[#F56618] group-hover:text-white">
                  <Icon size={20} />
                </div>
                <h3 className="mb-2 text-lg font-black text-gray-950">{card.title}</h3>
                <p className="mb-5 text-sm leading-6 text-gray-500">{card.text}</p>
                <span className="inline-flex items-center gap-2 text-sm font-black text-[#F56618]">
                  Open {card.to} <ArrowRight size={16} />
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 rounded-3xl border border-dashed border-orange-200 bg-orange-50/60 p-8 text-center">
          <CheckCircle2 className="mx-auto mb-3 text-[#F56618]" size={30} />
          <h3 className="text-xl font-black text-gray-950">No new {filter.toLowerCase()} notifications</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-500">
            We will notify you here when there are updates that need your attention.
          </p>
        </div>
      </section>
    </div>
  );
};

const getTopicCards = (role: Role, page: string) => {
  const description = topicDescriptions[role][page] ?? 'Choose an action below to continue.';
  const shared: Record<string, TopicCard[]> = {
    Settings: [
      { icon: Bell, title: 'Notifications', text: 'Manage email and app alerts.', to: 'Dashboard' },
      { icon: Settings, title: 'Security', text: 'Review login and privacy settings.', to: 'Help' },
      { icon: Save, title: 'Save Changes', text: 'Return once settings are updated.', to: 'Dashboard' },
    ],
    Help: [
      { icon: HelpCircle, title: 'Support Center', text: 'Browse answers and platform guides.', to: 'Dashboard' },
      { icon: MessageSquare, title: 'Contact Support', text: 'Start a support conversation.', to: role === 'candidate' ? 'Messages' : 'Applications' },
      { icon: ClipboardList, title: 'Documentation', text: 'Read detailed help articles.', to: 'Dashboard' },
    ],
  };

  const roleCards: Record<Role, Record<string, TopicCard[]>> = {
    candidate: {
      Profile: [
        { icon: User, title: 'Personal Details', text: 'Add your name, location, and contact information.', to: 'Profile' },
        { icon: ClipboardList, title: 'Resume and Skills', text: 'Highlight experience, tools, and career goals.', to: 'Jobs' },
        { icon: CheckCircle2, title: 'Profile Completion', text: 'Improve matching by completing all sections.', to: 'Applications' },
      ],
      Jobs: [
        { icon: Search, title: 'Search Jobs', text: 'Find remote, flexible, full-time, and contract roles.', to: 'Jobs' },
        { icon: Bookmark, title: 'Save Jobs', text: 'Shortlist opportunities before applying.', to: 'Saved Jobs' },
        { icon: Send, title: 'Apply Fast', text: 'Send your profile to verified employers.', to: 'Applications' },
      ],
      Applications: [
        { icon: ClipboardList, title: 'Application Tracker', text: 'See submitted, reviewed, and shortlisted roles.', to: 'Applications' },
        { icon: Calendar, title: 'Next Interview', text: 'Prepare for the next hiring conversation.', to: 'Interviews' },
        { icon: MessageSquare, title: 'Recruiter Messages', text: 'Follow up with companies directly.', to: 'Messages' },
      ],
      'Saved Jobs': [
        { icon: Bookmark, title: 'Saved Roles', text: 'Return to roles you bookmarked earlier.', to: 'Jobs' },
        { icon: Search, title: 'Similar Jobs', text: 'Find more opportunities like your saved roles.', to: 'Discover' },
        { icon: Send, title: 'Apply Now', text: 'Move a saved job into your applications.', to: 'Applications' },
      ],
      Discover: [
        { icon: Compass, title: 'Recommended Paths', text: 'Explore job paths and skill tracks.', to: 'Jobs' },
        { icon: Building2, title: 'Companies', text: 'Discover verified employers hiring now.', to: 'Jobs' },
        { icon: Zap, title: 'Fast Gigs', text: 'Find flexible earning options.', to: 'On-Demand Gigs' },
      ],
      'On-Demand Gigs': [
        { icon: Zap, title: 'Quick Projects', text: 'Short projects matched to your skill set.', to: 'Applications' },
        { icon: Briefcase, title: 'Contract Work', text: 'Browse contract and freelance listings.', to: 'Jobs' },
        { icon: MessageSquare, title: 'Gig Messages', text: 'Talk to clients and recruiters.', to: 'Messages' },
      ],
      Messages: [
        { icon: MessageSquare, title: 'Recruiter Inbox', text: 'Open candidate conversations.', to: 'Messages' },
        { icon: Calendar, title: 'Interview Updates', text: 'Check schedule changes and reminders.', to: 'Interviews' },
        { icon: Briefcase, title: 'Job Follow Ups', text: 'Follow up on active roles.', to: 'Applications' },
      ],
      Interviews: [
        { icon: Video, title: 'Join Interview', text: 'Open your upcoming interview room.', to: 'Interviews' },
        { icon: ClipboardList, title: 'Preparation Notes', text: 'Review role and company information.', to: 'Applications' },
        { icon: MessageSquare, title: 'Message Recruiter', text: 'Ask questions before the interview.', to: 'Messages' },
      ],
      'WorkYaar Pro': [
        { icon: Crown, title: 'Priority Matching', text: 'Get boosted recommendations.', to: 'Jobs' },
        { icon: ClipboardList, title: 'Resume Review', text: 'Improve your profile quality.', to: 'Profile' },
        { icon: CheckCircle2, title: 'Upgrade Benefits', text: 'See how Pro improves your search.', to: 'Dashboard' },
      ],
    },
    employer: {
      'Company Profile': [
        { icon: Building2, title: 'Company Details', text: 'Update logo, story, benefits, and culture.', to: 'Company Profile' },
        { icon: User, title: 'Hiring Team', text: 'Add team members and permissions.', to: 'Applications' },
        { icon: Briefcase, title: 'Open Roles', text: 'Connect profile updates to active jobs.', to: 'Manage Jobs' },
      ],
      'Post Job': [
        { icon: Plus, title: 'Create Job', text: 'Add role details and screening questions.', to: 'Post Job' },
        { icon: CheckCircle2, title: 'Verify Listing', text: 'Keep roles trusted for candidates.', to: 'Manage Jobs' },
        { icon: Send, title: 'Publish Role', text: 'Send the role live to candidates.', to: 'Manage Jobs' },
      ],
      'Manage Jobs': [
        { icon: Briefcase, title: 'Active Jobs', text: 'Edit, pause, or boost open listings.', to: 'Manage Jobs' },
        { icon: ClipboardList, title: 'Job Performance', text: 'Review views, saves, and applications.', to: 'Applications' },
        { icon: Plus, title: 'Post Another', text: 'Create a new opportunity.', to: 'Post Job' },
      ],
      Applications: [
        { icon: User, title: 'Candidate Review', text: 'Review resumes and skill matches.', to: 'Applications' },
        { icon: CheckCircle2, title: 'Shortlist', text: 'Move top profiles forward.', to: 'Interviews' },
        { icon: MessageSquare, title: 'Message Candidate', text: 'Contact applicants quickly.', to: 'Applications' },
      ],
      Interviews: [
        { icon: Calendar, title: 'Schedule', text: 'Book candidate meetings.', to: 'Interviews' },
        { icon: Video, title: 'Start Meeting', text: 'Open the interview room.', to: 'Interviews' },
        { icon: ClipboardList, title: 'Interview Notes', text: 'Capture hiring feedback.', to: 'Applications' },
      ],
    },
    admin: {
      Users: [
        { icon: User, title: 'User Directory', text: 'Review candidates, employers, and admins.', to: 'Users' },
        { icon: CheckCircle2, title: 'Verification', text: 'Approve trusted platform accounts.', to: 'Companies' },
        { icon: MessageSquare, title: 'Support', text: 'Handle user requests.', to: 'Help' },
      ],
      Jobs: [
        { icon: Briefcase, title: 'Job Moderation', text: 'Review and approve job listings.', to: 'Jobs' },
        { icon: CheckCircle2, title: 'Verified Jobs', text: 'Keep trusted roles visible.', to: 'Companies' },
        { icon: Search, title: 'Search Listings', text: 'Find and audit platform jobs.', to: 'Jobs' },
      ],
      Companies: [
        { icon: Building2, title: 'Employer Accounts', text: 'Review company details and status.', to: 'Companies' },
        { icon: ClipboardList, title: 'Company Jobs', text: 'Audit roles from each employer.', to: 'Jobs' },
        { icon: CheckCircle2, title: 'Approval Queue', text: 'Verify new companies.', to: 'Users' },
      ],
    },
  };

  return {
    description,
    cards: roleCards[role][page] ?? shared[page] ?? [
      { icon: LayoutDashboard, title: page, text: 'Open the related dashboard tools for this section.', to: 'Dashboard' },
      { icon: HelpCircle, title: 'Need Help?', text: 'Get support for this area.', to: 'Help' },
      { icon: Settings, title: 'Settings', text: 'Adjust preferences for this section.', to: 'Settings' },
    ],
  };
};

const Panel = ({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) => (
  <section className="rounded-[40px] border border-gray-100 bg-white p-8">
    <div className="mb-8 flex items-center justify-between gap-4">
      <h3 className="text-xl font-black">{title}</h3>
      {action}
    </div>
    {children}
  </section>
);

const ProgressGauge = ({ label, percent = 0 }: { label: string; percent?: number }) => (
  <>
    <div className="relative mx-auto h-24 w-48 overflow-hidden">
      <div className="absolute left-0 top-0 h-48 w-48 rounded-full border-[16px] border-gray-100" />
      <div className="absolute left-0 top-0 h-48 w-48 rounded-full border-[16px] border-[#F56618]" style={{ clipPath: `polygon(0 0, 100% 0, 100% ${percent}%, 0 ${percent}%)` }} />
      <div className="absolute bottom-0 left-0 w-full text-center">
        <span className="text-3xl font-black">{percent}%</span>
        <p className="text-[10px] font-bold text-gray-400">{label}</p>
      </div>
    </div>
    <div className="mt-8 flex justify-center gap-4">
      <LegendItem color="bg-[#F56618]" label="Done" />
      <LegendItem color="bg-orange-200" label="In Progress" />
      <LegendItem color="bg-gray-100" label="Remaining" />
    </div>
  </>
);

const MiniButton = ({ label, onClick, icon: Icon }: any) => (
  <button type="button" onClick={onClick} className="flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1.5 text-xs font-bold transition-colors hover:bg-gray-100">
    {Icon && <Icon size={14} />}
    {label}
  </button>
);

const EmptyState = ({ title, text, actionLabel, onAction }: { title: string; text: string; actionLabel?: string; onAction?: () => void }) => (
  <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50/70 p-8 text-center">
    <h4 className="mb-2 text-lg font-black text-gray-900">{title}</h4>
    <p className="mx-auto max-w-xl text-sm leading-6 text-gray-500">{text}</p>
    {actionLabel && onAction && (
      <button type="button" onClick={onAction} className="mt-6 rounded-xl bg-[#F56618] px-5 py-3 text-sm font-black text-white">
        {actionLabel}
      </button>
    )}
  </div>
);

const CandidateProfilePage = ({ onNavigate }: { onNavigate: NavigateHandler }) => {
  const [tab, setTab] = useState('Profile Details');
  const [saved, setSaved] = useState(false);
  const tabs = ['Profile Details', 'Resume / CV', 'Preferences', 'Social Profiles'];

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-5 border-b border-gray-200">
        {tabs.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={cn('px-6 py-4 text-sm font-black transition-colors', tab === item ? 'rounded-t-xl bg-[#F56618] text-white' : 'text-gray-600 hover:text-[#F56618]')}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <section className="rounded-[32px] border border-gray-100 bg-white p-8">
          <h2 className="mb-7 text-2xl font-black">{tab}</h2>
          {tab === 'Profile Details' && (
            <div>
              <div className="mb-5 flex items-center gap-5">
                <AvatarPreview />
                <div className="flex-1">
                  <label className="mb-2 block text-lg font-black">Profile Photo</label>
                  <input type="file" className="w-full rounded-xl border border-dashed border-[#F56618] p-3 text-gray-500" />
                  <p className="mt-2 text-sm text-gray-500">JPG / PNG - Max 2MB</p>
                </div>
              </div>
              <div className="space-y-3">
                <input className="dashboard-input" placeholder="Full Name" />
                <input className="dashboard-input" placeholder="Email" />
                <input className="dashboard-input" placeholder="Mobile" />
                <input className="dashboard-input" placeholder="Location" />
                <select className="dashboard-input text-gray-500"><option>Fresher</option><option>Experienced</option></select>
                <textarea className="dashboard-input min-h-28 resize-y" placeholder="Professional Summary" />
              </div>
            </div>
          )}

          {tab === 'Resume / CV' && (
            <div className="space-y-4">
              <input type="file" className="dashboard-input" />
              <textarea className="dashboard-input min-h-28 resize-y" placeholder="Key skills" />
              <input className="dashboard-input" placeholder="Current role or fresher" />
              <input className="dashboard-input" placeholder="Portfolio URL" />
            </div>
          )}

          {tab === 'Preferences' && (
            <div className="grid gap-4 md:grid-cols-2">
              <select className="dashboard-input text-gray-500"><option>Remote</option><option>Hybrid</option><option>On-site</option></select>
              <select className="dashboard-input text-gray-500"><option>Full-time</option><option>Part-time</option><option>Contract</option></select>
              <input className="dashboard-input" placeholder="Preferred city" />
              <input className="dashboard-input" placeholder="Expected salary" />
            </div>
          )}

          {tab === 'Social Profiles' && (
            <div className="space-y-4">
              <input className="dashboard-input" placeholder="LinkedIn URL" />
              <input className="dashboard-input" placeholder="GitHub URL" />
              <input className="dashboard-input" placeholder="Portfolio / Website URL" />
            </div>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => setSaved(true)} className="rounded-xl bg-[#F56618] px-6 py-3 font-black text-white">
              {tab === 'Profile Details' ? 'Edit Profile' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => onNavigate('Jobs')} className="rounded-xl border border-gray-200 px-6 py-3 font-black text-gray-700">
              Find Jobs
            </button>
            {saved && <span className="text-sm font-bold text-[#F56618]">Saved successfully</span>}
          </div>
        </section>

        <section className="h-fit rounded-[32px] border border-gray-100 bg-white p-8">
          <h2 className="mb-5 text-2xl font-black">Preview</h2>
          <AvatarPreview />
          <h3 className="mt-7 text-xl font-black">Your Name</h3>
          <p className="mt-3 text-gray-700">Location</p>
        </section>
      </div>
    </div>
  );
};

const AvatarPreview = () => (
  <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-orange-50 text-[#3B1976]">
    <User size={46} fill="currentColor" />
  </div>
);

const CandidateJobsPage = ({ onNavigate }: { onNavigate: NavigateHandler }) => (
  <CandidateListPage
    title="Jobs"
    description="Search verified jobs matched to your profile. New roles will appear after employers post them."
    columns={["Title", "Company", "Location", "Type", "Action"]}
    empty="No jobs available yet."
    primaryLabel="Refresh Jobs"
    onPrimary={() => onNavigate('Jobs')}
    secondaryLabel="Saved Jobs"
    onSecondary={() => onNavigate('Saved Jobs')}
  />
);

const CandidateApplicationsPage = ({ onNavigate }: { onNavigate: NavigateHandler }) => {
  const [tab, setTab] = useState('All');
  return (
    <CandidateListPage
      title="Applications"
      description="Track submitted applications, interview requests, and recruiter responses."
      tabs={['All', 'Shortlisted', 'Interviews', 'Pending']}
      activeTab={tab}
      onTabChange={setTab}
      columns={["Job", "Company", "Status", "Action"]}
      empty={`No ${tab === 'All' ? '' : tab.toLowerCase()} applications found.`}
      primaryLabel="Find Jobs"
      onPrimary={() => onNavigate('Jobs')}
    />
  );
};

const CandidateSavedJobsPage = ({ onNavigate }: { onNavigate: NavigateHandler }) => (
  <CandidateListPage
    title="Saved Jobs"
    description="Jobs you save will stay here until you apply or remove them."
    columns={["Title", "Company", "Location", "Saved On", "Action"]}
    empty="No saved jobs yet."
    primaryLabel="Browse Jobs"
    onPrimary={() => onNavigate('Jobs')}
  />
);

const CandidateDiscoverPage = ({ onNavigate }: { onNavigate: NavigateHandler }) => (
  <CandidateListPage
    title="Discover"
    description="Recommended companies, career paths, and job collections will appear here."
    columns={["Recommendation", "Category", "Match", "Action"]}
    empty="No recommendations yet. Complete your profile to improve discovery."
    primaryLabel="Complete Profile"
    onPrimary={() => onNavigate('Profile')}
  />
);

const CandidateGigsPage = ({ onNavigate }: { onNavigate: NavigateHandler }) => (
  <CandidateListPage
    title="On-Demand Gigs"
    description="Flexible gigs and short projects will appear here when available."
    columns={["Gig", "Skill", "Budget", "Action"]}
    empty="No on-demand gigs available yet."
    primaryLabel="Explore Jobs"
    onPrimary={() => onNavigate('Jobs')}
  />
);

const CandidateMessagesPage = ({ onNavigate }: { onNavigate: NavigateHandler }) => (
  <CandidateListPage
    title="Messages"
    description="Recruiter and employer conversations will appear in your inbox."
    columns={["Sender", "Subject", "Date", "Action"]}
    empty="No messages yet."
    primaryLabel="View Applications"
    onPrimary={() => onNavigate('Applications')}
  />
);

const CandidateInterviewsPage = ({ onNavigate }: { onNavigate: NavigateHandler }) => {
  const [tab, setTab] = useState('Upcoming');
  return (
    <CandidateListPage
      title="Interviews"
      description="Interview schedules and meeting links will appear here."
      tabs={['Upcoming', 'Completed', 'Cancelled']}
      activeTab={tab}
      onTabChange={setTab}
      columns={["Company", "Role", "Date & Time", "Action"]}
      empty={`No ${tab.toLowerCase()} interviews found.`}
      primaryLabel="Find Jobs"
      onPrimary={() => onNavigate('Jobs')}
    />
  );
};

const CandidateListPage = ({
  title,
  description,
  tabs,
  activeTab,
  onTabChange,
  columns,
  empty,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
}: {
  title: string;
  description: string;
  tabs?: string[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  columns: string[];
  empty: string;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}) => (
  <section className="rounded-[32px] border border-gray-100 bg-white p-8">
    <div className="mb-7 flex flex-wrap items-start justify-between gap-5">
      <div>
        <h2 className="text-2xl font-black">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">{description}</p>
      </div>
      <div className="flex gap-3">
        {secondaryLabel && onSecondary && <button type="button" onClick={onSecondary} className="rounded-xl border border-gray-200 px-5 py-3 font-black text-gray-700">{secondaryLabel}</button>}
        <button type="button" onClick={onPrimary} className="rounded-xl bg-[#F56618] px-5 py-3 font-black text-white">{primaryLabel}</button>
      </div>
    </div>
    {tabs && activeTab && onTabChange && (
      <div className="mb-6 flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <button key={tab} type="button" onClick={() => onTabChange(tab)} className={cn('rounded-xl px-7 py-3 font-black', activeTab === tab ? 'bg-[#F56618] text-white' : 'bg-orange-50 text-[#F56618]')}>
            {tab}
          </button>
        ))}
      </div>
    )}
    <DataTable columns={columns} empty={empty} />
  </section>
);

const WorkYaarProPage = () => {
  const [plan, setPlan] = useState('');

  return (
    <section className="rounded-[32px] border border-[#FFD84A] bg-gradient-to-br from-[#FFF9D7] via-white to-[#FFF1A8] p-8 shadow-2xl shadow-yellow-200/60">
      <div className="mb-6 flex items-center gap-4">
        <Crown className="text-[#F6C400] drop-shadow-sm" size={30} fill="currentColor" />
        <h2 className="text-3xl font-black">WorkYaar Pro</h2>
      </div>
      <p className="mb-8 max-w-2xl text-gray-500">Unlock premium features to get hired faster - priority applications, profile boosts, and more.</p>
      <div className="grid gap-7 lg:grid-cols-2">
        <ProPlanCard
          title="Weekly Subscription"
          price="₹49"
          period="/week"
          features={["Priority job applications", "Profile boost for 7 days", "See who viewed your profile"]}
          button="Subscribe Weekly"
          onClick={() => setPlan('Weekly subscription selected')}
        />
        <ProPlanCard
          title="Monthly Subscription"
          price="₹199"
          period="/month"
          features={["Everything in Weekly", "Profile boost for 30 days", "Unlimited applications", "Featured to top recruiters"]}
          button="Subscribe Monthly"
          highlight
          onClick={() => setPlan('Monthly subscription selected')}
        />
      </div>
      {plan && <p className="mt-6 font-black text-[#F56618]">{plan}</p>}
    </section>
  );
};

const ProPlanCard = ({ title, price, period, features, button, highlight = false, onClick }: any) => (
  <div className={cn('relative rounded-3xl border bg-white p-8 shadow-xl shadow-yellow-200/50', highlight ? 'border-[#FFD84A] bg-[#FFF8CC]' : 'border-[#FFE68A]')}>
    {highlight && <span className="absolute right-6 top-0 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#F6C400] to-[#FFB000] px-4 py-1 text-xs font-black text-white shadow-lg shadow-yellow-300/50">Best Value</span>}
    <p className="mb-5 text-sm font-black uppercase tracking-[0.18em] text-[#C98200]">{title}</p>
    <div className="mb-8 flex items-end gap-1">
      <span className="text-5xl font-black text-[#9A6A00]">{price}</span>
      <span className="font-bold text-gray-500">{period}</span>
    </div>
    <div className="mb-10 space-y-4">
      {features.map((feature: string) => (
        <div key={feature} className="flex items-center gap-3 text-gray-600">
          <CheckCircle2 size={18} className="text-[#F6C400]" />
          <span>{feature}</span>
        </div>
      ))}
    </div>
    <button type="button" onClick={onClick} className={cn('w-full rounded-xl px-6 py-4 font-black text-white shadow-lg transition-transform hover:-translate-y-0.5', highlight ? 'bg-gradient-to-r from-[#FFB000] to-[#FFD84A] shadow-yellow-300/50' : 'bg-[#F56618] shadow-orange-200')}>
      {button}
    </button>
  </div>
);

const CompanyProfilePage = ({ onNavigate }: { onNavigate: NavigateHandler }) => (
  <section className="rounded-[32px] border border-gray-100 bg-white p-8">
    <div className="mb-12 flex items-center justify-between">
      <h2 className="text-2xl font-black">Company Profile</h2>
      <button type="button" onClick={() => onNavigate('Company Profile')} className="flex items-center gap-2 rounded-xl bg-[#F56618] px-6 py-3 font-black text-white">
        <Pencil size={18} /> Edit Profile
      </button>
    </div>

    <div className="grid gap-7 lg:grid-cols-2">
      <SelectField label="Employer Type" placeholder="Company" />
      <SelectField label="Industry Type" placeholder="Select Type" />
      <SelectField label="Industry Category" placeholder="Select Industry" />
      <SelectField label="Company Size" placeholder="1-10 Employees" />
    </div>

    <div className="my-5 inline-flex items-center gap-2 rounded-lg bg-orange-50 px-4 py-2 text-sm font-black text-[#F56618]">
      <CheckCircle2 size={16} /> Verified Company
    </div>

    <SectionTitle>Basic Information</SectionTitle>
    <div className="grid gap-7 lg:grid-cols-2">
      <TextField label="Company Name" placeholder="Company Name" />
      <TextField label="Founded Year" placeholder="Founded Year" />
    </div>

    <SectionTitle>Company Details</SectionTitle>
    <div className="grid gap-7 lg:grid-cols-4">
      <SelectField label="Hiring Status" placeholder="Active Hiring" />
      <SelectField label="PWD Hiring" placeholder="Select" />
      <SelectField label="NGO Organization" placeholder="Select" />
      <TextField label="GST Number" placeholder="GST Number" />
    </div>

    <div className="mt-8 grid gap-7 lg:grid-cols-[1fr_3fr]">
      <div>
        <label className="mb-3 block font-bold">Company Logo</label>
        <input type="file" className="w-full rounded-xl border border-gray-200 p-3 text-gray-500" />
      </div>
      <p className="self-end text-sm leading-6 text-gray-400">PNG / JPG preferred<br />Maximum file size: 2MB</p>
    </div>

    <SectionTitle>Office Address</SectionTitle>
    <TextAreaField label="Office Address" placeholder="Office Address" />
    <div className="mt-7 grid gap-7 lg:grid-cols-2">
      <SelectField label="Country" placeholder="India" />
      <SelectField label="State" placeholder="Andhra Pradesh" />
    </div>
    <div className="mt-7">
      <SelectField label="City" placeholder="Hyderabad" />
    </div>

    <SectionTitle>Contact Details</SectionTitle>
    <div className="grid gap-7 lg:grid-cols-2">
      <TextField label="Phone Number" placeholder="Phone Number" />
      <TextField label="Email Address" placeholder="Email Address" />
    </div>

    <SectionTitle>Social Profiles</SectionTitle>
    <div className="grid gap-7 lg:grid-cols-2">
      <TextField label="Website" placeholder="Website URL" />
      <TextField label="LinkedIn" placeholder="LinkedIn URL" />
    </div>

    <button type="button" onClick={() => onNavigate('Dashboard')} className="mt-10 rounded-xl bg-[#F56618] px-7 py-3 font-black text-white">
      Save Company Profile
    </button>
  </section>
);

const PostJobPage = ({ onNavigate }: { onNavigate: NavigateHandler }) => (
  <section className="rounded-[32px] border border-gray-100 bg-white p-8">
    <h2 className="mb-7 text-2xl font-black">Post New Job</h2>
    <div className="space-y-5">
      <input className="dashboard-input" placeholder="Job Title" />
      <input className="dashboard-input" placeholder="Location" />
      <div className="grid gap-5 lg:grid-cols-2">
        <select className="dashboard-input"><option>Software Development</option><option>Design</option><option>Marketing</option></select>
        <select className="dashboard-input"><option>Full-time</option><option>Part-time</option><option>Contract</option></select>
      </div>
      <input className="dashboard-input" placeholder="Experience Required" />
      <div className="grid gap-5 lg:grid-cols-2">
        <input className="dashboard-input" placeholder="Min Salary" />
        <input className="dashboard-input" placeholder="Max Salary" />
      </div>
      <textarea className="dashboard-input min-h-40 resize-y" placeholder="Job Description" />
    </div>
    <button type="button" onClick={() => onNavigate('Manage Jobs')} className="mt-7 rounded-xl bg-[#F56618] px-8 py-4 font-black text-white">
      Post Job
    </button>
  </section>
);

const ManageJobsPage = ({ onNavigate }: { onNavigate: NavigateHandler }) => (
  <section className="rounded-[32px] border border-gray-100 bg-white p-8">
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-2xl font-black">Manage Jobs</h2>
      <button type="button" onClick={() => onNavigate('Post Job')} className="rounded-xl bg-[#F56618] px-5 py-3 font-black text-white">Post Job</button>
    </div>
    <DataTable
      columns={["Title", "Category", "Location", "Salary", "Action"]}
      empty="No jobs posted yet. Use 'Post Job' to add one."
    />
  </section>
);

const EmployerApplicationsPage = ({ onNavigate }: { onNavigate: NavigateHandler }) => {
  const [tab, setTab] = useState('All');
  const tabs = ['All', 'Shortlisted', 'Interviews', 'Pending'];

  return (
    <section className="rounded-[32px] border border-gray-100 bg-white p-8">
      <h2 className="mb-9 text-2xl font-black">Applications</h2>
      <div className="mb-6 flex flex-wrap gap-3">
        {tabs.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={cn('rounded-xl px-9 py-4 font-black transition-colors', tab === item ? 'bg-[#F56618] text-white' : 'bg-orange-50 text-[#F56618]')}
          >
            {item}
          </button>
        ))}
      </div>
      <DataTable columns={["Name", "Job", "Status"]} empty={`No ${tab === 'All' ? '' : tab.toLowerCase()} applications found.`} />
      <button type="button" onClick={() => onNavigate('Interviews')} className="mt-7 rounded-xl bg-[#F56618] px-6 py-3 font-black text-white">
        Open Interviews
      </button>
    </section>
  );
};

const EmployerInterviewsPage = ({ onNavigate }: { onNavigate: NavigateHandler }) => {
  const [filter, setFilter] = useState('Upcoming');
  const filters = ['Upcoming', 'Completed', 'Cancelled'];

  return (
    <section className="rounded-[32px] border border-gray-100 bg-white p-8">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-black">Interviews</h2>
        <button type="button" onClick={() => onNavigate('Applications')} className="rounded-xl bg-[#F56618] px-6 py-3 font-black text-white">
          Schedule Interview
        </button>
      </div>
      <div className="mb-6 flex flex-wrap gap-3">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={cn('rounded-xl px-7 py-3 font-black transition-colors', filter === item ? 'bg-[#F56618] text-white' : 'bg-orange-50 text-[#F56618]')}
          >
            {item}
          </button>
        ))}
      </div>
      <DataTable columns={["Candidate", "Job", "Date & Time", "Status", "Action"]} empty={`No ${filter.toLowerCase()} interviews found.`} />
    </section>
  );
};

const SectionTitle = ({ children }: { children: ReactNode }) => <h3 className="mb-7 mt-9 text-xl font-black text-[#F56618]">{children}</h3>;

const TextField = ({ label, placeholder }: { label: string; placeholder: string }) => (
  <label className="block">
    <span className="mb-3 block font-bold">{label}</span>
    <input className="dashboard-input" placeholder={placeholder} />
  </label>
);

const SelectField = ({ label, placeholder }: { label: string; placeholder: string }) => (
  <label className="block">
    <span className="mb-3 block font-bold">{label}</span>
    <select className="dashboard-input text-gray-500">
      <option>{placeholder}</option>
    </select>
  </label>
);

const TextAreaField = ({ label, placeholder }: { label: string; placeholder: string }) => (
  <label className="block">
    <span className="mb-3 block font-bold">{label}</span>
    <textarea className="dashboard-input min-h-36 resize-y" placeholder={placeholder} />
  </label>
);

const DataTable = ({ columns, empty }: { columns: string[]; empty: string }) => (
  <div className="overflow-x-auto rounded-none">
    <div className="min-w-[720px]">
      <div className="grid bg-[#F56618] text-white" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
        {columns.map((column) => (
          <div key={column} className="px-5 py-5 font-black">{column}</div>
        ))}
      </div>
      <div className="border-b border-gray-100 py-9 text-center text-lg text-gray-400">{empty}</div>
    </div>
  </div>
);

const LegendItem = ({ color, label }: any) => (
  <div className="flex items-center gap-2">
    <div className={cn('h-2 w-2 rounded-full', color)} />
    <span className="text-[10px] font-bold text-gray-400">{label}</span>
  </div>
);