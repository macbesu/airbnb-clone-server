import { User } from '../../../entity/User';
import * as faker from 'faker';

import { 
  duplicateEmail,
  emailNotLongEnough, 
  invalidEmail, 
  passwordNotLongEnough,
} from './errorMessages';
import { createTypeormConn } from '../../../utils/createTypeormConn';
import { Connection } from 'typeorm';
import { TestClient } from '../../../utils/TestClient';
  
const email = faker.internet.email();
const password = faker.internet.password();

let conn: Connection;
beforeAll(async () => {
  conn = await createTypeormConn();
});

afterAll(async () => {
  conn.close();
}); 

describe("Register user", async () => {
  it('check for duplicate emails', async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    // make sure we can register a user
    const res = await client.register(email, password); 
    expect(res.data).toEqual({ register: null });
    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);

    const res2: any = await client.register(email, password);
    expect(res2.data.register).toHaveLength(1);
    expect(res2.data.register[0]).toEqual({
      path: 'email',
      message: duplicateEmail,
    });
  });

  it('check bad email', async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const res3: any = await client.register("b", password);
    expect(res3.data).toEqual({
      register: [
        {
          path: 'email',
          message: emailNotLongEnough,
        },
        {
          path: 'email',
          message: invalidEmail,
        },
      ],
    });
  });
  
  it('check bad password', async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const res4: any = await client.register(email, 'ad');
    expect(res4.data).toEqual({
      register: [
        {
          path: 'password',
          message: passwordNotLongEnough,
        },
      ],
    });
  });

  it('check bad email and bad password', async () => {
    // catch bad email and bad email
    const client = new TestClient(process.env.TEST_HOST as string);
    const res5: any = await client.register('em', 'ad');
    expect(res5.data).toEqual({
      register: [
        {
          path: 'email',
          message: emailNotLongEnough,
        },
        {
          path: 'email',
          message: invalidEmail,
        },
        {
          path: 'password',
          message: passwordNotLongEnough,
        },
      ],
    });
  });
});
