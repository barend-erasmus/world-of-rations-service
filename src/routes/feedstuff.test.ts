// Imports
import { expect } from 'chai';
import * as jwt from 'jsonwebtoken';
import 'mocha';
import * as request from 'supertest';
import * as uuid from 'uuid';
import express = require("express");

import { RepositoryFactory } from './../repositories/mock/factory';

// Imports app
import { WorldOfRationsApi } from './../app';

let api;

const token = jwt.sign({ username: 'User1' }, 'worldofrationskey', {
  audience: 'worldofrations.com',
  expiresIn: 3600,
  issuer: 'worldofrations.com',
  jwtid: uuid.v4(),
});

describe('GET /api//feedstuff/listFeedstuffs', () => {

  beforeEach(() => {
    api = new WorldOfRationsApi(new RepositoryFactory(), express(), 8000);
  });

  it('should respond with status code 200 where not authenticated', (done: () => void) => {
    request(api.getApp())
      .get('/api/feedstuff/listFeedstuffs')
      .expect(200, done);
  });

  it('should respond with status code 200 where authenticated', (done: () => void) => {
    request(api.getApp())
      .get('/api/feedstuff/listFeedstuffs')
      .set({
        Authorization: 'Bearer ' + token,
      })
      .expect(200, done);
  });
});

describe('GET /api//feedstuff/listUserFeedstuffs', () => {

  beforeEach(() => {
    api = new WorldOfRationsApi(new RepositoryFactory(), express(), 8000);
  });

  it('should respond with status code 401 where not authenticated', (done: () => void) => {
    request(api.getApp())
      .get('/api/feedstuff/listUserFeedstuffs')
      .expect(401, done);
  });

  it('should respond with status code 200 where authenticated', (done: () => void) => {
    request(api.getApp())
      .get('/api/feedstuff/listUserFeedstuffs')
      .set({
        Authorization: 'Bearer ' + token,
      })
      .expect(200, done);
  });
});
