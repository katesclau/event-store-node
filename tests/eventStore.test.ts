import EventStoreClient from '../src/index'
import { EventStoreOptions } from '../@types/eventStore'

const options: EventStoreOptions = {
    url: "http://localhost:2113",
    user: "admin",
    password: "changeit"
}
const client: EventStoreClient = new EventStoreClient(options);

test("[POST Single Event]", async () => {
    const response = await client.postEvent(
        "testStream",
        "singleEvent",
        {
            message: "test message",
        },
    );
    expect(response.status).toBe(201);
})

test("[GET Event Stream History]", async () => {
    const response = await client.getEvents(
        "testStream",
    );
    expect(response.status).toBe(200);
})