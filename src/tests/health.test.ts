import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import request from 'supertest';
import { HTTP_STATUS } from '../constants';
import { buildTestApp } from './helpers/test-setup';

const app = buildTestApp();

describe('Health check', () => {
  it('should return HTTP 200 with status, uptime, and timestamp', async () => {
    const response = await request(app).get('/health').expect(HTTP_STATUS.OK);

    assert.equal(response.body.status, 'ok');
    assert.equal(typeof response.body.uptime, 'number');
    assert.ok(response.body.timestamp);
    assert.doesNotThrow(() => new Date(response.body.timestamp as string));
  });
});
