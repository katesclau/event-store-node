import axios, { AxiosPromise } from 'axios';
import Observable from 'zen-observable';
import {
  IEventStoreClient,
  EventStoreOptions,
  EventStoreHeaders,
  Entry,
  EventStoreCredentials,
} from '../../@types/eventStore';
import users from './users/users';
import postEvent from './events/postEvent';
import ack from './subscriptions/ack';
import subscribe from './subscriptions/subscribe';
import delEventStream from './streams/delEventStream';
import getEvents from './events/getEvents';
import createUser from './users/createUser';
import getUser from './users/getUser';
import disableUser from './users/disableUser';
import enableUser from './users/enableUser';
import updateUser from './users/updateUser';
import updateUserPassword from './users/updateUserPassword';
import deleteUser from './users/deleteUser';

export default class EventStoreClient implements IEventStoreClient {
  private options: EventStoreOptions;
  private headers: EventStoreHeaders = {};
  private DEFAULT_INTERVAL: number = 1000;

  // User Management
  public users = users;
  public getUser = getUser;
  public createUser = createUser;
  public deleteUser = deleteUser;
  public disableUser = disableUser;
  public enableUser = enableUser;
  public updateUser = updateUser;
  public updateUserPassword = updateUserPassword;

  // Events
  public postEvent = postEvent;
  public getEvents = getEvents;

  // Streams
  public delEventStream = delEventStream;

  // Subscriptions
  public ack = ack;
  public subscribe = subscribe;

  public constructor(options: EventStoreOptions) {
    this.options = options;
    this.updateHeaders(options);
  }

  setCredentials(credentials: EventStoreCredentials) {
    this.options = {
      ...this.options,
      ...credentials,
    };
    this.updateHeaders();
    return this;
  }

  private updateHeaders(options: EventStoreOptions = this.options) {
    this.options = options;
    var Authorization = `Basic ${new Buffer(
      `${this.options.user}:${this.options.password}`
    ).toString('base64')}`;
    this.headers = {
      'Content-Type': 'application/json',
      Authorization,
    };
  }

  private async createSubscription(
    eventStreamName: string,
    subscriberName: string
  ): Promise<boolean> {
    try {
      const response = await axios({
        method: 'put',
        ...this.options,
        headers: {
          ...this.headers,
        },
        data: {
          namedConsumerStrategy: 'RoundRobin',
        },
        url: `${this.options.url}/subscriptions/${eventStreamName}/${subscriberName}`,
      });
      return response.status === 201;
    } catch (error) {
      return error.response.status === 409;
    }
  }

  private getObservable(
    eventStreamName: string,
    subscriberName: string,
    interval: number = this.DEFAULT_INTERVAL
  ): Observable<Entry[]> {
    return new Observable((observer) => {
      const polling = setInterval(async () => {
        try {
          const response = await this.getViaSubscription(eventStreamName, subscriberName);
          const entries = response?.data?.entries || ([] as Entry[]);
          if (entries?.length) {
            observer.next(entries);
          }
        } catch (error) {
          observer.error(error);
        }
      }, interval);
      return () => clearInterval(polling);
    });
  }

  private getViaSubscription(eventStreamName: string, subscriberName: string): AxiosPromise {
    return axios({
      method: 'get',
      ...this.options,
      headers: {
        ...this.headers,
        Accept: 'application/vnd.eventstore.competingatom+json',
      },
      url: `${this.options.url}/subscriptions/${eventStreamName}/${subscriberName}?embed=body`,
    });
  }
}
