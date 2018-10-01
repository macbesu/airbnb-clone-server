import { createTypeormConn } from '../../../utils/createTypeormConn';
import { User } from '../../../entity/User';
import { Connection } from 'typeorm';
import { TestClient } from '../../../utils/TestClient';

let userId: string;
let conn: Connection;
const email = 'ivan@gmail.com';
const password = 'jiqirenbinbgi';

beforeAll(async () => {
  conn = await createTypeormConn();
  const user = await User.create({
    email,
    password,
    confirmed: true,
  }).save();
  userId = user.id;
});

afterAll(async () => {
  conn.close();
});

describe('me', async () => {
  test('return null if no cookie', async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const res = await client.me();
  
    expect(res.data.me).toBeNull();
  });

  test('get current user', async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    await client.login(email, password)
    const res = await client.me();

    expect(res.data).toEqual({
      me: {
        id: userId,
        email,
      }
    });
  });
});