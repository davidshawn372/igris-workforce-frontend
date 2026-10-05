import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowRight, Check, BookOpen, Send } from "lucide-react";
import { useStore, progress, downloadText } from "./store";
import {
  Avatar,
  Badge,
  CheckRow,
  Empty,
  PageHeading,
  Progress,
  SearchField,
} from "./ui";
function useJourney() {
  const store = useStore();
  const person = store.data.employees.find((p) => p.id === "maya")!;
  const flow = store.data.flows.find((f) => f.id === person.flowId);
  return { ...store, person, flow, status: progress(person, flow) };
}
export function LearnerHome() {
  const { person, flow, status } = useJourney();
  const next = flow?.modules.find((m) => !person.completed.includes(m.id));
  return (
    <>
      <div className="learner-greeting">
        Welcome to your next chapter, Maya.
      </div>
      <section className="welcome-hero">
        <div>
          <Badge>Your first weeks, thoughtfully planned</Badge>
          <h1>
            Find your feet.
            <br />
            Make your mark.
          </h1>
          <p>
            A little guidance, the right people, and room to learn. Your journey
            starts with one small step.
          </p>
          <Link
            className="btn light"
            to={next ? "/learn/lesson/" + next.id : "/learn/journey"}
          >
            Continue my journey
            <ArrowRight size={18} />
          </Link>
          <div className="buddy">
            <Avatar name={person.buddy} />
            <span>
              {person.buddy} is your onboarding buddy.
              <small>You don’t have to figure it all out alone.</small>
            </span>
          </div>
        </div>
        <div className="welcome-snapshot">
          <span className="preview-label">Your learning snapshot</span>
          <strong>{status.percent}<small>%</small></strong>
          <Progress value={status.percent} />
          <p>{status.count} of {status.total} modules completed</p>
          <div className="snapshot-next"><BookOpen size={20} /><div><small>Up next</small><b>{next?.title || "Your journey is complete"}</b></div></div>
        </div>
      </section>
      <div className="learner-columns">
        <section>
          <div className="section-heading">
            <h2>Where you left off</h2>
            <Link className="text-link" to="/learn/journey">
              View full journey
            </Link>
          </div>
          {next && (
            <Link className="next-lesson panel" to={"/learn/lesson/" + next.id}>
              <BookOpen size={30} />
              <div>
                <Badge>
                  Day {next.day} · {next.minutes} min
                </Badge>
                <h2>{next.title}</h2>
                <p>{next.description}</p>
              </div>
              <ArrowRight size={22} />
            </Link>
          )}
          <div className="section-heading">
            <h2>Your first weeks, at a glance</h2>
          </div>
          <div className="week-grid">
            {[
              ["01", "Settle in", "Meet your people and learn how we work."],
              [
                "02",
                "Build confidence",
                "Set up your tools and practise everyday skills.",
              ],
              [
                "03",
                "Make a contribution",
                "Pair with your buddy on your first real project.",
              ],
            ].map(([n, t, d]) => (
              <article key={n}>
                <span>{n}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </article>
            ))}
          </div>
        </section>
        <aside className="learner-rail">
          <section className="panel card-pad">
            <h2>Your progress</h2>
            <div className="big-progress">
              {status.percent}
              <span>%</span>
            </div>
            <Progress value={status.percent} />
            <p>
              {status.count} of {status.total} milestones complete
            </p>
            <small>{flow?.title}</small>
          </section>
          <Buddy />
          <Link className="help-card" to="/learn/assistant">
            <h3>A question is a good place to start.</h3>
            <p>Find answers in your company’s sample handbook.</p>
            <span>Ask IGRIS →</span>
          </Link>
        </aside>
      </div>
    </>
  );
}
function Buddy() {
  const { person } = useJourney();
  return (
    <section className="panel card-pad">
      <h3>Your person in the corner</h3>
      <div className="buddy">
        <Avatar name={person.buddy} color="mint" />
        <div>
          <b>{person.buddy}</b>
          <small>Onboarding buddy</small>
        </div>
      </div>
      <p>Bring your questions to your next team check-in.</p>
    </section>
  );
}
export function Journey() {
  const { flow, person, status } = useJourney();
  const [filter, setFilter] = useState("All");
  if (!flow)
    return (
      <Empty
        title="Your journey is being prepared"
        description="Your manager can assign a journey in the company workspace."
      />
    );
  return (
    <>
      <PageHeading
        title="Your path to feeling at home"
        description={flow.description}
      />
      <div className="journey-summary panel card-pad">
        <div>
          <b>{flow.title}</b>
          <p>
            {flow.days} days · {flow.modules.length} milestones
          </p>
        </div>
        <div>
          <b>{status.percent}% complete</b>
          <Progress value={status.percent} />
        </div>
      </div>
      <div className="tabs standalone">
        {["All", "To do", "Completed"].map((f) => (
          <button
            key={f}
            className={filter === f ? "active" : ""}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="journey-list">
        {flow.modules
          .filter(
            (m) =>
              filter === "All" ||
              (filter === "Completed") === person.completed.includes(m.id),
          )
          .map((m, i) => {
            const done = person.completed.includes(m.id);
            return (
              <Link
                className="journey-row"
                key={m.id}
                to={"/learn/lesson/" + m.id}
              >
                <span className="step-number">
                  {done ? <Check size={20} /> : i + 1}
                </span>
                <div>
                  <small>
                    Day {m.day} · {m.kind} · {m.minutes} min
                  </small>
                  <h2>{m.title}</h2>
                  <p>{m.description}</p>
                </div>
                <Badge tone={done ? "green" : "neutral"}>
                  {done ? "Completed" : "Open lesson"}
                </Badge>
              </Link>
            );
          })}
      </div>
    </>
  );
}
export function Lesson() {
  const { id } = useParams();
  return <LessonContent key={id} id={id} />;
}
function LessonContent({ id }: { id?: string }) {
  const { flow, person, data, setData, completeModule } = useJourney();
  const module = flow?.modules.find((m) => m.id === id);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  if (!module)
    return (
      <Empty
        title="Lesson not found"
        description="Return to your assigned journey."
      />
    );
  const done = person.completed.includes(module.id);
  const checked = data.checklist[module.id] || [];
  const tasks =
    module.id === "first-project"
      ? [
          "Agree a small task with your buddy.",
          "Share your draft and ask for feedback.",
          "Reflect on what you learned.",
        ]
      : [
          "Set up a unique password in your password manager.",
          "Enable multi-factor authentication on your work account.",
          "Save the security team contact details.",
        ];
  const practice = module.kind === "Quiz" || module.kind === "Scenario";
  const ready =
    module.kind === "Checklist"
      ? tasks.every((_, i) => checked.includes(String(i)))
      : practice
        ? submitted && answer === "safe"
        : true;
  return (
    <>
      <Link className="back-link" to="/learn/journey">
        ← My journey
      </Link>
      <PageHeading
        title={module.title}
        description={`Day ${module.day} · ${module.minutes} minutes · ${module.kind}`}
      />
      <div className="lesson-layout">
        <article className="panel lesson-body">
          <div className="lesson-banner">
            <BookOpen size={38} />
            <span>Small steps. Lasting confidence.</span>
          </div>
          <h2>Let’s make a good beginning.</h2>
          <p>{module.description}</p>
          <p>
            At {data.company}, we work with trust, curiosity, and care. Make
            your work visible, ask questions early, and give others the context
            they need. Your buddy is here to help.
          </p>
          {module.kind === "Checklist" && (
            <div className="task-list">
              {tasks.map((t, i) => (
                <CheckRow
                  key={t}
                  checked={checked.includes(String(i))}
                  onChange={() =>
                    setData((s) => ({
                      ...s,
                      checklist: {
                        ...s.checklist,
                        [module.id]: checked.includes(String(i))
                          ? checked.filter((x) => x !== String(i))
                          : [...checked, String(i)],
                      },
                    }))
                  }
                >
                  {t}
                </CheckRow>
              ))}
            </div>
          )}
          {practice && (
            <fieldset className="quiz">
              <legend>
                {module.kind === "Scenario"
                  ? "A colleague says their access is broken and asks to borrow your account. What do you do?"
                  : "Someone asks you to share a one-time login code. What should you do?"}
              </legend>
              {[
                ["unsafe", "Share access if their name looks familiar"],
                [
                  "safe",
                  "Keep credentials private and contact IT through an approved channel",
                ],
              ].map(([v, t]) => (
                <label key={v}>
                  <input
                    type="radio"
                    name="answer"
                    checked={answer === v}
                    onChange={() => {
                      setAnswer(v);
                      setSubmitted(false);
                    }}
                  />
                  {t}
                </label>
              ))}
              <button
                className="btn"
                disabled={!answer}
                onClick={() => setSubmitted(true)}
              >
                Check my answer
              </button>
              {submitted && (
                <p className="feedback" role="status">
                  {answer === "safe"
                    ? "Exactly. Being helpful starts with keeping accounts private. IT can verify the request and restore access."
                    : "Try again. A familiar name doesn’t make sharing credentials safe."}
                </p>
              )}
            </fieldset>
          )}
          {module.kind === "Lesson" && (
            <>
              <h3>Three things to take with you</h3>
              <ol className="reading-list">
                <li>Ask early. A question today saves confusion tomorrow.</li>
                <li>Write decisions and next steps in the team tracker.</li>
                <li>Give thoughtful feedback and respect focus time.</li>
              </ol>
              <blockquote>
                You aren’t expected to know everything on day one. You’re here
                to learn with us.
              </blockquote>
            </>
          )}
          <div className="lesson-actions">
            <Link className="btn" to="/learn/assistant">
              Ask about this lesson
            </Link>
            <button
              className="btn primary"
              disabled={done || !ready}
              onClick={() => completeModule(module.id)}
            >
              {done ? "Completed" : "Complete milestone"}
            </button>
          </div>
          <small className="muted">
            Sample content · progress saved in this browser
          </small>
        </article>
        <aside className="learner-rail">
          <section className="panel card-pad">
            <h3>Your milestones</h3>
            <div className="lesson-outline">
              {flow?.modules.map((m) => (
                <Link
                  className={m.id === id ? "active" : ""}
                  to={"/learn/lesson/" + m.id}
                  key={m.id}
                >
                  {person.completed.includes(m.id) ? (
                    <Check size={16} />
                  ) : (
                    <BookOpen size={16} />
                  )}{" "}
                  {m.title}
                </Link>
              ))}
            </div>
          </section>
          <Buddy />
        </aside>
      </div>
    </>
  );
}
type Message = { role: "user" | "assistant"; text: string; source?: string };
export function Assistant() {
  const { data } = useStore();
  const [searchParams] = useSearchParams();
  const [input, setInput] = useState(() => (searchParams.get("q") || "").slice(0, 500));
  const [messages, setMessages] = useState<Message[]>([]);
  function send(q: string) {
    if (!q.trim()) return;
    const lower = q.toLowerCase();
    const source = /password|security|code|mfa/.test(lower)
      ? "security-doc"
      : /remote|stipend|equipment/.test(lower)
        ? "remote"
        : /engineering|review/.test(lower)
          ? "engineering-doc"
          : /culture|values/.test(lower)
            ? "handbook"
            : "";
    const doc = data.documents.find(
      (d) => d.id === source && d.status === "Sample content",
    );
    setMessages((s) => [
      ...s,
      { role: "user", text: q },
      {
        role: "assistant",
        text:
          doc?.content ||
          "There isn’t an approved answer in the sample documents. Bring this question to your buddy or People & Culture team.",
        source: doc?.id,
      },
    ]);
    setInput("");
  }
  return (
    <>
      <PageHeading
        title="A little help, whenever you need it"
        description="Explore the sample company handbook with IGRIS."
      />
      <div className="assistant-demo-note">
        Interactive demo · scripted document matching, not live AI.
      </div>
      <section className="chat panel">
        <div className="chat-messages" aria-live="polite">
          {!messages.length && (
            <div className="chat-welcome">
              <img src="/igris-logo.png" alt="" />
              <h2>What’s on your mind, Maya?</h2>
              <p>Start with a question about getting settled.</p>
              <div className="suggestions">
                {[
                  "What is our remote equipment stipend?",
                  "How do I keep my account secure?",
                  "What are our company values?",
                ].map((q) => (
                  <button key={q} onClick={() => send(q)}>
                    {q}
                    <ArrowRight size={16} />
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div className={"message " + m.role} key={i}>
              <b>{m.role === "user" ? "You" : "IGRIS · demo"}</b>
              <p>{m.text}</p>
              {m.source && (
                <Link
                  className="source-link"
                  to={"/learn/resources#" + m.source}
                >
                  Read source document →
                </Link>
              )}
            </div>
          ))}
        </div>
        <form
          className="chat-input"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <input
            aria-label="Your question"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about getting started…"
            maxLength={2000}
          />
          <button
            className="btn primary"
            disabled={!input.trim()}
            aria-label="Send question"
          >
            <Send size={19} />
          </button>
        </form>
      </section>
    </>
  );
}
export function Resources() {
  const { data } = useStore();
  const [q, setQ] = useState("");
  return (
    <>
      <PageHeading
        title="Useful things, in one place"
        description="Your handbook and the everyday details worth keeping close."
      />
      <SearchField
        value={q}
        onChange={setQ}
        placeholder="Search sample resources"
      />
      <div className="resource-grid">
        {data.documents
          .filter(
            (d) =>
              d.status === "Sample content" &&
              (d.title + " " + d.content)
                .toLowerCase()
                .includes(q.toLowerCase()),
          )
          .map((d) => (
            <article
              className="panel card-pad resource-card"
              id={d.id}
              key={d.id}
            >
              <BookOpen size={25} />
              <Badge>{d.category}</Badge>
              <h2>{d.title}</h2>
              <p>{d.content}</p>
              <button
                className="btn"
                onClick={() => downloadText(d.title + ".txt", d.content)}
              >
                Download sample
              </button>
            </article>
          ))}
      </div>
    </>
  );
}
export function Profile() {
  const { data, setData, notify, person } = useJourney();
  const [profile, setProfile] = useState(data.profile);
  return (
    <>
      <PageHeading
        title="A little about you"
        description="Help teammates put a person to the name."
      />
      <form
        className="panel card-pad profile-form"
        onSubmit={(e) => {
          e.preventDefault();
          setData((s) => ({ ...s, profile }));
          notify("Your demo profile has been updated.");
        }}
      >
        <div className="buddy">
          <Avatar name="Maya Lin" />
          <div>
            <h2>Maya Lin</h2>
            <p>{person.role}</p>
          </div>
        </div>
        <label>
          Pronouns
          <input
            value={profile.pronouns}
            onChange={(e) =>
              setProfile({ ...profile, pronouns: e.target.value })
            }
          />
        </label>
        <label>
          Location
          <input
            value={profile.location}
            onChange={(e) =>
              setProfile({ ...profile, location: e.target.value })
            }
          />
        </label>
        <label>
          About you
          <textarea
            rows={4}
            value={profile.about}
            onChange={(e) => setProfile({ ...profile, about: e.target.value })}
          />
        </label>
        <button className="btn primary">Save profile</button>
      </form>
    </>
  );
}
