# Event Store NodeJS Client (using HTTP API)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=katesclau_event-store-node&metric=alert_status)](https://sonarcloud.io/dashboard?id=katesclau_event-store-node)

Simple Event Store Client (using Rest HTTP API), based on Axios promises.

## Event Store

Event Store is a service that allows us to store events in a TSDB way, but it also performs neatly as an EventBus for connecting multiple services within a platform or solution.

This client aims to aid in such efforts by providing an easy way to connect, post and subscribe to events.

More on EventStore at
https://eventstore.com/

## Requirements

- node.js > 10
- an Event Store running instance

## Getting Started

`npm i --save katesclau/event-store-node` or `yarn add katesclau/event-store-node`

```
import EventStoreClient from '../src/index';
import { Entry, UserCreateInput, Direction, UserRole, EventStoreOptions } from '../@types/eventStore';

// Connection options
const options: EventStoreOptions = {
  url: 'http://localhost:2113',
  user: process.env?.EVENTSTORE_USER ?? 'admin',
  password: process.env?.EVENTSTORE_PASSWORD ?? 'changeit',
};

// Client instance
const client = new EventStoreClient(options);

// Post your event
const response = await client.postEvent('STREAM_NAME', 'EVENT_TYPE', {
    message: 'my first event'
});
```

## Features

- Post Event to Stream ✔
- Subscribe to Streams (Using persistent subscribers) ✔
- Read Stream Events (Historical & Conditional) ✔
- User Management (CRUD) ✔

## TODO

- Projections (CRUD)
- Misc (Description, Node info, Ping, Gossip...)
- ACL Management (Streams metadata)

## REST reference

PostMan Collection
[🔗](./assets/EventStore.postman_collection.json)
