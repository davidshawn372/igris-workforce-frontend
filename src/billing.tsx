import { useState, type ReactNode } from "react";
import { usePlan } from './plan-context';
import { PLANS, type PlanId } from './plans';
export { PlanProvider } from './plan-context';
import { Link } from "react-router-dom";
import { Check, LockKeyhole, Download } from "lucide-react";
import { PageHeading } from "./ui";
import { useStore, progress, downloadText } from "./store";

// UI demonstration only. Production entitlements must come from an authenticated
// server and be enforced on every protected API, never from browser storage.
export function ProGate({ children }: { children: ReactNode }) {
  const { plan } = usePlan();
  if (plan !== 'free')
    return (
      <>
        <div className="plan-notice">
          {PLANS[plan].name} demo active · No payment made{" "}
          <Link to="/billing">Manage plan</Link>
        </div>
        {children}
        <ReportExport />
      </>
    );
  return (
    <>
      <PageHeading
        title="See where your team needs support"
        description="Keep basic progress tracking free. Unlock reporting with Starter, Team or Business."
      />
      <section className="panel padded plan-locked">
        <LockKeyhole size={30} />
        <span className="plan-eyebrow">PAID WORKSPACE PLANS</span>
        <h2>A clearer picture of onboarding.</h2>
        <p>
          Compare completion across departments, review journey stages, and
          export a progress report for your team.
        </p>
        <strong>
          From $7.99 <small>USD / workspace / month</small>
        </strong>
        <Link className="btn primary" to="/billing">
          Explore plans
        </Link>
        <small>
          Free includes 5 employees and 1 published onboarding journey.
        </small>
      </section>
    </>
  );
}
function ReportExport() {
  const { data, notify } = useStore();
  function exportReport() {
    const cell = (value: string | number) =>
      '"' +
      String(value)
        .replace(/^[\s]*[=+@\-]/, "'$&")
        .replace(/"/g, '""') +
      '"';
    const rows = data.employees.map((person) => {
      const flow = data.flows.find((item) => item.id === person.flowId);
      const completion = progress(person, flow);
      return [
        person.name,
        person.department,
        flow?.title || "Unassigned",
        completion.count,
        completion.total,
        completion.percent,
      ];
    });
    downloadText(
      "igris-progress-report.csv",
      "\uFEFF" +
        [
          ["Name", "Department", "Journey", "Completed", "Total", "Percent"],
          ...rows,
        ]
          .map((row) => row.map(cell).join(","))
          .join("\r\n"),
      "text/csv;charset=utf-8",
    );
    notify("Progress report downloaded from your demo workspace.");
  }
  return (
    <section className="panel padded plan-export">
      <div>
        <h2>Take progress into your next check-in</h2>
        <p>Export the current workspace's completion data as CSV.</p>
      </div>
      <button className="btn primary" onClick={exportReport}>
        <Download size={16} /> Export progress report
      </button>
    </section>
  );
}
export function Billing() {
  const { plan, setPlan } = usePlan();
  const { data, notify } = useStore();
  const [confirmed, setConfirmed] = useState(false);
  const published = data.flows.filter(f => f.published).length;
  return (
    <>
      <PageHeading eyebrow="SIMPLE, TEAM-WIDE PRICING" title="Start free. Grow with clarity."
        description="Company workspace pricing. Employees do not pay separately to follow assigned learning." />
      <section className="panel padded">
        <h2>{PLANS[plan].name} demo · current usage</h2>
        <p>{data.employees.length} / {PLANS[plan].employees} employees · {published} / {PLANS[plan].journeys} published journeys</p>
        <p>Existing sample or saved data above your limit stays available. Adding employees or publishing more journeys requires available capacity. Drafts and existing learning progress remain accessible.</p>
        <label className="plan-confirm">
          <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} />
          I understand plan switching is a demo, with no payment or subscription.
        </label>
      </section>
      <div className="plan-grid">
        {(Object.keys(PLANS) as PlanId[]).map(id => {
          const option = PLANS[id];
          return <section key={id} className={'panel padded plan-card' + (id !== 'free' ? ' pro-card' : '')}>
            <span className="plan-eyebrow">{option.name.toUpperCase()}</span>
            <h2>{id === 'free' ? 'A better first day' : id === 'starter' ? 'Room for a small team' : id === 'business' ? 'More room for your company' : 'Grow your workforce'}</h2>
            <div className="plan-price">${option.price.toFixed(id === 'starter' ? 2 : 0)} <small>USD / workspace / month</small></div>
            <ul>
              <li><Check size={16} />Up to {option.employees} employees</li>
              <li><Check size={16} />{option.journeys} published onboarding {option.journeys === 1 ? 'journey' : 'journeys'}</li>
              <li><Check size={16} />Lessons, quizzes, knowledge and basic progress</li>
              <li><Check size={16} />Hiring and people workspace</li>
              {id !== 'free' && <li><Check size={16} />Department comparisons, journey analytics and CSV reports</li>}
            </ul>
            <p>{option.managers} manager {option.managers === 1 ? 'seat' : 'seats'} planned. Manager invitations and seat enforcement require the backend and are not available in this demo.</p>
            <button className="btn primary" disabled={id === plan || !confirmed} onClick={() => {
              setPlan(id);
              notify(option.name + ' demo selected. No charge made; existing data preserved.');
            }}>{id === plan ? 'Current demo plan' : 'Try ' + option.name + ' demo — no payment'}</button>
          </section>;
        })}
      </div>
      <section className="panel padded plan-faq">
        <span className="plan-eyebrow">ENTERPRISE · MORE THAN 150 EMPLOYEES</span>
        <h2>A plan sized around your organisation</h2>
        <div className="plan-price">Custom pricing</div>
        <p>Contact us to discuss employee capacity, manager access, onboarding assistance and support needs. Scope, limits and pricing are agreed individually—not unlimited by default.</p>
        <a className="btn primary" href="mailto:igristechnologies09@gmail.com?subject=IGRIS%20Workforce%20Enterprise%20enquiry&body=Company%20name%3A%20%0AEmployee%20count%3A%20%0AManager%20count%3A%20%0AOnboarding%20and%20support%20needs%3A%20">Contact us about Enterprise</a>
        <p>Or email <a href="mailto:igristechnologies09@gmail.com">igristechnologies09@gmail.com</a>. Opens your email app; your enquiry is only sent when you send the email.</p>
        <p>Enterprise is a proposed offering, not an instant demo upgrade. Shared accounts, manager permissions, backend capacity and support commitments must be agreed and verified before launch.</p>
      </section>
      <section className="panel padded plan-faq">
        <h2>Before you upgrade</h2>
        <details><summary>Is this a real subscription?</summary><p>No. Proposed monthly workspace prices are Starter $7.99, Team $16 and Business $39 USD. Enterprise above 150 employees has custom pricing. This frontend does not charge money. Secure checkout, shared accounts and server-enforced quotas are required before paid launch.</p></details>
        <details><summary>What happens when I return to Free?</summary><p>Existing people, journeys and learning progress are preserved. Paid reporting locks. New employees and new publications are blocked when the Free capacity is reached. Refreshing resets the demo plan to Free, not your saved data.</p></details>
        <details><summary>Why is sample usage above the Free limit?</summary><p>The original demo includes extra examples. They remain accessible so existing work is not lost; the limits apply to adding employees and publishing additional journeys.</p></details>
      </section>
    </>
  );
}
