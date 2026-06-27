import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, it } from 'node:test';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { appConfig } from '../config';
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from '../constants';
import { User } from '../models';
import {
  buildTestApp,
  cleanupUsers,
  setupTestDatabase,
  teardownTestDatabase,
} from './helpers/test-setup';
import { createTestUserInput } from './helpers/test-utils';

const app = buildTestApp();

describe('Authentication endpoints', () => {
  before(async () => {
    await setupTestDatabase();
  });

  beforeEach(async () => {
    await cleanupUsers();
  });

  after(async () => {
    await teardownTestDatabase();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user and return HTTP 201', async () => {
      const userInput = createTestUserInput();

      const response = await request(app)
        .post('/api/auth/register')
        .send(userInput)
        .expect(HTTP_STATUS.CREATED);

      assert.equal(response.body.success, true);
      assert.equal(response.body.message, SUCCESS_MESSAGES.USER_REGISTERED);
      assert.equal(response.body.data.name, userInput.name);
      assert.equal(response.body.data.email, userInput.email);
      assert.ok(response.body.data.id);
      assert.equal(response.body.data.password, undefined);
    });

    it('should store the password as a bcrypt hash', async () => {
      const userInput = createTestUserInput();

      await request(app).post('/api/auth/register').send(userInput).expect(201);

      const storedUser = await User.scope('withPassword').findOne({
        where: { email: userInput.email },
      });

      assert.ok(storedUser);
      assert.ok(storedUser.password.startsWith('$2'));
      assert.notEqual(storedUser.password, userInput.password);
    });

    it('should reject duplicate emails with HTTP 409', async () => {
      const userInput = createTestUserInput();

      await request(app).post('/api/auth/register').send(userInput).expect(201);

      const response = await request(app)
        .post('/api/auth/register')
        .send(userInput)
        .expect(HTTP_STATUS.CONFLICT);

      assert.equal(response.body.success, false);
      assert.equal(response.body.message, ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
      assert.deepEqual(response.body.errors, []);
    });

    it('should return validation errors for invalid input', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'A',
          email: 'invalid-email',
          password: 'short',
        })
        .expect(HTTP_STATUS.BAD_REQUEST);

      assert.equal(response.body.success, false);
      assert.equal(response.body.message, ERROR_MESSAGES.VALIDATION_FAILED);
      assert.ok(Array.isArray(response.body.errors));
      assert.ok(response.body.errors.length > 0);
      assert.ok(
        response.body.errors.every(
          (error: { field: string; message: string }) =>
            typeof error.field === 'string' &&
            typeof error.message === 'string',
        ),
      );
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials and return a JWT', async () => {
      const userInput = createTestUserInput();

      await request(app).post('/api/auth/register').send(userInput).expect(201);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userInput.email,
          password: userInput.password,
        })
        .expect(HTTP_STATUS.OK);

      assert.equal(response.body.success, true);
      assert.equal(response.body.message, SUCCESS_MESSAGES.LOGIN_SUCCESS);
      assert.ok(response.body.data.token);
      assert.equal(response.body.data.user.email, userInput.email);
      assert.equal(response.body.data.user.name, userInput.name);
      assert.equal(response.body.data.user.password, undefined);

      const decoded = jwt.verify(
        response.body.data.token,
        appConfig.jwt.secret,
      ) as { userId: string; email: string };

      assert.equal(decoded.email, userInput.email);
      assert.equal(decoded.userId, response.body.data.user.id);
    });

    it('should reject invalid credentials with HTTP 401', async () => {
      const userInput = createTestUserInput();

      await request(app).post('/api/auth/register').send(userInput).expect(201);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userInput.email,
          password: 'wrongPassword123',
        })
        .expect(HTTP_STATUS.UNAUTHORIZED);

      assert.equal(response.body.success, false);
      assert.equal(response.body.message, ERROR_MESSAGES.INVALID_CREDENTIALS);
      assert.deepEqual(response.body.errors, []);
    });

    it('should reject unknown email with HTTP 401', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'unknown@example.com',
          password: 'securePass123',
        })
        .expect(HTTP_STATUS.UNAUTHORIZED);

      assert.equal(response.body.success, false);
      assert.equal(response.body.message, ERROR_MESSAGES.INVALID_CREDENTIALS);
    });

    it('should return validation errors for invalid login input', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'not-an-email',
          password: '',
        })
        .expect(HTTP_STATUS.BAD_REQUEST);

      assert.equal(response.body.success, false);
      assert.equal(response.body.message, ERROR_MESSAGES.VALIDATION_FAILED);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return the authenticated user profile', async () => {
      const userInput = createTestUserInput();

      await request(app).post('/api/auth/register').send(userInput).expect(201);

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: userInput.email,
          password: userInput.password,
        })
        .expect(HTTP_STATUS.OK);

      const token = loginResponse.body.data.token as string;

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(HTTP_STATUS.OK);

      assert.equal(response.body.success, true);
      assert.equal(response.body.data.email, userInput.email);
      assert.equal(response.body.data.name, userInput.name);
      assert.ok(response.body.data.id);
      assert.equal(response.body.data.password, undefined);
    });

    it('should reject requests without a token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(HTTP_STATUS.UNAUTHORIZED);

      assert.equal(response.body.success, false);
      assert.equal(response.body.message, ERROR_MESSAGES.TOKEN_MISSING);
    });

    it('should reject malformed tokens', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid.token.value')
        .expect(HTTP_STATUS.UNAUTHORIZED);

      assert.equal(response.body.success, false);
      assert.equal(response.body.message, ERROR_MESSAGES.INVALID_TOKEN);
    });

    it('should reject expired tokens', async () => {
      const userInput = createTestUserInput();

      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userInput)
        .expect(201);

      const expiredToken = jwt.sign(
        {
          userId: registerResponse.body.data.id,
          email: userInput.email,
        },
        appConfig.jwt.secret,
        { expiresIn: '-1s' },
      );

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(HTTP_STATUS.UNAUTHORIZED);

      assert.equal(response.body.success, false);
      assert.equal(response.body.message, ERROR_MESSAGES.TOKEN_EXPIRED);
    });
  });
});
