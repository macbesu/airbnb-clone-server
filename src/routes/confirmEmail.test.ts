import fetch from 'node-fetch';

test('sends invalid back if bad id sent', async () => {
  const res = await fetch(`${process.env.TEST_HOST}/confirm/12083`);
  const text = await res.text();
  expect(text).toEqual('invalid'); 
});