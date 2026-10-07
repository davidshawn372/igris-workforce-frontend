export type PlanId = 'free' | 'starter' | 'team' | 'business';
export const PLANS = {
  free: { name: 'Free', price: 0, employees: 5, journeys: 1, managers: 1 },
  starter: { name: 'Starter', price: 7.99, employees: 15, journeys: 5, managers: 1 },
  team: { name: 'Team', price: 16, employees: 50, journeys: 20, managers: 5 },
  business: { name: 'Business', price: 39, employees: 150, journeys: 20, managers: 5 },
} as const;
export function capacityMessage(plan: PlanId, resource: 'employees' | 'journeys', count: number): string | null {
  const limit = PLANS[plan][resource];
  return count >= limit ? `${PLANS[plan].name} allows ${limit} ${resource === 'journeys' ? 'published onboarding journeys' : 'employees'}. Open Plans to choose more capacity.${plan === 'business' ? ' For more than 150 employees or custom limits, see Enterprise.' : ''} Existing data stays available.` : null;
}
