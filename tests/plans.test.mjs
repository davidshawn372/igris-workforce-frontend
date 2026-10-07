import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PLANS, capacityMessage } from '../src/plans.ts';

test('approved prices and Free capacity', () => {
  assert.equal(PLANS.team.price, 16);
  assert.equal(PLANS.business.price, 39);
  assert.equal(PLANS.business.employees, 150);
  assert.equal(PLANS.starter.price, 7.99);
  assert.equal(PLANS.free.employees, 5);
  assert.equal(PLANS.free.journeys, 1);
  assert.equal(PLANS.free.managers, 1);
});
test('Business allows the 150th employee but directs additional capacity to Enterprise', () => {
  assert.equal(capacityMessage('business', 'employees', 149), null);
  assert.match(capacityMessage('business', 'employees', 150), /Enterprise/);
  assert.equal(Object.hasOwn(PLANS, 'enterprise'), false, 'custom plan is not a self-service entitlement');
});
test('each tier accepts capacity below limit and blocks at or above it', () => {
  for (const plan of Object.keys(PLANS)) for (const resource of ['employees', 'journeys']) {
    const limit = PLANS[plan][resource];
    assert.equal(capacityMessage(plan, resource, limit - 1), null);
    assert.match(capacityMessage(plan, resource, limit), /Open Plans/);
    assert.match(capacityMessage(plan, resource, limit + 10), /Existing data stays available/);
  }
});
test('both employee creation routes and publication use quotas', () => {
  for (const file of ['company', 'hiring']) {
    const source = readFileSync(new URL('../src/' + file + '.tsx', import.meta.url), 'utf8');
    assert.match(source, /capacityMessage\(plan, 'employees', data.employees.length\)/);
    assert.match(source, /if \(limit\) \{ notify\(limit\); return; \}/);
  }
  const source = readFileSync(new URL('../src/onboarding.tsx', import.meta.url), 'utf8');
  assert.match(source, /if \(!flow.published && limit\)/);
});
