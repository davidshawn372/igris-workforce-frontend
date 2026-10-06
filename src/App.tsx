import { Billing, PlanProvider, ProGate } from "./billing";
import { Landing } from "./Landing";
import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  NavLink,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  Users,
  GitBranch,
  Library,
  ChartNoAxesCombined,
  Settings,
  Search,
  Bell,
  ChevronsUpDown,
  ChevronRight,
  ArrowUpRight,
  GraduationCap,
  PanelLeftClose,
  Menu,
  Sun,
  Moon,
  X,
  CircleCheck,
  BookOpen,
  MessageCircle,
  UserRound,
} from "lucide-react";
import { StoreProvider, useStore, progress } from "./store";
import { Brand, Avatar, Modal, SearchField, Empty } from "./ui";
import { Overview, People, Insights, SettingsPage } from "./company";
import { Flows, FlowBuilder, Knowledge } from "./onboarding";
import { Hiring, JobEditor, CandidateDetail } from "./hiring";
import {
  LearnerHome,
  Journey,
  Lesson,
  Assistant,
  Resources,
  Profile,
} from "./learner";
const navigation = [
  { icon: LayoutDashboard, label: "Overview", path: "/workspace" },
  { icon: BriefcaseBusiness, label: "Hiring", path: "/hiring" },
  { icon: Users, label: "People", path: "/people" },
  { icon: GitBranch, label: "Onboarding", path: "/onboarding" },
  { icon: Library, label: "Knowledge", path: "/knowledge" },
  { icon: ChartNoAxesCombined, label: "Insights", path: "/insights" },
  { icon: CircleCheck, label: "Plans", path: "/billing" },
];
function Shell() {
  const { data, toast } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [light, setLight] = useState(() => {
    try { return localStorage.getItem("igris-theme") === "light"; } catch { return false; }
  });
  function toggleTheme() {
    const next = !light;
    setLight(next);
    try { localStorage.setItem("igris-theme", next ? "light" : "dark"); } catch { /* Theme still works when browser storage is unavailable. */ }
  }
  const themeToggle = <button className="icon-btn theme-toggle" onClick={toggleTheme} aria-label={light ? "Switch to dark mode" : "Switch to light mode"} title={light ? "Dark mode" : "Light mode"}>{light ? <Moon size={18} /> : <Sun size={18} />}</button>;
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [notifications, setNotifications] = useState(false);
  const [read, setRead] = useState(false);
  const learner = location.pathname.startsWith("/learn");
  const current = navigation.find((x) =>
    x.path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(x.path),
  );
  const label = location.pathname === "/" ? "Welcome" : learner
    ? "Employee portal"
    : current?.label || "Workspace settings";
  useEffect(() => {
    setMobile(false);
    window.scrollTo(0, 0);
    document.title = label + " · IGRIS Workforce";
  }, [location.pathname, label]);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearch((s) => !s);
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);
  const searchItems = [
    ...navigation.map((x) => ({
      title: x.label,
      detail: "Workspace page",
      path: x.path,
    })),
    ...data.employees.map((x) => ({
      title: x.name,
      detail: x.role,
      path: "/people?person=" + x.id,
    })),
    ...data.flows.map((x) => ({
      title: x.title,
      detail: "Onboarding journey",
      path: "/onboarding/" + x.id,
    })),
    {
      title: "Employee learning portal",
      detail: "Experience onboarding as Maya",
      path: "/learn",
    },
  ].filter((x) =>
    (x.title + " " + x.detail).toLowerCase().includes(query.toLowerCase()),
  );
  const active = data.employees.filter(
    (e) =>
      progress(
        e,
        data.flows.find((f) => f.id === e.flowId),
      ).percent < 100,
  ).length;
  if (location.pathname === "/") return <Landing />;
  return (
    <div className={(learner ? "learner-app" : "app-shell") + (light ? " theme-light" : "")}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      {learner ? (
        <header className="learner-top">
          <Brand />
          <div className="company-name">
            <span className="company-icon">{data.company.slice(0, 1)}</span>
            {data.company}
          </div>
          <nav className="learner-nav">
            {[
              [LayoutDashboard, "Home", "/learn"],
              [BookOpen, "My journey", "/learn/journey"],
              [MessageCircle, "Ask IGRIS", "/learn/assistant"],
              [Library, "Resources", "/learn/resources"],
            ].map(([Icon, text, url]) => {
              const C = Icon as typeof Users;
              return (
                <NavLink key={String(url)} to={String(url)} end>
                  <C size={16} />
                  {String(text)}
                </NavLink>
              );
            })}
          </nav>
          <Link className="back-to-site" to="/">← <span>Back to website</span></Link>{themeToggle}
          <Link to="/learn/profile" className="learner-user">
            <Avatar name="Maya Lin" />
            <span>
              Maya Lin<small>Engineering</small>
            </span>
          </Link>
          <Link className="workspace-return" to="/workspace">
            Company view
            <ArrowUpRight size={14} />
          </Link>
        </header>
      ) : (
        <>
          <div
            className={"mobile-shade " + (mobile ? "visible" : "")}
            onClick={() => setMobile(false)}
          />
          <aside className={"sidebar " + (mobile ? "open" : "")}>
            <Brand />
            <button className="workspace" onClick={() => navigate("/settings")}>
              <span className="company-icon">{data.company.slice(0, 1)}</span>
              <span>
                {data.company}
                <small>Company workspace</small>
              </span>
              <ChevronsUpDown size={15} />
            </button>
            <div className="nav-label">WORKSPACE</div>
            <nav>
              {navigation.map(({ icon: Icon, label, path }) => (
                <NavLink key={path} end={path === "/"} to={path} aria-label={label} title={label}>
                  <Icon size={19} />
                  <span className="nav-text">{label}</span>
                  {label === "Onboarding" && (
                    <span className="nav-count">{active}</span>
                  )}
                </NavLink>
              ))}
            </nav>
            <div className="sidebar-bottom">
              <div className="portal-promo">
                <GraduationCap size={22} />
                <b>A welcome worth remembering.</b>
                <p>See onboarding through your new hire’s eyes.</p>
                <Link to="/learn">
                  Open employee portal
                  <ArrowUpRight size={15} />
                </Link>
              </div>
              <NavLink className="sidebar-link" to="/settings">
                <Settings size={18} />
                Workspace settings
              </NavLink>
              <Link className="user-row" to="/settings">
                <Avatar name="Elena Rostova" color="peach" />
                <div>
                  <b>Elena Rostova</b>
                  <small>People & Culture</small>
                </div>
                <ChevronsUpDown size={15} />
              </Link>
            </div>
          </aside>
        </>
      )}
      <div className={learner ? "learner-main" : "main-shell"}>
        {!learner && (
          <header className="topbar">
            <div className="crumb">
              <button
                className="icon-btn menu-toggle"
                onClick={() => setMobile(!mobile)}
                aria-label="Open navigation"
              >
                <Menu size={20} />
              </button>
              <PanelLeftClose className="desktop-icon" size={18} />
              <span>Workspace</span>
              <ChevronRight size={13} />
              <b>{label}</b>
            </div>
            <div className="top-actions">
              <Link className="back-to-site" to="/">← <span>Back to website</span></Link>{themeToggle}
              <span className="demo-label">DEMO WORKSPACE</span>
              <button
                className="icon-btn"
                aria-label="Search workspace"
                onClick={() => setSearch(true)}
              >
                <Search size={19} />
              </button>
              <button
                className="icon-btn notification"
                aria-label="Notifications"
                onClick={() => setNotifications(!notifications)}
              >
                <Bell size={19} />
                {!read && <i />}
              </button>
              <Avatar name="Elena Rostova" color="peach" small />
            </div>
            {notifications && (
              <div className="notification-menu">
                <div className="panel-header">
                  <h2>Updates</h2>
                  <button
                    className="text-button"
                    onClick={() => {
                      setRead(true);
                      setNotifications(false);
                    }}
                  >
                    Mark as read
                  </button>
                </div>
                {data.activity.slice(0, 4).map((a) => (
                  <Link
                    key={a.id}
                    to="/people"
                    onClick={() => setNotifications(false)}
                  >
                    <b>{a.text}</b>
                    <small>
                      {a.detail} · {a.time}
                    </small>
                  </Link>
                ))}
              </div>
            )}
          </header>
        )}
        <main key={location.pathname} id="main-content" className={learner ? "learner-page" : "page"}>
          <Routes>
            <Route path="/workspace" element={<Overview />} />
            <Route path="/people" element={<People />} />
            <Route path="/hiring" element={<Hiring />} />
            <Route path="/hiring/new" element={<JobEditor />} />
            <Route path="/hiring/candidate/:id" element={<CandidateDetail />} />
            <Route path="/onboarding" element={<Flows />} />
            <Route path="/onboarding/:id" element={<FlowBuilder />} />
            <Route path="/knowledge" element={<Knowledge />} />
            <Route path="/insights" element={<ProGate><Insights /></ProGate>} />
<Route path="/billing" element={<Billing />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/learn" element={<LearnerHome />} />
            <Route path="/learn/journey" element={<Journey />} />
            <Route path="/learn/lesson/:id" element={<Lesson />} />
            <Route path="/learn/assistant" element={<Assistant />} />
            <Route path="/learn/resources" element={<Resources />} />
            <Route path="/learn/profile" element={<Profile />} />
            <Route
              path="*"
              element={
                <Empty
                  title="This page isn’t here"
                  description="Let’s get you back to your workspace."
                >
                  <Link className="btn primary" to="/">
                    Open workspace
                  </Link>
                </Empty>
              }
            />
          </Routes>
        </main>
        <footer className="app-footer">
          <span>IGRIS Workforce</span>
          <span>Demo · Changes stay in this browser</span>
          <span>Good beginnings. Better teams.</span>
        </footer>
      </div>
      <Modal
        title="Find your way"
        open={search}
        onClose={() => setSearch(false)}
      >
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Search people, journeys, and pages"
        />
        <div className="search-results">
          {searchItems.slice(0, 9).map((x) => (
            <Link key={x.title} to={x.path} onClick={() => setSearch(false)}>
              <span>
                <b>{x.title}</b>
                <small>{x.detail}</small>
              </span>
              <ChevronRight size={17} />
            </Link>
          ))}
          {!searchItems.length && (
            <Empty
              title="No matches"
              description="Try a name, team, or page."
            />
          )}
        </div>
      </Modal>
      {toast && (
        <div className="toast" role="status">
          <CircleCheck size={18} />
          {toast}
        </div>
      )}
    </div>
  );
}
export default function App() {
  return (
    <StoreProvider key="igris-branded-workspace">
      <PlanProvider><Shell /></PlanProvider>
    </StoreProvider>
  );
}


