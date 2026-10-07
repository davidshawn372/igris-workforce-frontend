import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Plus,
  MapPin,
  BriefcaseBusiness,
  ChevronRight,
  ChevronLeft,
  CalendarDays,
  Check,
  Users,
  Mail,
} from "lucide-react";
import { useStore, initials } from "./store";
import { Avatar, Badge, PageHeading, SearchField, Empty, Modal } from "./ui";
import { departments } from "./data";
import type { Department, Stage, Job } from "./types";
const stages: Stage[] = [
  "Applied",
  "Review",
  "Shortlisted",
  "Interview",
  "Offer",
  "Hired",
];
export function Hiring() {
  const { data, setData, notify } = useStore();
  const [tab, setTab] = useState("Pipeline");
  const [query, setQuery] = useState("");
  const [job, setJob] = useState("All roles");
  const [detail, setDetail] = useState<Job | null>(null);
  return (
    <>
      <PageHeading
        title="Your next great teammate."
        description="Bring a little more care and clarity to every hiring conversation."
      >
        <Link className="btn primary" to="/hiring/new">
          <Plus size={17} />
          Create role
        </Link>
      </PageHeading>
      <div className="hiring-tabs tabs">
        {["Pipeline", "Open roles"].map((t) => (
          <button
            className={tab === t ? "active" : ""}
            key={t}
            onClick={() => setTab(t)}
          >
            {t}
            <span>
              {t === "Pipeline" ? data.candidates.length : data.jobs.length}
            </span>
          </button>
        ))}
      </div>
      <div className="toolbar">
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder={
            tab === "Pipeline" ? "Search candidates or skills" : "Search roles"
          }
        />
        {tab === "Pipeline" && (
          <select
            aria-label="Filter role"
            value={job}
            onChange={(e) => setJob(e.target.value)}
          >
            <option>All roles</option>
            {data.jobs.map((j) => (
              <option value={j.id} key={j.id}>
                {j.title}
              </option>
            ))}
          </select>
        )}
        <span className="muted">Hiring decisions stay with your team.</span>
      </div>
      {tab === "Pipeline" ? (
        <div className="pipeline">
          {stages.map((stage, i) => {
            const candidates = data.candidates.filter(
              (c) =>
                c.stage === stage &&
                (job === "All roles" || c.jobId === job) &&
                (c.name + " " + c.skills.join(" "))
                  .toLowerCase()
                  .includes(query.toLowerCase()),
            );
            return (
              <section className="pipeline-column" key={stage}>
                <h2>
                  <i
                    style={{
                      background: [
                        "#b5acbf",
                        "#9779d4",
                        "#7552c3",
                        "#a58269",
                        "#568977",
                        "#3a765e",
                      ][i],
                    }}
                  />
                  {stage}
                  <span>{candidates.length}</span>
                </h2>
                {candidates.map((c) => (
                  <Link
                    className="candidate-card"
                    to={"/hiring/candidate/" + c.id}
                    key={c.id}
                  >
                    <Avatar name={c.name} color={c.color} />
                    <h3>{c.name}</h3>
                    <p>{c.role}</p>
                    <small>
                      <MapPin size={12} />
                      {c.location}
                    </small>
                    <div className="skill-tags">
                      {c.skills.slice(0, 2).map((s) => (
                        <span key={s}>{s}</span>
                      ))}
                    </div>
                    <div className="candidate-card-footer">
                      <span>{c.experience} experience</span>
                      <ChevronRight size={15} />
                    </div>
                  </Link>
                ))}
                {!candidates.length && (
                  <div className="pipeline-empty">No candidates here yet</div>
                )}
              </section>
            );
          })}
        </div>
      ) : (
        <div className="jobs-grid">
          {data.jobs
            .filter((j) => j.title.toLowerCase().includes(query.toLowerCase()))
            .map((j) => (
              <article className="panel job-card" key={j.id}>
                <div className="flow-top">
                  <span className="tile-icon lavender">
                    <BriefcaseBusiness size={23} />
                  </span>
                  <Badge tone={j.status === "Published" ? "green" : "neutral"}>
                    {j.status}
                  </Badge>
                </div>
                <h2>{j.title}</h2>
                <p>{j.department}</p>
                <div className="job-meta">
                  <span>
                    <MapPin size={15} />
                    {j.location}
                  </span>
                  <span>
                    <ClockIcon />
                    {j.type}
                  </span>
                </div>
                <p className="salary">{j.salary || "Salary not specified"}</p>
                <div className="flow-actions">
                  <button className="text-button" onClick={() => setDetail(j)}>
                    View role
                  </button>
                  <button
                    className="btn"
                    onClick={() => {
                      setData((s) => ({
                        ...s,
                        jobs: s.jobs.map((x) =>
                          x.id === j.id
                            ? {
                                ...x,
                                status:
                                  j.status === "Published"
                                    ? "Draft"
                                    : "Published",
                              }
                            : x,
                        ),
                      }));
                      notify("Role visibility changed in the demo.");
                    }}
                  >
                    {j.status === "Published" ? "Unpublish" : "Publish"}
                  </button>
                </div>
              </article>
            ))}
        </div>
      )}
      <Modal
        title={detail?.title || "Role"}
        open={!!detail}
        onClose={() => setDetail(null)}
      >
        <div className="document-reading">
          <Badge>{detail?.department}</Badge>
          <p>{detail?.description}</p>
          <p>
            <b>{detail?.salary}</b>
          </p>
          <p>
            {detail?.location} · {detail?.type}
          </p>
        </div>
      </Modal>
    </>
  );
}
function ClockIcon() {
  return <CalendarDays size={15} />;
}
export function JobEditor() {
  const { setData, notify } = useStore();
  const navigate = useNavigate();
  return (
    <>
      <Link className="back-link" to="/hiring">
        <ChevronLeft size={16} />
        Hiring
      </Link>
      <PageHeading
        title="Make room for someone great."
        description="A clear role description is the beginning of a better conversation."
      />
      <section className="panel padded form-panel">
        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();
            const d = new FormData(e.currentTarget);
            const job: Job = {
              id: crypto.randomUUID(),
              title: String(d.get("title")).trim(),
              department: d.get("department") as Department,
              location: String(d.get("location")),
              type: String(d.get("type")),
              salary: String(d.get("salary")),
              description: String(d.get("description")),
              status: "Draft",
            };
            setData((s) => ({ ...s, jobs: [...s.jobs, job] }));
            notify("Role saved as a draft. Publish it from Open roles.");
            navigate("/hiring");
          }}
        >
          <h2>The role</h2>
          <label>
            Job title
            <input
              name="title"
              placeholder="e.g. Senior Frontend Engineer"
              maxLength={100}
              required
            />
          </label>
          <div className="form-row">
            <label>
              Department
              <select name="department">
                {departments.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </label>
            <label>
              Employment type
              <select name="type">
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
              </select>
            </label>
          </div>
          <div className="form-row">
            <label>
              Location
              <input name="location" required placeholder="Remote / city" />
            </label>
            <label>
              Salary range and currency
              <input name="salary" placeholder="e.g. USD 95,000–130,000" />
            </label>
          </div>
          <label>
            What will this person do?
            <textarea
              name="description"
              rows={8}
              required
              minLength={30}
              maxLength={5000}
              placeholder="Describe the work, the team, and what success looks like. Include the skills that matter most."
            />
          </label>
          <div className="modal-actions">
            <Link className="btn" to="/hiring">
              Cancel
            </Link>
            <button className="btn primary">Save role draft</button>
          </div>
        </form>
      </section>
    </>
  );
}
import { usePlan } from './plan-context';
import { capacityMessage } from './plans';
export function CandidateDetail() {
  const { id } = useParams();
  const { plan } = usePlan();
  const { data, setData, notify } = useStore();
  const candidate = data.candidates.find((c) => c.id === id);
  const [hire, setHire] = useState(false);
  const [flow, setFlow] = useState("engineering");
  const [note, setNote] = useState("");
  if (!candidate)
    return (
      <Empty
        title="Candidate not found"
        description="Return to the hiring pipeline."
      >
        <Link to="/hiring" className="btn">
          Open hiring
        </Link>
      </Empty>
    );
  const job = data.jobs.find((j) => j.id === candidate.jobId);
  return (
    <>
      <Link className="back-link" to="/hiring">
        <ChevronLeft size={16} />
        Hiring pipeline
      </Link>
      <PageHeading title={candidate.name} description={job?.title}>
        <Badge tone={candidate.stage === "Hired" ? "green" : "neutral"}>
          {candidate.stage}
        </Badge>
        <button
          className="btn primary"
          disabled={candidate.stage === "Hired"}
          onClick={() => setHire(true)}
        >
          <Check size={16} />
          {candidate.stage === "Hired" ? "Hired" : "Hire & onboard"}
        </button>
      </PageHeading>
      <div className="candidate-layout">
        <section className="panel padded candidate-profile">
          <Avatar name={candidate.name} color={candidate.color} />
          <h2>{candidate.name}</h2>
          <p>{candidate.role}</p>
          <div className="candidate-facts">
            <span>
              <MapPin size={16} />
              {candidate.location}
            </span>
            <span>
              <BriefcaseBusiness size={16} />
              {candidate.experience} experience
            </span>
          </div>
          <div className="skill-tags">
            {candidate.skills.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
          <label className="form-label">
            Hiring stage
            <select
              disabled={candidate.stage === "Hired"}
              value={candidate.stage}
              onChange={(e) => {
                setData((s) => ({
                  ...s,
                  candidates: s.candidates.map((c) =>
                    c.id === id ? { ...c, stage: e.target.value as Stage } : c,
                  ),
                }));
                notify("Candidate stage updated.");
              }}
            >
              {stages
                .filter((s) => s !== "Hired" || candidate.stage === "Hired")
                .map((s) => (
                  <option key={s}>{s}</option>
                ))}
            </select>
          </label>
        </section>
        <div>
          <section className="panel padded">
            <h2>Candidate summary</h2>
            <p className="reading-copy">{candidate.note}</p>
            <div className="info-note">
              Sample profile for this frontend demo. Review original application
              materials before making a real hiring decision.
            </div>
          </section>
          <section className="panel padded notes-panel">
            <h2>Team notes</h2>
            <form
              className="form"
              onSubmit={(e) => {
                e.preventDefault();
                setData((s) => ({
                  ...s,
                  candidates: s.candidates.map((c) =>
                    c.id === id
                      ? { ...c, note: c.note + "\n\nTeam note: " + note.trim() }
                      : c,
                  ),
                }));
                setNote("");
                notify("Note added to candidate summary.");
              }}
            >
              <label>
                Your observation
                <textarea
                  required
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  maxLength={1500}
                  placeholder="Add specific observations for your team…"
                />
              </label>
              <button className="btn" disabled={!note.trim()}>
                Save note
              </button>
            </form>
          </section>
        </div>
      </div>
      <Modal
        title="Start their next chapter"
        open={hire}
        onClose={() => setHire(false)}
      >
        <div className="form">
          <p className="form-intro">
            Add {candidate.name} to your people workspace and assign their first
            learning journey.
          </p>
          <label>
            Onboarding journey
            <select value={flow} onChange={(e) => setFlow(e.target.value)}>
              {data.flows
                .filter((f) => f.published)
                .map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.title}
                  </option>
                ))}
            </select>
          </label>
          <div className="info-note">
            <Mail size={18} />
            Demo only. No offer, contract, or invitation is sent.
          </div>
          <button
            className="btn primary"
            onClick={() => {
              const limit = capacityMessage(plan, 'employees', data.employees.length);
              if (limit) { notify(limit); return; }
              setData((s) => ({
                ...s,
                candidates: s.candidates.map((c) =>
                  c.id === id ? { ...c, stage: "Hired" } : c,
                ),
                employees: [
                  ...s.employees,
                  {
                    id: "employee-" + candidate.id,
                    name: candidate.name,
                    email: candidate.id + "@igris.example",
                    role: job?.title || candidate.role,
                    department: job?.department || "Engineering",
                    flowId: flow,
                    completed: [],
                    start: "2026-10-05",
                    buddy: "Alex Wu",
                    needsHelp: false,
                    color: candidate.color,
                  },
                ],
                activity: [
                  {
                    id: crypto.randomUUID(),
                    text: candidate.name + " is joining the team",
                    detail: "Onboarding journey assigned",
                    time: "Just now",
                    initials: initials(candidate.name),
                    color: candidate.color,
                  },
                  ...s.activity,
                ],
              }));
              setHire(false);
              notify("Candidate hired in demo and added to People.");
            }}
          >
            <Users size={17} />
            Confirm demo hire
          </button>
        </div>
      </Modal>
    </>
  );
}
