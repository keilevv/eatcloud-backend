import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import request from 'supertest';
import {
  buildTestApp,
  setupTestDatabase,
  teardownTestDatabase,
} from './helpers/test-setup';
import { createTestUserInput } from './helpers/test-utils';
import { dashboardCache } from '../utils/DashboardCache';

const app = buildTestApp();

describe('Dashboard endpoints', () => {
  let authToken = '';

  before(async () => {
    await setupTestDatabase();
    await dashboardCache.load();

    const userInput = createTestUserInput();

    await request(app).post('/api/auth/register').send(userInput).expect(201);

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: userInput.email,
        password: userInput.password,
      })
      .expect(200);

    authToken = loginResponse.body.data.token as string;
  });

  after(async () => {
    dashboardCache.clear();
    await teardownTestDatabase();
  });

  it('should reject unauthenticated dashboard requests', async () => {
    const response = await request(app)
      .get('/api/dashboard/overview')
      .expect(401);

    assert.equal(response.body.success, false);
  });

  it('should return dashboard overview for authenticated users', async () => {
    const response = await request(app)
      .get('/api/dashboard/overview')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    assert.equal(response.body.success, true);
    assert.ok(response.body.data.kpis);
    assert.equal(typeof response.body.data.kpis.totalCancelled, 'number');
    assert.ok(response.body.data.summary);
  });

  it('should return cancellation analysis with rankings', async () => {
    const response = await request(app)
      .get('/api/dashboard/cancellation-analysis?donor=exito&limit=5')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    assert.equal(response.body.success, true);
    assert.ok(Array.isArray(response.body.data.donors));
    assert.ok(Array.isArray(response.body.data.topDonors));
    assert.ok(response.body.data.topDonors.length <= 5);
  });

  it('should return predictive analysis datasets', async () => {
    const response = await request(app)
      .get('/api/dashboard/predictive-analysis?riskLevel=HIGH')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    assert.equal(response.body.success, true);
    assert.ok(Array.isArray(response.body.data.scatterPlot));
    assert.ok(Array.isArray(response.body.data.semaphoreMap));
  });

  it('should return beneficiary analysis', async () => {
    const response = await request(app)
      .get('/api/dashboard/beneficiaries?beneficiaryType=T1')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    assert.equal(response.body.success, true);
    assert.ok(response.body.data.visualization);
    assert.ok(Array.isArray(response.body.data.locations));
  });

  it('should return ecosystem data with map layers', async () => {
    const response = await request(app)
      .get('/api/dashboard/ecosystem')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    assert.equal(response.body.success, true);
    assert.ok(Array.isArray(response.body.data.mapLayers));
    assert.ok(response.body.data.typologies);
  });

  it('should return filter options', async () => {
    const response = await request(app)
      .get('/api/dashboard/filter-options')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    assert.equal(response.body.success, true);
    assert.ok(Array.isArray(response.body.data.donors));
    assert.ok(Array.isArray(response.body.data.riskLevels));
  });

  it('should refresh dashboard cache when authenticated', async () => {
    assert.equal(dashboardCache.isLoaded(), true);

    const response = await request(app)
      .post('/api/dashboard/cache/refresh')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    assert.equal(response.body.success, true);
    assert.equal(response.body.data.refreshed, true);
    assert.equal(dashboardCache.isLoaded(), true);
  });

  it('should reject invalid dashboard query parameters', async () => {
    const response = await request(app)
      .get('/api/dashboard/overview?riskLevel=INVALID&limit=-1')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(400);

    assert.equal(response.body.success, false);
    assert.equal(response.body.message, 'Validation failed');
  });
});
