import { createTypeormConn } from '../../../utils/createTypeormConn';
import { User } from '../../../entity/User';
import { Connection } from 'typeorm';
import { TestClient } from '../../../utils/TestClient';

let conn: Connection;
const email = 'ivan@gmail.com';
const password = 'jiqirenbinbgi';
let userId: string;

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

describe('logout', async () => {
  test('multiple sessions', async () => {
    // computer 1
    const sess1 = new TestClient(process.env.TEST_HOST as string);
    // computer 2
    const sess2 = new TestClient(process.env.TEST_HOST as string);

    await sess1.login(email, password);
    await sess2.login(email, password);
    expect(await sess1.me()).toEqual(await sess2.me());
    await sess1.logout();
    expect(await sess1.me()).toEqual(await sess2.me());
  });

  test('single session', async () => {
    const client = new TestClient(process.env.TEST_HOST as string);

    await client.login(email, password);

    const res = await client.me();

    expect(res.data).toEqual({
      me: {
        id: userId,
        email,
      }
    });

    await client.logout();
    
    const res2 = await client.me();
  
    expect(res2.data.me).toBeNull();
  });
});