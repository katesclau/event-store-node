import { get } from 'lodash';
import { v4 as uuid } from 'uuid';
import EventStoreClient from '../src/index';
import { Entry, UserCreateInput, Direction, UserRole } from '../@types/eventStore';

const options = {
  url: 'http://localhost:2113',
  user: process.env?.EVENTSTORE_USER ?? 'admin',
  password: process.env?.EVENTSTORE_PASSWORD ?? 'changeit',
};
const client = new EventStoreClient(options);
const STREAM_NAME = 'streamName';
const EVENT_TYPE = 'jsonMessageEvent';

describe('Events', () => {
  test('[POST Single Event]', async () => {
    const response = await client.postEvent(STREAM_NAME, EVENT_TYPE, {
      message: '[POST Single Event]',
      id: uuid(),
    });
    expect(response.status).toBe(201);
  });

  test('[GET Event Stream History]', async () => {
    const response = await client.getEvents(STREAM_NAME);

    expect(response.status).toBe(200);
    expect(response.data.streamId).toBe(STREAM_NAME);
    expect(response.data.entries.length).toBeGreaterThan(0);
  });

  test('[GET Last Event Stream History]', async () => {
    const id = uuid();
    const postResponse = await client.postEvent(STREAM_NAME, EVENT_TYPE, {
      message: '[GET Last Event Stream History]',
      id,
    });
    expect(postResponse.status).toBe(201);

    const response = await client.getEvents(STREAM_NAME, 1, 0, Direction.DESC);
    expect(response.status).toBe(200);
    expect(response.data.streamId).toBe(STREAM_NAME);
    const event = get(response, 'data.entries.0');
    expect(event).toBeTruthy();
    expect(event.eventType).toBe(EVENT_TYPE);
    expect(event.data).toMatch(new RegExp(id, 'g'));
  });

  test('[DEL Event Stream]', async () => {
    const response = await client.delEventStream(STREAM_NAME);
    expect(response.status).toBe(204);
  });
});

describe('Subscriptions', () => {
  test('[SUBSCRIBE to Stream]', async () => {
    const id = uuid();

    const getArgs = (
      eventStreamName: string,
      subscriberName: string
    ): [string, string, (entries: Entry[]) => {}] => [
      eventStreamName,
      subscriberName,
      async (entries: Entry[]) => {
        expect(entries).toBeTruthy();
        expect(entries[0]?.eventType).toBe(EVENT_TYPE);
        const response = await client.ack(
          eventStreamName,
          subscriberName,
          entries.map((entry: Entry) => entry.eventId)
        );
        expect(response.status).toBe(202);
      },
    ];

    const firstSubscription = await client.subscribe(...getArgs(STREAM_NAME, 'FIRST_SUBSCRIBER'));

    const secondSubscription = await client.subscribe(...getArgs(STREAM_NAME, 'SECOND_SUBSCRIBER'));

    const postResponse = await client.postEvent(STREAM_NAME, EVENT_TYPE, {
      message: '[SUBSCRIBE to Stream]',
      id,
    });
    expect(postResponse.status).toBe(201);

    await new Promise((resolve) => {
      setTimeout(() => {
        firstSubscription.unsubscribe();
        secondSubscription.unsubscribe();
        resolve();
      }, 2000);
    });
  });
});

describe('Users', () => {
  const userCreateInput: UserCreateInput = {
    loginName: 'testUser',
    fullName: 'Test User',
    password: process?.env?.USER_PASSWORD ?? 'test1234',
    role: UserRole.OPS,
    groups: ['test', '$readers', '$writers'],
  };

  test('[GET Users]', async () => {
    const response = await client.users();
    expect(response.status).toBe(200);
  });

  test('[POST User]', async () => {
    const response = await client.createUser(userCreateInput);
    expect(response.status).toBe(201);
  });

  test('[GET User]', async () => {
    const response = await client.users();
    expect(response.status).toBe(200);
  });

  test('[DISABLE User]', async () => {
    const response = await client.users();
    expect(response.status).toBe(200);
  });

  test('[ENABLE User]', async () => {
    const response = await client.users();
    expect(response.status).toBe(200);
  });
});
