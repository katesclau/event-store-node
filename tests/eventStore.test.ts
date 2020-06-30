import EventStoreClient from '../src/index'
import { EventStoreOptions } from '../@types/eventStore'

const options: EventStoreOptions = {
    url: "http://localhost:2113",
    user: "admin",
    password: "changeIt"
}
const client: EventStoreClient = new EventStoreClient(options);

test("[POST Single Event]", async () => {
    const response = await client.postEvent(
        "singleEvent",
        "testStream",
        {
            message: "test message",
        },
    );
    expect(response.status).toBe(201);
})