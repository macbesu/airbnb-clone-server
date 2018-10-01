import * as Redis from 'ioredis';
import fetch from 'node-fetch';
import { Connection } from 'typeorm';

import { createConfirmEmailLink } from './createConfirmEmailLink';
import { createTypeormConn } from '../../../utils/createTypeormConn';
import { User } from '../../../entity/User';

let userId = '';
const redis = new Redis();

let conn: Connection; 

beforeAll(async () => {
  conn = await createTypeormConn();
  const user = await User.create({
    email: 'ivan@gmail.com',
    password: 'jiqirenbinbgi',
  }).save();
  userId = user.id;
});

afterAll(async () => {
  conn.close();
});

test('Make sure it confirms user and clears key in redis', async () => {
  const url = await createConfirmEmailLink(
    process.env.TEST_HOST as string,
    userId as string,
    redis,
  ); 

  const res = await fetch(url);
  const text = await res.text();
  expect(text).toEqual('ok');
  const user = await User.findOne({ where: { id: userId } });
  expect((user as User).confirmed).toBeTruthy();
  const chunks = url.split('/');
  const key = chunks[chunks.length - 1];
  const val = await redis.get(key);
  expect(val).toBeNull();
});

