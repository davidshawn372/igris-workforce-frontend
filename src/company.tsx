import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Plus,
  ArrowUpRight,
  CalendarDays,
  CircleCheck,
  Clock3,
  ChevronRight,
  Layers3,
  BookOpen,
  Users,
  Download,
  Mail,
  Check,
  RotateCcw,
} from "lucide-react";
import { useStore, progress, initials, downloadText } from "./store";
import {
  Avatar,
  Badge,
  Progress,
  PageHeading,
  Modal,
  SearchField,
  Empty,
} from "./ui";
import { departments } from "./data";
import type { Department, Employee } from "./types";
export function InviteForm({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { data, setData, notify } = useStore();
  return (
    <Modal title="A new beginning" open={open} onClose={onClose}>
      <p className="form-intro">
        Add a teammate and give them a thoughtful first step.
      </p>
      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          const d = new FormData(e.currentTarget);
          const name = String(d.get("name")).trim();
          const email = String(d.get("email")).trim();
          if (
            data.employees.some(
              (x) => x.email.toLowerCase() === email.toLowerCase(),
            )
          ) {
            notify("That email is already in your demo workspace.");
            return;
          }
          const employee: Employee = {
            id: crypto.randomUUID(),
            name,
            email,
            role: String(d.get("role")),
            department: d.get("department") as Department,
            flowId: String(d.get("flow")),
            start: String(d.get("start")),
            buddy: "Alex Wu",
            completed: [],
            needsHelp: false,
            color: "lavender",
          };
          setData((s) => ({
            ...s,
            employees: [...s.employees, employee],
            activity: [
              {
                id: crypto.randomUUID(),
                text: name + " was added to onboarding",
                detail: "Invitation prepared in demo",
                time: "Just now",
                initials: initials(name),
                color: "lavender",
              },
              ...s.activity,
            ],
          }));
          notify(
            name +
              " added. Invitation prepared; no email is sent in this demo.",
          );
          onClose();
        }}
      >
        <label>
          Full name
          <input
            name="name"
            required
            maxLength={80}
            placeholder="e.g. Jordan Ellis"
          />
        </label>
        <label>
          Work email
          <input
            name="email"
            type="email"
            required
            placeholder="jordan@company.com"
          />
        </label>
        <div className="form-row">
          <label>
            Role
            <input name="role" required placeholder="Software Engineer" />
          </label>
          <label>
            Department
            <select name="department">
              {departments.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
        </div>
        <label>
          Onboarding journey
          <select name="flow">
            {data.flows
              .filter((f) => f.published)
              .map((f) => (
                <option key={f.id} value={f.id}>
                  {f.title}
                </option>
              ))}
          </select>
        </label>
        <label>
          Start date
          <input name="start" type="date" defaultValue="2026-10-05" required />
        </label>
        <div className="info-note">
          <Mail size={17} />
          Frontend preview: creates a demo employee and invitation summary.
        </div>
        <div className="modal-actions">
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn primary">Add teammate</button>
        </div>
      </form>
    </Modal>
  );
}
function PeopleTable({ people }: { people: Employee[] }) {
  const { data } = useStore();
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>TEAM MEMBER</th>
            <th>LEARNING PATH</th>
            <th>PROGRESS</th>
            <th>STATUS</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {people.map((p) => {
            const f = data.flows.find((f) => f.id === p.flowId),
              v = progress(p, f);
            return (
              <tr key={p.id}>
                <td>
                  <Link className="person" to={"/people?person=" + p.id}>
                    <Avatar name={p.name} color={p.color} />
                    <div>
                      <b>{p.name}</b>
                      <small>{p.department}</small>
                    </div>
                  </Link>
                </td>
                <td>
                  {f?.title || "Not assigned"}
                  <small>{p.role}</small>
                </td>
                <td>
                  <div className="progress-caption">
                    <span>{v.percent}%</span>
                    <span>
                      {v.count}/{v.total}
                    </span>
                  </div>
                  <Progress value={v.percent} />
                </td>
                <td>
                  <Badge
                    tone={
                      p.needsHelp
                        ? "amber"
                        : v.percent === 100
                          ? "green"
                          : "neutral"
                    }
                  >
                    {p.needsHelp
                      ? "Needs help"
                      : v.percent === 100
                        ? "Completed"
                        : "In progress"}
                  </Badge>
                </td>
                <td>
                  <Link
                    aria-label={"View " + p.name}
                    to={"/people?person=" + p.id}
                    className="icon-btn"
                  >
                    <ChevronRight size={16} />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {!people.length && (
        <Empty
          title="No teammates found"
          description="Try another name or department."
        />
      )}
    </div>
  );
}
export function Overview() {
  const { data } = useStore();
  const [tab, setTab] = useState("All teams");
  const [invite, setInvite] = useState(false);
  const values = data.employees.map(
    (p) =>
      progress(
        p,
        data.flows.find((f) => f.id === p.flowId),
      ).percent,
  );
  const active = values.filter((v) => v < 100).length;
  const rate =
    Math.round(values.reduce((a, b) => a + b, 0) / values.length) || 0;
  return (
    <>
      <PageHeading
        eyebrow="01 / WORKFORCE" title="Overview"
        description="Your onboarding operation, at a glance."
      >
        <button className="btn primary" onClick={() => setInvite(true)}>
          <Plus size={17} />
          Invite new hire
        </button>
      </PageHeading>
      <section className="onboarding-brief" aria-label="Onboarding summary">
        <div className="brief-main">
          <div className="brief-icon">
            <Users size={22} />
          </div>
          <div>
            <h2>Your team’s next steps</h2>
            <p>
              {active} teammates are getting started. Keep their first weeks
              moving.
            </p>
          </div>
          <Link className="btn" to="/onboarding">
            Manage journeys <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="brief-actions">
          <Link to="/people">
            <span className="brief-dot attention" />
            <span>
              <b>
                {data.employees.filter((p) => p.needsHelp).length} people need
                support
              </b>
              <small>Review who needs a hand</small>
            </span>
            <ChevronRight size={16} />
          </Link>
          <Link to="/onboarding">
            <span className="brief-dot" />
            <span>
              <b>
                {data.flows.filter((f) => f.published).length} published
                journeys
              </b>
              <small>Keep learning paths up to date</small>
            </span>
            <ChevronRight size={16} />
          </Link>
          <Link to="/learn">
            <span className="brief-dot" />
            <span>
              <b>Employee experience</b>
              <small>Walk through Maya’s onboarding</small>
            </span>
            <ChevronRight size={16} />
          </Link>
        </div>
      </section>
      <div className="summary-strip">
        <span>
          <i className="status-dot" />
          Your team is making progress
        </span>
        <span>
          <CalendarDays size={15} />
          October 2026 · Sample workspace
        </span>
      </div>
      <div className="stats-grid">
        {[
          [
            String(active),
            "People onboarding",
            values.filter((v) => v === 100).length + " journeys completed",
            "purple",
          ],
          [
            rate + "%",
            "Average completion",
            "Across all assigned journeys",
            "green",
          ],
          [
            String(data.employees.filter((x) => x.needsHelp).length),
            "Need a little help",
            "A conversation can make a difference",
            "amber",
          ],
          [
            String(data.jobs.filter((j) => j.status === "Published").length),
            "Open roles",
            "Find your next great teammate",
            "",
          ],
        ].map(([v, l, n, c]) => (
          <div className={"stat metric-" + c} key={l}>
            <span>
              {l}
              <ArrowUpRight size={15} />
            </span>
            <div className="metric-value"><strong>{v}</strong>{l === "Average completion" && <svg className="metric-ring" viewBox="0 0 44 44" aria-label={rate + "% average completion"} role="img"><circle cx="22" cy="22" r="18" /><circle cx="22" cy="22" r="18" pathLength="100" strokeDasharray={`${rate} 100`} /></svg>}{l === "Need a little help" && <Badge tone="amber">Needs attention</Badge>}</div>
            <small className={c}>{n}</small>
          </div>
        ))}
      </div>
      <div className="overview-grid">
        <div>
          <section className="panel">
            <div className="panel-header">
              <div>
                <h2>Onboarding in motion</h2>
                <p>A clear view of everyone’s first steps.</p>
              </div>
              <Link className="text-link" to="/people">
                View all people
              </Link>
            </div>
            <div className="tabs team-tabs" aria-label="Filter by team">
              {["All teams", "Engineering", "Product", "Sales"].map((x) => (
                <button
                  key={x}
                  className={tab === x ? "active" : ""}
                  aria-pressed={tab === x}
                  onClick={() => setTab(x)}
                >
                  {x}<span className="tab-count">{data.employees.filter((p) => x === "All teams" || p.department === x).length}</span>
                </button>
              ))}
            </div>
            <PeopleTable
              people={data.employees
                .filter((x) => tab === "All teams" || x.department === tab)
                .slice(0, 4)}
            />
            <div className="panel-footer">
              <span>
                <CircleCheck size={15} />
                Every small step counts.
              </span>
              <span>Live demo progress</span>
            </div>
          </section>
          <section className="panel paths-panel">
            <div className="panel-header">
              <div>
                <h2>Made for a great first day</h2>
                <p>Your team’s onboarding journeys.</p>
              </div>
              <Link to="/onboarding" className="text-link">
                All journeys
              </Link>
            </div>
            <div className="path-grid">
              {data.flows.slice(0, 3).map((f, i) => {
                const C = [Layers3, BookOpen, Users][i];
                return (
                  <Link
                    to={"/onboarding/" + f.id}
                    className="path-mini"
                    key={f.id}
                  >
                    <span
                      className={
                        "tile-icon " + ["lavender", "peach", "mint"][i]
                      }
                    >
                      <C size={22} />
                    </span>
                    <h3>{f.title}</h3>
                    <p>
                      {f.modules.length} modules · {f.days} days
                    </p>
                    <div>
                      <span className="stack-avatars">
                        {data.employees
                          .filter((e) => e.flowId === f.id)
                          .slice(0, 3)
                          .map((e) => (
                            <i key={e.id}>{initials(e.name)}</i>
                          ))}
                      </span>
                      <span>
                        View journey
                        <ChevronRight size={14} />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
        <aside className="right-rail">
          <section className="focus-card">
            <span className="eyebrow">A MOMENT THAT MATTERS</span>
            <h2>
              Great teams start
              <br />
              with a great welcome.
            </h2>
            <p>
              The first days stay with people. Give your new teammates a place
              to learn, ask, and feel at home.
            </p>
            <Link className="btn dark" to="/learn">
              Preview their welcome
              <ArrowUpRight size={16} />
            </Link>
            <div className="welcome-people">
              <Avatar name="Maya Lin" color="peach" />
              <Avatar name="Amina Diop" color="mint" />
              <Avatar name="Julian Vance" />
              <span>Ready for what’s next.</span>
            </div>
          </section>
          <section className="panel activity">
            <div className="panel-header">
              <h2>Team activity</h2>
              <Clock3 size={17} />
            </div>
            {data.activity.slice(0, 3).map((x) => (
              <div className="activity-item" key={x.id}>
                <span className={"avatar small " + x.color}>{x.initials}</span>
                <div>
                  <b>{x.text}</b>
                  <p>{x.detail}</p>
                  <small>{x.time}</small>
                </div>
              </div>
            ))}
            <Link to="/insights" className="activity-link">
              See the full picture
              <ChevronRight size={14} />
            </Link>
          </section>
        </aside>
      </div>
      <InviteForm open={invite} onClose={() => setInvite(false)} />
    </>
  );
}
export function People() {
  const { data, setData, notify } = useStore();
  const [query, setQuery] = useState("");
  const [team, setTeam] = useState("All teams");
  const [invite, setInvite] = useState(false);
  const [params, setParams] = useSearchParams();
  const selected = data.employees.find((e) => e.id === params.get("person"));
  return (
    <>
      <PageHeading
        eyebrow="PEOPLE & PROGRESS"
        title="Everyone starts somewhere."
        description="Keep the right support close, from day one onwards."
      >
        <button
          className="btn"
          onClick={() => {
            downloadText(
              "igris-people.csv",
              "Name,Department,Role,Progress\n" +
                data.employees
                  .map((e) =>
                    [
                      e.name,
                      e.department,
                      e.role,
                      progress(
                        e,
                        data.flows.find((f) => f.id === e.flowId),
                      ).percent + "%",
                    ]
                      .map((x) => {
                        const safe = /^[=+@\-\t\r\n]/.test(x) ? "'" + x : x;
                        return '"' + safe.replaceAll('"', '""') + '"';
                      })
                      .join(","),
                  )
                  .join("\n"),
              "text/csv",
            );
            notify("People report downloaded.");
          }}
        >
          <Download size={16} />
          Export
        </button>
        <button className="btn primary" onClick={() => setInvite(true)}>
          <Plus size={17} />
          Invite teammate
        </button>
      </PageHeading>
      <div className="toolbar">
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Search people or roles"
        />
        <select
          aria-label="Filter by department"
          value={team}
          onChange={(e) => setTeam(e.target.value)}
        >
          {["All teams", ...departments].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <span className="muted">{data.employees.length} teammates</span>
      </div>
      <section className="panel">
        <PeopleTable
          people={data.employees.filter(
            (e) =>
              (team === "All teams" || e.department === team) &&
              (e.name + " " + e.role)
                .toLowerCase()
                .includes(query.toLowerCase()),
          )}
        />
      </section>
      <div className="note-banner">
        <Users size={21} />
        <div>
          <b>Progress is a conversation.</b>
          <p>Use these milestones to offer support and celebrate learning.</p>
        </div>
      </div>
      <InviteForm open={invite} onClose={() => setInvite(false)} />
      <Modal
        title={selected?.name || "Teammate"}
        open={!!selected}
        onClose={() => setParams({})}
      >
        {selected && (
          <div className="form">
            <div className="profile-summary">
              <Avatar name={selected.name} color={selected.color} />
              <div>
                <h3>{selected.role}</h3>
                <p>{selected.email}</p>
              </div>
            </div>
            <label>
              Assigned journey
              <select
                value={selected.flowId}
                onChange={(e) => {
                  setData((s) => ({
                    ...s,
                    employees: s.employees.map((x) =>
                      x.id === selected.id
                        ? { ...x, flowId: e.target.value, completed: [] }
                        : x,
                    ),
                  }));
                  notify("Journey reassigned. Progress starts fresh.");
                }}
              >
                {data.flows
                  .filter((f) => f.published || f.id === selected.flowId)
                  .map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.title}
                    </option>
                  ))}
              </select>
            </label>
            <div className="details-grid">
              <div>
                <small>START DATE</small>
                <b>{selected.start}</b>
              </div>
              <div>
                <small>ONBOARDING BUDDY</small>
                <b>{selected.buddy}</b>
              </div>
            </div>
            <h3>Learning milestones</h3>
            {data.flows
              .find((f) => f.id === selected.flowId)
              ?.modules.map((m) => (
                <div className="milestone" key={m.id}>
                  <CircleCheck
                    size={18}
                    className={
                      selected.completed.includes(m.id) ? "green" : "muted"
                    }
                  />
                  <span>{m.title}</span>
                  <Badge
                    tone={
                      selected.completed.includes(m.id) ? "green" : "neutral"
                    }
                  >
                    {selected.completed.includes(m.id) ? "Done" : "Upcoming"}
                  </Badge>
                </div>
              ))}
            {selected.needsHelp && (
              <button
                className="btn primary"
                onClick={() => {
                  setData((s) => ({
                    ...s,
                    employees: s.employees.map((x) =>
                      x.id === selected.id ? { ...x, needsHelp: false } : x,
                    ),
                  }));
                  notify("Support request marked resolved.");
                }}
              >
                <Check size={17} />
                Mark support request resolved
              </button>
            )}
            {selected.id === "maya" && (
              <Link className="btn" to="/learn">
                View Maya’s learning portal
              </Link>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
export function Insights() {
  const { data } = useStore();
  const rows = departments.map((d) => {
    const people = data.employees.filter((p) => p.department === d);
    return {
      department: d,
      count: people.length,
      percent: people.length
        ? Math.round(
            people.reduce(
              (n, p) =>
                n +
                progress(
                  p,
                  data.flows.find((f) => f.id === p.flowId),
                ).percent,
              0,
            ) / people.length,
          )
        : 0,
    };
  });
  return (
    <>
      <PageHeading
        eyebrow="LEARNING, MADE VISIBLE"
        title="Small steps. Real progress."
        description="A view of your team’s onboarding, calculated from this demo workspace."
      />
      <div className="two-columns">
        <section className="panel padded">
          <h2>Completion by team</h2>
          <p className="section-desc">
            Average progress across assigned journeys
          </p>
          <div className="bar-chart">
            {rows.map((r) => (
              <div key={r.department}>
                <div>
                  <b>{r.department}</b>
                  <span>{r.percent}%</span>
                </div>
                <Progress value={r.percent} />
                <small>{r.count} teammates</small>
              </div>
            ))}
          </div>
        </section>
        <section className="panel padded">
          <h2>Where people are in their journey</h2>
          <p className="section-desc">Each person is counted once.</p>
          <div className="stage-metrics">
            {[
              [
                "Getting started",
                data.employees.filter(
                  (p) =>
                    progress(
                      p,
                      data.flows.find((f) => f.id === p.flowId),
                    ).percent < 30,
                ).length,
              ],
              [
                "Finding their rhythm",
                data.employees.filter((p) => {
                  const v = progress(
                    p,
                    data.flows.find((f) => f.id === p.flowId),
                  ).percent;
                  return v >= 30 && v < 100;
                }).length,
              ],
              [
                "Ready for what’s next",
                data.employees.filter(
                  (p) =>
                    progress(
                      p,
                      data.flows.find((f) => f.id === p.flowId),
                    ).percent === 100,
                ).length,
              ],
            ].map(([l, v]) => (
              <div key={l}>
                <span>{l}</span>
                <strong>{v}</strong>
              </div>
            ))}
          </div>
          <Link to="/people" className="text-link">
            Explore individual progress
          </Link>
        </section>
      </div>
      <section className="panel activity-list">
        <div className="panel-header">
          <h2>Recent milestones</h2>
          <Badge>Demo activity</Badge>
        </div>
        {data.activity.map((a) => (
          <div className="activity-item" key={a.id}>
            <span className={"avatar " + a.color}>{a.initials}</span>
            <div>
              <b>{a.text}</b>
              <p>{a.detail}</p>
            </div>
            <small>{a.time}</small>
          </div>
        ))}
      </section>
    </>
  );
}
export function SettingsPage() {
  const { data, setData, notify, reset } = useStore();
  const [confirm, setConfirm] = useState(false);
  return (
    <>
      <PageHeading
        title="Workspace settings"
        description="Manage your company identity and workspace preferences."
      />
      <div className="settings-layout">
        <section className="panel padded">
          <h2>Company identity</h2>
          <form
            className="form"
            onSubmit={(e) => {
              e.preventDefault();
              const d = new FormData(e.currentTarget);
              setData((s) => ({
                ...s,
                company: String(d.get("company")).trim(),
              }));
              notify("Workspace details saved in this browser.");
            }}
          >
            <div className="brand-preview">
              <img src="/igris-logo.png" alt="IGRIS logo" />
              <div>
                <b>Powered by IGRIS Workforce</b>
                <p>Your company. Your people. A shared starting point.</p>
              </div>
            </div>
            <label>
              Company name
              <input
                name="company"
                defaultValue={data.company}
                required
                maxLength={60}
              />
            </label>
            <label>
              Workspace owner
              <input value="Elena Rostova · People & Culture" readOnly />
            </label>
            <div className="info-note">
              This preview uses sample identities. Authentication and
              permissions will be provided by your backend.
            </div>
            <button className="btn primary" type="submit">
              Save changes
            </button>
          </form>
        </section>
        <section className="panel padded">
          <h2>Your demo workspace</h2>
          <p className="section-desc">
            Changes are stored on this device so you can explore both sides of
            the experience.
          </p>
          <ul className="plain-list">
            <li>
              <CircleCheck size={17} />
              Frontend interactions and local progress
            </li>
            <li>
              <CircleCheck size={17} />
              Sample company knowledge and responses
            </li>
            <li>
              <CircleCheck size={17} />
              No real emails, accounts, or AI calls
            </li>
          </ul>
          <button className="btn" onClick={() => setConfirm(true)}>
            <RotateCcw size={16} />
            Reset demo data
          </button>
        </section>
      </div>
      <Modal
        title="Start the demo fresh?"
        open={confirm}
        onClose={() => setConfirm(false)}
      >
        <p className="form-intro">
          This removes edits made in this browser and restores the sample
          company, people, and learning progress.
        </p>
        <div className="modal-actions">
          <button className="btn" onClick={() => setConfirm(false)}>
            Keep my changes
          </button>
          <button
            className="btn primary"
            onClick={() => {
              reset();
              setConfirm(false);
              notify("Demo restored to its starting point.");
            }}
          >
            Reset demo
          </button>
        </div>
      </Modal>
    </>
  );
}
