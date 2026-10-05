export type Department = "Engineering" | "Product" | "Sales" | "Operations";
export type ModuleKind = "Lesson" | "Checklist" | "Quiz" | "Scenario";
export interface Module {
  id: string;
  title: string;
  kind: ModuleKind;
  minutes: number;
  day: number;
  required: boolean;
  description: string;
}
export interface Flow {
  id: string;
  title: string;
  department: Department;
  description: string;
  days: number;
  published: boolean;
  modules: Module[];
}
export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: Department;
  flowId: string;
  completed: string[];
  start: string;
  buddy: string;
  needsHelp: boolean;
  color: string;
}
export type Stage =
  "Applied" | "Review" | "Shortlisted" | "Interview" | "Offer" | "Hired";
export interface Candidate {
  id: string;
  name: string;
  role: string;
  jobId: string;
  location: string;
  experience: string;
  stage: Stage;
  skills: string[];
  note: string;
  color: string;
}
export interface Job {
  id: string;
  title: string;
  department: Department;
  location: string;
  type: string;
  salary: string;
  description: string;
  status: "Published" | "Draft";
}
export interface KnowledgeDocument {
  id: string;
  title: string;
  category: string;
  scope: string;
  status: "Sample content" | "Pending backend";
  content: string;
  updated: string;
}
export interface Activity {
  id: string;
  text: string;
  detail: string;
  time: string;
  initials: string;
  color: string;
}
export interface WorkspaceState {
  version: 1;
  company: string;
  employees: Employee[];
  flows: Flow[];
  candidates: Candidate[];
  jobs: Job[];
  documents: KnowledgeDocument[];
  activity: Activity[];
  checklist: Record<string, string[]>;
  assistantTone: string;
  profile: { pronouns: string; location: string; about: string };
}
/** Integration boundary. Implement this contract with your FastAPI client. No credentials belong in the frontend. */
export interface WorkforceRepository {
  load(): WorkspaceState;
  save(state: WorkspaceState): void;
  reset(): WorkspaceState;
}
