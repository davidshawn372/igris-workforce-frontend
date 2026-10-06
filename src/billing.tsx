import { createContext, useContext, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Check, LockKeyhole, Download } from "lucide-react";
import { PageHeading } from "./ui";
import { useStore, progress, downloadText } from "./store";

// UI demonstration only. Production entitlements must come from an authenticated
// server and be enforced on every protected API, never from browser storage.
const PlanContext = createContext({ pro: false, setPro: (_value: boolean) => {} });
export function PlanProvider({ children }: { children: ReactNode }) {
  const [pro, setPro] = useState(false);
  return <PlanContext.Provider value={{ pro, setPro }}>{children}</PlanContext.Provider>;
}
export function ProGate({ children }: { children: ReactNode }) {
  const { pro } = useContext(PlanContext);
  if (pro) return <><div className="plan-notice">Pro demo active · No payment made <Link to="/billing">Manage plan</Link></div>{children}<ReportExport /></>;
  return <><PageHeading title="See where your team needs support" description="Keep everyday progress tracking free. Unlock a deeper team view with IGRIS Pro." /><section className="panel padded plan-locked"><LockKeyhole size={30}/><span className="plan-eyebrow">IGRIS PRO</span><h2>A clearer picture of onboarding.</h2><p>Compare completion across departments, review journey stages, and export a progress report for your team.</p><strong>$7.99 <small>USD / workspace / month</small></strong><Link className="btn primary" to="/billing">Explore Pro</Link><small>Employee learning, basic progress, and core onboarding stay free.</small></section></>;
}
function ReportExport() {
  const { data, notify } = useStore();
  function exportReport() {
    const cell = (value: string | number) => '"' + String(value).replace(/^[=+@\-]/, "'$&").replace(/"/g, '""') + '"';
    const rows = data.employees.map(person => {
      const flow = data.flows.find(item => item.id === person.flowId);
      const completion = progress(person, flow);
      return [person.name, person.department, flow?.title || "Unassigned", completion.count, completion.total, completion.percent];
    });
    downloadText("igris-progress-report.csv", "\uFEFF" + [["Name", "Department", "Journey", "Completed", "Total", "Percent"], ...rows].map(row => row.map(cell).join(",")).join("\r\n"), "text/csv;charset=utf-8");
    notify("Progress report downloaded from your demo workspace.");
  }
  return <section className="panel padded plan-export"><div><h2>Take progress into your next check-in</h2><p>Export the current workspace's completion data as CSV.</p></div><button className="btn primary" onClick={exportReport}><Download size={16}/> Export progress report</button></section>;
}
export function Billing() {
  const { pro, setPro } = useContext(PlanContext);
  const { notify } = useStore();
  const [confirmed, setConfirmed] = useState(false);
  return <><PageHeading eyebrow="SIMPLE, TEAM-WIDE PRICING" title="Start free. Grow with clarity." description="One company plan. No charge for employees to follow their learning journey."/>
    <div className="plan-grid">
      <section className="panel padded plan-card"><span className="plan-eyebrow">FREE</span><h2>A better first day</h2><div className="plan-price">$0</div><p>Everything you need to explore a complete onboarding experience.</p><ul>{["Build and assign onboarding journeys", "Interactive lessons, checklists and quizzes", "Employee portal and basic progress tracking", "Knowledge library and sample assistant", "Hiring and people workspace"].map(item=><li key={item}><Check size={16}/>{item}</li>)}</ul><Link className="btn" to="/onboarding">Explore free features</Link></section>
      <section className="panel padded plan-card pro-card"><span className="plan-eyebrow">IGRIS PRO · COMPANY WORKSPACE</span><h2>Know where to focus</h2><div className="plan-price">$7.99 <small>USD / month</small></div><p>One subscription per workspace. Includes all free features, plus:</p><ul>{["Completion comparisons across departments", "Journey-stage analytics for managers", "Downloadable employee progress reports"].map(item=><li key={item}><Check size={16}/>{item}</li>)}</ul>
      {pro ? <><Link className="btn primary" to="/insights">Open Pro insights</Link><button className="text-button" onClick={()=>{setPro(false);setConfirmed(false);notify("Returned to the free demo. Your onboarding data is unchanged.");}}>End Pro demo</button></> : <><label className="plan-confirm"><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/> I understand this is a demo, with no charge or subscription.</label><button className="btn primary" disabled={!confirmed} onClick={()=>{setPro(true);notify("Pro demo unlocked for this session. No charge made.");}}>Try Pro demo — no payment</button></>}
      </section>
    </div><section className="panel padded plan-faq"><h2>Before you upgrade</h2><details><summary>Is this a real subscription?</summary><p>Not yet. $7.99 USD per workspace per month is the proposed plan. This frontend does not collect card details or charge money. Your backend team must connect secure checkout before launch.</p></details><details><summary>Do new hires pay?</summary><p>No. Companies pay for manager reporting. Employees can use assigned lessons, checklists and quizzes without a paid account.</p></details><details><summary>What happens when the demo ends?</summary><p>Only Pro reporting locks again. Your people, journeys, and learning progress remain available. Refreshing the page also resets the demo entitlement.</p></details></section></>;
}
