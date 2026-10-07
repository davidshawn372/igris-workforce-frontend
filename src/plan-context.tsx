import { createContext, useContext, useState, type ReactNode } from 'react';
import type { PlanId } from './plans';
const PlanContext = createContext({ plan: 'free' as PlanId, setPlan: (_plan: PlanId) => {} });
// Demo only: real entitlements and quotas must be enforced by the server.
export function PlanProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<PlanId>('free');
  return <PlanContext.Provider value={{ plan, setPlan }}>{children}</PlanContext.Provider>;
}
export const usePlan = () => useContext(PlanContext);
