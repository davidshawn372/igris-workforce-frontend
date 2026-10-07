import { Typewriter } from "./Typewriter";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  BookOpen,
  Check,
  Layers3,
  Users,
} from "lucide-react";
import { useStore } from "./store";
import "./landing.css";

export function Landing() {
  const { data } = useStore();
  const [motion, setMotion] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="igris-site">
      <section className="compute-hero">
        <div className="compute-grid" aria-hidden="true" />
        <header className="compute-nav">
          <Link to="/" className="compute-brand">
            <img src="/igris-logo.png" alt="" />
            IGRIS <sup>WORKFORCE</sup>
          </Link>
          <button className="compute-menu" aria-expanded={menuOpen} aria-controls="product-navigation" onClick={() => setMenuOpen(!menuOpen)}>Menu {menuOpen ? '−' : '+'}</button>
          <nav id="product-navigation" className={menuOpen ? 'is-open' : ''} aria-label="Product navigation" onClick={() => setMenuOpen(false)} onKeyDown={event => { if (event.key === 'Escape') { setMenuOpen(false); document.querySelector<HTMLButtonElement>('.compute-menu')?.focus(); } }}>
            <a href="#platform">Platform</a>
            <a href="#process">How it works</a>
            <a href="#experiences">Experiences</a>
            <a href="#knowledge">Knowledge</a>
            <Link to="/billing">Pricing</Link>
            <Link className="compute-mobile-workspace" to="/workspace">Workspace</Link>
          </nav>
          <Link to="/workspace" className="compute-signin">
            Workspace <ArrowUpRight size={14} />
          </Link>
          <Link to="/learn" className="compute-button">
            Explore onboarding
          </Link>
        </header>
        <div className="compute-hero-columns">
          <div className="compute-intro">
            <p className="compute-kicker">
              <span />A better beginning for every new hire
            </p>
            <h1>
              Great people,
              <br />
              <Typewriter text="ready for what’s next." />
            </h1>
            <p className="compute-description">
              Turn company knowledge into a clear, interactive journey.
              <br />
              Give your people the confidence to do their best work.
            </p>
            <div className="compute-actions">
              <Link to="/workspace" className="compute-button">
                Explore the workspace <ArrowUpRight size={16} />
              </Link>
              <Link to="/learn" className="compute-text-link">
                See the employee experience <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <div className="compute-art" aria-hidden="true">
            <img
              className="compute-tree"
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tree-uAia6REvB137CQyHFCf0za3O6h2zKO.png"
              alt=""
            />
            {motion && (
              <video
                className="compute-motion"
                autoPlay
                muted
                loop
                playsInline
                aria-hidden="true"
                tabIndex={-1}
                poster="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tree-uAia6REvB137CQyHFCf0za3O6h2zKO.png"
              >
                <source
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bg-hero-0BnFGdr81Ifnj3WbBZoNt1KE4D5DMT.mp4"
                  type="video/mp4"
                />
              </video>
            )}
          </div>
        </div>
        <div className="compute-facts">
          <div>
            <strong>01 → 30</strong>
            <span>From first day to finding your rhythm</span>
          </div>
          <div>
            <strong>2 views</strong>
            <span>One workspace. Both sides of onboarding.</span>
          </div>
          <div>
            <strong>{data.flows.length} paths</strong>
            <span>Role-specific journeys in the demo</span>
          </div>
        </div>
        <div className="compute-bottom">
          <button className="motion-toggle" onClick={() => setMotion(!motion)}>
            {motion ? "Pause motion" : "Play motion"}
          </button>
          <span>Built around people. Designed for progress.</span>
          <a href="#platform">Discover IGRIS ↓</a>
        </div>
      </section>
      <section className="compute-section" id="platform">
        <div className="section-number">01 / THE PLATFORM</div>
        <div className="compute-section-heading">
          <h2>
            Less figuring it out.
            <br />
            More moving forward.
          </h2>
          <p>
            A handbook is a starting point. IGRIS brings the next step into
            focus—with lessons, practical tasks, and people who can help.
          </p>
        </div>
        <div className="compute-feature-grid">
          {[
            [
              BookOpen,
              "Knowledge with direction",
              "Give company resources a home, then connect them to the work a new hire needs to learn.",
            ],
            [
              Layers3,
              "A path for every role",
              "Arrange lessons, checklists, quizzes, and practice into a journey that makes sense.",
            ],
            [
              Users,
              "Support where it matters",
              "See completion and requests for help, so managers know where a conversation is needed.",
            ],
          ].map(([Icon, title, description]) => {
            const C = Icon as typeof BookOpen;
            return (
              <article key={String(title)}>
                <C size={26} />
                <h3>{String(title)}</h3>
                <p>{String(description)}</p>
              </article>
            );
          })}
        </div>
      </section>
      <section className="compute-section" id="process">
        <div className="section-number">02 / HOW IT WORKS</div>
        <h2>
          Prepare. Guide.
          <br />
          Grow together.
        </h2>
        <div className="compute-process">
          {[
            [
              "01",
              "Build your journey",
              "Choose modules, add your resources, and organize the first weeks.",
            ],
            [
              "02",
              "Welcome your people",
              "Assign a role-specific path and a buddy. Give every new hire a clear place to begin.",
            ],
            [
              "03",
              "Keep progress moving",
              "Review learning progress, respond to questions, and support the next step.",
            ],
          ].map(([number, title, copy]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="compute-section" id="experiences">
        <div className="section-number">03 / TWO CONNECTED EXPERIENCES</div>
        <div className="compute-section-heading">
          <h2>
            Your team.
            <br />
            Their next chapter.
          </h2>
          <p>
            One product, designed around the people who organize onboarding and
            the people going through it.
          </p>
        </div>
        <div className="compute-portals">
          <Link to="/workspace">
            <span>FOR PEOPLE TEAMS</span>
            <h3>
              Make every welcome
              <br />
              feel considered.
            </h3>
            <ul>
              <li>
                <Check size={15} />
                Build and assign journeys
              </li>
              <li>
                <Check size={15} />
                Track completion and support needs
              </li>
              <li>
                <Check size={15} />
                Organize company knowledge
              </li>
            </ul>
            <b>
              Open company workspace <ArrowUpRight size={20} />
            </b>
          </Link>
          <Link to="/learn">
            <span>FOR NEW TEAMMATES</span>
            <h3>
              A clear next step.
              <br />A confident start.
            </h3>
            <ul>
              <li>
                <Check size={15} />
                Follow your personal learning path
              </li>
              <li>
                <Check size={15} />
                Practice with interactive modules
              </li>
              <li>
                <Check size={15} />
                Find resources and your buddy
              </li>
            </ul>
            <b>
              Open employee portal <ArrowUpRight size={20} />
            </b>
          </Link>
        </div>
      </section>
      <section className="compute-section compute-knowledge" id="knowledge">
        <div>
          <div className="section-number">04 / KNOWLEDGE THAT HELPS</div>
          <h2>
            The answer.
            <br />
            And the next step.
          </h2>
          <p>
            Explore how an onboarding assistant can connect questions with
            relevant company resources.
          </p>
          <Link to="/learn/assistant" className="compute-button">
            Try the assistant demo <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="compute-conversation">
          <span>IGRIS / ASSISTANT PREVIEW</span>
          <p className="sample-question">
            Where do I start with my first week?
          </p>
          <p>
            Start with your assigned journey. Your welcome lesson introduces the
            team, and your checklist walks through the essentials.
          </p>
          <Link to="/learn/journey">
            <BookOpen size={16} /> Open my journey <ArrowRight size={15} />
          </Link>
          <small>
            Scripted preview · Company AI connection is not yet enabled
          </small>
        </div>
      </section>
      <section className="compute-final">
        <p>Your next great teammate starts here.</p>
        <h2>
          Make the first day
          <br />
          the start of something good.
        </h2>
        <Link to="/workspace" className="compute-button">
          Explore IGRIS Workforce <ArrowUpRight size={16} />
        </Link>
        <span>Interactive frontend demo · Sample workspace</span>
      </section>
      <footer className="compute-footer">
        <Link to="/" className="compute-brand">
          IGRIS <sup>WORKFORCE</sup>
        </Link>
        <p>Good beginnings. Better teams.</p>
        <a href="#platform">Back to platform ↑</a>
        <span>© {new Date().getFullYear()} IGRIS Technologies</span>
      </footer>
    </div>
  );
}
