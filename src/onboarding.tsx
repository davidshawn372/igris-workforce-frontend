import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Plus,
  Copy,
  BookOpen,
  Layers3,
  Users,
  ShieldCheck,
  Search,
  Pencil,
  Clock3,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Trash2,
  Eye,
  Check,
  Upload,
  FileText,
  Settings2,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { useStore, progress, initials } from "./store";
import { PageHeading, SearchField, Badge, Modal, Empty, Progress } from "./ui";
import { departments, baseModules } from "./data";
import type { Department, Flow, ModuleKind, KnowledgeDocument } from "./types";
export function Flows() {
  const { data, setData, notify } = useStore();
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState("All teams");
  const [create, setCreate] = useState(false);
  const [assign, setAssign] = useState("");
  const [selected, setSelected] = useState("");
  const flows = data.flows.filter(
    (f) =>
      (department === "All teams" || f.department === department) &&
      (f.title + " " + f.description)
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <PageHeading
        title="Onboarding journeys"
        description="Give every new teammate a clear place to begin."
      >
        <button className="btn primary" onClick={() => setCreate(true)}>
          <Plus size={17} />
          Create journey
        </button>
      </PageHeading>
      <section className="journey-showcase">
        <div className="showcase-copy">
          <span className="editorial-label">The first few weeks matter</span>
          <h2>
            Make joining your team
            <br />
            feel like belonging.
          </h2>
          <p>
            Bring your people, knowledge, and first steps together in a journey
            made for each role.
          </p>
          <Link className="btn primary" to="/learn">
            Explore the employee experience{" "}
            <ChevronLeft className="forward-icon" size={16} />
          </Link>
          <div className="showcase-facts">
            <span>
              <b>{data.flows.filter((f) => f.published).length}</b> live
              journeys
            </span>
            <span>
              <b>{data.employees.length}</b> teammates enrolled
            </span>
          </div>
        </div>
        <div className="journey-preview" aria-label="Onboarding stages">
          <span className="preview-label">A clear path from day one</span>
          {[["01", "Get ready", "Welcome, essentials & account setup"], ["02", "Build confidence", "Role-specific lessons & practice"], ["03", "Find your rhythm", "Team connections & your first project"]].map(([step, title, detail]) => (
            <div className="preview-stage" key={step}><span>{step}</span><div><h3>{title}</h3><p>{detail}</p></div><Check size={17} /></div>
          ))}
        </div>
      </section>
      <div className="library-heading">
        <h2>Your journey library</h2>
        <span>{flows.length} journeys</span>
      </div>
      <div className="toolbar">
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Find a journey"
        />
        <div className="filter-pills">
          {["All teams", ...departments].map((d) => (
            <button
              key={d}
              className={d === department ? "active" : ""}
              onClick={() => setDepartment(d)}
            >
              {d}
            </button>
          ))}
        </div>
      </div>
      <div className="flow-grid">
        {flows.map((f, i) => {
          const people = data.employees.filter((p) => p.flowId === f.id);
          const avg = people.length
            ? Math.round(
                people.reduce((v, p) => v + progress(p, f).percent, 0) /
                  people.length,
              )
            : 0;
          const Icon = [Layers3, BookOpen, Users, Layers3, ShieldCheck, Users][
            i % 6
          ];
          return (
            <article className="flow-card journey-library-card" key={f.id}>
              <div className="flow-top">
                <span
                  className={
                    "tile-icon " + ["lavender", "peach", "mint", "blue"][i % 4]
                  }
                >
                  <Icon size={24} />
                </span>
                <Badge tone={f.published ? "green" : "neutral"}>
                  {f.published ? "Published" : "Draft"}
                </Badge>
              </div>
              <span className="flow-department">{f.department}</span>
              <Link to={"/onboarding/" + f.id}>
                <h2>{f.title}</h2>
              </Link>
              <p>{f.description}</p>
              <div className="curriculum-preview" aria-label="Journey preview">
                {f.modules.slice(0, 3).map((module, index) => (
                  <span key={module.id}>
                    <i>{index + 1}</i>
                    {module.title}
                  </span>
                ))}
                {f.modules.length > 3 && (
                  <small>+{f.modules.length - 3} more milestones</small>
                )}
              </div>
              <div className="flow-meta">
                <span>
                  <BookOpen size={15} />
                  {f.modules.length} modules
                </span>
                <span>
                  <Clock3 size={15} />
                  {f.days} days
                </span>
              </div>
              <div className="flow-enrolled">
                <span className="stack-avatars">
                  {people.slice(0, 3).map((p) => (
                    <i key={p.id}>{initials(p.name)}</i>
                  ))}
                </span>
                <span>
                  {people.length
                    ? people.length + " teammates learning"
                    : "Ready for your next new hire"}
                </span>
              </div>
              {people.length > 0 && <Progress value={avg} />}
              <div className="flow-actions">
                <button
                  className="text-button"
                  disabled={!f.published}
                  onClick={() => {
                    setAssign(f.id);
                    setSelected(data.employees[0]?.id || "");
                  }}
                >
                  Assign to teammate
                </button>
                <div>
                  <button
                    className="icon-btn"
                    aria-label={"Duplicate " + f.title}
                    onClick={() => {
                      setData((s) => ({
                        ...s,
                        flows: [
                          ...s.flows,
                          {
                            ...structuredClone(f),
                            id: crypto.randomUUID(),
                            title: f.title + " (copy)",
                            published: false,
                          },
                        ],
                      }));
                      notify("Journey duplicated as a draft.");
                    }}
                  >
                    <Copy size={16} />
                  </button>
                  <Link
                    className="icon-btn"
                    aria-label={"Edit " + f.title}
                    to={"/onboarding/" + f.id}
                  >
                    <Pencil size={16} />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      {!flows.length && (
        <Empty
          title="No journeys found"
          description="Try a different team or search term."
        />
      )}
      <div className="note-banner">
        <BookOpen size={22} />
        <div>
          <b>Start with the knowledge you already have.</b>
          <p>
            Use your handbooks, checklists, and team guides to build a practical
            learning path.
          </p>
        </div>
        <Link className="btn" to="/knowledge">
          Open knowledge library
        </Link>
      </div>
      <Modal
        title="Create an onboarding journey"
        open={create}
        onClose={() => setCreate(false)}
      >
        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();
            const v = new FormData(e.currentTarget);
            const f: Flow = {
              id: crypto.randomUUID(),
              title: String(v.get("title")).trim(),
              department: v.get("department") as Department,
              description: String(v.get("description")),
              days: Number(v.get("days")),
              published: false,
              modules: structuredClone(baseModules.slice(0, 3)),
            };
            setData((s) => ({ ...s, flows: [...s.flows, f] }));
            setCreate(false);
            notify(
              "Journey created with three starter modules. Open it to edit.",
            );
          }}
        >
          <label>
            Journey name
            <input
              name="title"
              required
              maxLength={90}
              placeholder="e.g. Customer support foundations"
            />
          </label>
          <label>
            What will people learn?
            <textarea
              name="description"
              required
              maxLength={300}
              placeholder="A clear, friendly introduction to the role…"
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
              Length in days
              <input
                name="days"
                type="number"
                min={1}
                max={90}
                defaultValue={14}
                required
              />
            </label>
          </div>
          <button className="btn primary">Create draft</button>
        </form>
      </Modal>
      <Modal
        title="Assign this journey"
        open={!!assign}
        onClose={() => setAssign("")}
      >
        <div className="form">
          <p className="form-intro">
            Assigning a new journey resets that teammate’s learning progress in
            this demo.
          </p>
          <label>
            Teammate
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              {data.employees.map((p) => (
                <option value={p.id} key={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <button
            className="btn primary"
            disabled={!selected}
            onClick={() => {
              setData((s) => ({
                ...s,
                employees: s.employees.map((p) =>
                  p.id === selected
                    ? { ...p, flowId: assign, completed: [] }
                    : p,
                ),
              }));
              setAssign("");
              notify("Journey assigned. The teammate can start learning.");
            }}
          >
            Assign journey
          </button>
        </div>
      </Modal>
    </>
  );
}
export function FlowBuilder() {
  const { id } = useParams();
  const { data, setData, notify } = useStore();
  const flow = data.flows.find((f) => f.id === id);
  const [selected, setSelected] = useState("");
  const [remove, setRemove] = useState("");
  if (!flow)
    return (
      <Empty
        title="Journey not found"
        description="Choose an existing journey from the library."
      >
        <Link to="/onboarding" className="btn">
          All journeys
        </Link>
      </Empty>
    );
  const active = flow.modules.find((m) => m.id === selected) || flow.modules[0];
  function update(patch: Partial<Flow>) {
    setData((s) => ({
      ...s,
      flows: s.flows.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    }));
  }
  function reorder(index: number, delta: number) {
    const modules = [...flow!.modules];
    [modules[index], modules[index + delta]] = [
      modules[index + delta],
      modules[index],
    ];
    update({ modules });
  }
  return (
    <>
      <Link className="back-link" to="/onboarding">
        <ChevronLeft size={16} />
        Onboarding journeys
      </Link>
      <PageHeading title={flow.title} description={flow.description}>
        <Link className="btn" to="/learn/journey">
          <Eye size={16} />
          Employee demo
        </Link>
        <button
          className="btn primary"
          disabled={!flow.modules.length}
          onClick={() => {
            update({ published: !flow.published });
            notify(
              flow.published
                ? "Journey moved to draft."
                : "Journey published in the demo workspace.",
            );
          }}
        >
          {flow.published ? "Move to draft" : "Publish journey"}
        </button>
      </PageHeading>
      <div className="builder-summary">
        <Badge tone={flow.published ? "green" : "neutral"}>
          {flow.published ? "Published" : "Draft"}
        </Badge>
        <span>{flow.department}</span>
        <span>{flow.modules.length} modules</span>
        <span>
          {flow.modules.reduce((v, m) => v + m.minutes, 0)} minutes of learning
        </span>
        <span className="save-indicator">
          <Check size={14} />
          Saved in this browser
        </span>
      </div>
      <div className="builder-grid">
        <section>
          <div className="builder-section-title">
            <span>Learning sequence</span>
            <p>Small, clear steps from day one to their first contribution.</p>
          </div>
          {flow.modules.map((m, i) => (
            <div
              className={
                "module-builder-row " + (active?.id === m.id ? "selected" : "")
              }
              key={m.id}
            >
              <span className="module-number">{i + 1}</span>
              <button
                className="module-select"
                onClick={() => setSelected(m.id)}
              >
                <span>
                  {m.kind} · Day {m.day} · {m.minutes} min
                </span>
                <h3>{m.title}</h3>
                <p>{m.description}</p>
              </button>
              <div className="reorder-controls">
                <button
                  aria-label={"Move " + m.title + " up"}
                  className="icon-btn"
                  disabled={i === 0}
                  onClick={() => reorder(i, -1)}
                >
                  <ChevronUp size={16} />
                </button>
                <button
                  aria-label={"Move " + m.title + " down"}
                  className="icon-btn"
                  disabled={i === flow.modules.length - 1}
                  onClick={() => reorder(i, 1)}
                >
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>
          ))}
          <button
            className="add-module"
            onClick={() => {
              const module = {
                id: crypto.randomUUID(),
                title: "New learning module",
                kind: "Lesson" as ModuleKind,
                minutes: 10,
                day: flow.days,
                required: true,
                description: "Describe what your teammate will learn.",
              };
              update({ modules: [...flow.modules, module] });
              setSelected(module.id);
            }}
          >
            <Plus size={20} />
            Add a learning module
          </button>
        </section>
        <aside className="panel builder-inspector">
          <div className="panel-header">
            <h2>Module details</h2>
            <Settings2 size={18} />
          </div>
          {active ? (
            <form
              className="form"
              key={active.id}
              onSubmit={(e) => {
                e.preventDefault();
                const v = new FormData(e.currentTarget);
                update({
                  modules: flow.modules.map((m) =>
                    m.id === active.id
                      ? {
                          ...m,
                          title: String(v.get("title")).trim(),
                          description: String(v.get("description")),
                          kind: v.get("kind") as ModuleKind,
                          day: Number(v.get("day")),
                          minutes: Number(v.get("minutes")),
                          required: v.get("required") === "on",
                        }
                      : m,
                  ),
                });
                notify("Module updated.");
              }}
            >
              <label>
                Title
                <input
                  name="title"
                  defaultValue={active.title}
                  required
                  maxLength={100}
                />
              </label>
              <label>
                Learning goal
                <textarea
                  name="description"
                  defaultValue={active.description}
                  required
                  maxLength={400}
                />
              </label>
              <label>
                Content type
                <select name="kind" defaultValue={active.kind}>
                  {["Lesson", "Checklist", "Quiz", "Scenario"].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
              <div className="form-row">
                <label>
                  Due on day
                  <input
                    name="day"
                    type="number"
                    min={1}
                    max={90}
                    defaultValue={active.day}
                    required
                  />
                </label>
                <label>
                  Minutes
                  <input
                    name="minutes"
                    type="number"
                    min={1}
                    max={180}
                    defaultValue={active.minutes}
                    required
                  />
                </label>
              </div>
              <label className="inline-check">
                <input
                  type="checkbox"
                  name="required"
                  defaultChecked={active.required}
                />
                Required module
              </label>
              <button className="btn primary">Save module</button>
              <button
                className="text-button danger"
                type="button"
                onClick={() => setRemove(active.id)}
              >
                <Trash2 size={15} />
                Remove module
              </button>
            </form>
          ) : (
            <Empty
              title="An open canvas"
              description="Add your first module to begin."
            />
          )}
          <div className="inspector-note">
            The employee demo currently previews Maya’s assigned journey. Assign
            this journey to Maya from the library to preview its sequence.
          </div>
        </aside>
      </div>
      <Modal
        title="Remove this module?"
        open={!!remove}
        onClose={() => setRemove("")}
      >
        <p className="form-intro">
          This changes the journey for everyone assigned to it in this demo.
        </p>
        <div className="modal-actions">
          <button className="btn" onClick={() => setRemove("")}>
            Keep module
          </button>
          <button
            className="btn primary"
            onClick={() => {
              update({ modules: flow.modules.filter((m) => m.id !== remove) });
              setRemove("");
              setSelected("");
              notify("Module removed.");
            }}
          >
            Remove module
          </button>
        </div>
      </Modal>
    </>
  );
}
export function Knowledge() {
  const { data, setData, notify } = useStore();
  const [query, setQuery] = useState("");
  const [document, setDocument] = useState<KnowledgeDocument | null>(null);
  const [upload, setUpload] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState(false);
  return (
    <>
      <PageHeading
        title="Good answers start here."
        description="A shared home for your company’s handbooks, policies, and practical know-how."
      >
        <button className="btn" onClick={() => setSettings(true)}>
          <Settings2 size={16} />
          Assistant settings
        </button>
        <button className="btn primary" onClick={() => setUpload(true)}>
          <Upload size={16} />
          Add documents
        </button>
      </PageHeading>
      <div className="knowledge-intro">
        <div>
          <span className="tile-icon lavender">
            <LibraryIcon />
          </span>
          <h2>
            Keep the knowledge.
            <br />
            Lose the guesswork.
          </h2>
          <p>
            Give every teammate a reliable place to look, and a clear person to
            ask when the answer isn’t here.
          </p>
        </div>
        <div className="knowledge-numbers">
          <strong>{data.documents.length}</strong>
          <span>company resources</span>
          <Link className="text-link" to="/learn/assistant">
            Try the assistant demo
          </Link>
        </div>
      </div>
      <Link className="knowledge-ask" to="/learn/assistant?q=What%20is%20our%20remote%20equipment%20policy%3F">
        <span className="ask-symbol"><Sparkles size={20} /></span>
        <span><b>Ask your company knowledge</b><small>Try: “What is our remote equipment policy?”</small></span>
        <span className="ask-demo">Assistant demo</span><ArrowUpRight size={18} />
      </Link>
      <div className="toolbar">
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Search documents"
        />
        <Badge>Sample library</Badge>
      </div>
      <section className="panel">
        <div className="document-list">
          {data.documents
            .filter((d) => d.title.toLowerCase().includes(query.toLowerCase()))
            .map((d) => (
              <button
                className="document-row"
                key={d.id}
                onClick={() => setDocument(d)}
              >
                <span className="document-icon">
                  <FileText size={22} />
                </span>
                <span>
                  <b>{d.title}</b>
                  <small>
                    {d.scope} · {d.updated} · {d.status}
                  </small>
                </span>
                <Badge
                  tone={d.category === "Security" ? "amber" : d.category === "Engineering" ? "blue" : d.category === "People" ? "green" : "purple"}
                >
                  {d.category === "Company" ? "Company policy" : d.category}
                </Badge>
                <ChevronDown size={16} />
              </button>
            ))}
        </div>
        {!data.documents.some((d) =>
          d.title.toLowerCase().includes(query.toLowerCase()),
        ) && (
          <Empty
            title="No documents found"
            description="Try a different title."
          />
        )}
      </section>
      <Modal
        title={document?.title || "Document"}
        open={!!document}
        onClose={() => setDocument(null)}
      >
        <div className="document-reading">
          <Badge>{document?.status}</Badge>
          <p>{document?.content}</p>
          {document?.status === "Pending backend" && (
            <div className="info-note">
              Only the file name was added to the demo. Parsing, storage, and
              assistant retrieval need the backend.
            </div>
          )}
        </div>
      </Modal>
      <Modal
        title="Add company documents"
        open={upload}
        onClose={() => {
          setUpload(false);
          setFiles([]);
          setError("");
        }}
      >
        <div className="form">
          <p className="form-intro">
            Select resources for your knowledge library. This frontend stores
            file names only.
          </p>
          <label className="upload-zone">
            <Upload size={28} />
            <b>Choose files from your computer</b>
            <span>PDF, DOCX, Markdown, or TXT · Up to 10 MB each</span>
            <input
              type="file"
              multiple
              accept=".pdf,.docx,.md,.txt"
              onChange={(e) => {
                const all = Array.from(e.target.files || []);
                const invalid = all.find(
                  (f) =>
                    f.size > 10 * 1024 * 1024 ||
                    !/\.(pdf|docx|md|txt)$/i.test(f.name),
                );
                setError(
                  invalid ? "Choose supported files smaller than 10 MB." : "",
                );
                setFiles(invalid ? [] : all);
              }}
            />
          </label>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          {files.map((f, i) => (
            <div className="file-selection" key={i}>
              <FileText size={17} />
              {f.name}
              <small>{(f.size / 1024).toFixed(0)} KB</small>
            </div>
          ))}
          <button
            className="btn primary"
            disabled={!files.length}
            onClick={() => {
              setData((s) => ({
                ...s,
                documents: [
                  ...s.documents,
                  ...files.map((f) => ({
                    id: crypto.randomUUID(),
                    title: f.name,
                    category: "Uploaded",
                    scope: "Everyone",
                    status: "Pending backend" as const,
                    content:
                      "This file is awaiting backend upload and processing. Its content is not available in this frontend demo.",
                    updated: "Just added",
                  })),
                ],
              }));
              setFiles([]);
              setUpload(false);
              notify("File names added. Backend processing is not connected.");
            }}
          >
            Add to demo library
          </button>
        </div>
      </Modal>
      <Modal
        title="Assistant settings"
        open={settings}
        onClose={() => setSettings(false)}
      >
        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();
            const v = new FormData(e.currentTarget);
            setData((s) => ({ ...s, assistantTone: String(v.get("tone")) }));
            setSettings(false);
            notify(
              "Assistant preference saved. Responses remain scripted demo examples.",
            );
          }}
        >
          <label>
            Tone of voice
            <select name="tone" defaultValue={data.assistantTone}>
              <option>Warm & helpful</option>
              <option>Clear & concise</option>
              <option>Professional</option>
            </select>
          </label>
          <div className="info-note">
            The production assistant should cite approved sources and ask a
            human when the answer is missing. This demo uses scripted examples
            only.
          </div>
          <button className="btn primary">Save preference</button>
        </form>
      </Modal>
    </>
  );
}
function LibraryIcon() {
  return <BookOpen size={24} />;
}
