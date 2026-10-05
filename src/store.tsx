import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";
import type {
  WorkspaceState,
  WorkforceRepository,
  Employee,
  Flow,
} from "./types";
import { seed } from "./data";
const KEY = "igris-workforce-demo-v1";
// Migrate the old fictional brand without resetting the user's demo progress.
function migrateDemoBrand(state: WorkspaceState): WorkspaceState {
  const replaceBrand = (value: string) =>
    value
      .replace(/Acme Corporation|Acme Corp|Acme/g, "IGRIS Technologies")
      .replace(/acme\.example/g, "igris.example");
  return {
    ...state,
    company: /^(Acme Corporation|Acme Corp|Acme)$/.test(state.company)
      ? "IGRIS Technologies"
      : state.company,
    employees: state.employees.map((person) => ({
      ...person,
      email: replaceBrand(person.email),
    })),
    documents: state.documents.map((document) => ({
      ...document,
      title: replaceBrand(document.title),
      content: replaceBrand(document.content),
    })),
  };
}
export const demoRepository: WorkforceRepository = {
  load() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || "null");
      if (
        raw?.version === 1 &&
        Array.isArray(raw.employees) &&
        raw.employees.some((x: Employee) => x.id === "maya") &&
        Array.isArray(raw.flows) &&
        Array.isArray(raw.jobs) &&
        Array.isArray(raw.documents)
      )
        return migrateDemoBrand(raw);
    } catch {
      /* A damaged or unavailable browser store starts a clean demo. */
    }
    return seed();
  },
  save(state) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* Memory state remains usable when local storage is unavailable. */
    }
  },
  reset() {
    const state = seed();
    this.save(state);
    return state;
  },
};
interface Context {
  data: WorkspaceState;
  setData: Dispatch<SetStateAction<WorkspaceState>>;
  notify: (message: string) => void;
  toast: string;
  completeModule: (id: string) => void;
  reset: () => void;
}
const Store = createContext<Context | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState(() => demoRepository.load());
  const [toast, setToast] = useState("");
  useEffect(() => demoRepository.save(data), [data]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(t);
  }, [toast]);
  function completeModule(id: string) {
    setData((s) => {
      const maya = s.employees.find((x) => x.id === "maya")!;
      if (maya.completed.includes(id)) return s;
      const module = s.flows
        .find((x) => x.id === maya.flowId)
        ?.modules.find((x) => x.id === id);
      return {
        ...s,
        employees: s.employees.map((x) =>
          x.id === "maya" ? { ...x, completed: [...x.completed, id] } : x,
        ),
        activity: [
          {
            id: crypto.randomUUID(),
            text: "Maya completed a milestone",
            detail: module?.title || "Training module",
            time: "Just now",
            initials: "ML",
            color: "lavender",
          },
          ...s.activity,
        ],
      };
    });
    setToast("Milestone completed. Your progress has been saved in this demo.");
  }
  return (
    <Store.Provider
      value={{
        data,
        setData,
        notify: setToast,
        toast,
        completeModule,
        reset: () => setData(demoRepository.reset()),
      }}
    >
      {children}
    </Store.Provider>
  );
}
export function useStore() {
  const s = useContext(Store);
  if (!s) throw new Error("StoreProvider is required");
  return s;
}
export function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((x) => x[0])
    .join("");
}
export function progress(person: Employee, flow?: Flow) {
  const total = flow?.modules.length || 0;
  const count =
    flow?.modules.filter((m) => person.completed.includes(m.id)).length || 0;
  return {
    count,
    total,
    percent: total ? Math.round((count / total) * 100) : 0,
  };
}
export function downloadText(
  name: string,
  content: string,
  type = "text/plain",
) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
