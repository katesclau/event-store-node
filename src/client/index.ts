import { v4 as uuid} from 'uuid'
import axios, { AxiosPromise } from 'axios'
import Observable from 'zen-observable'
import { IEventStoreClient, EventStoreOptions, EventStoreHeaders, Direction, Entry } from '../../@types/eventStore'

export default class EventStoreClient implements IEventStoreClient {
  private options: EventStoreOptions
  private headers: EventStoreHeaders = {}
  private DEFAULT_INTERVAL: number = 1000;

  public constructor(options: EventStoreOptions) {
    this.options = options
    this.updateHeaders(options)
  }

  private updateHeaders(options: EventStoreOptions) {
    this.options = options
    var Authorization = `Basic ${new Buffer(
      `${this.options.user}:${this.options.password}`
    ).toString('base64')}`
    this.headers = {
      'Content-Type': 'application/json',
      Authorization,
    }
  }

  public postEvent(
    eventStreamName: string,
    eventType: string,
    data: any,
  ): AxiosPromise {
    const { timestamp } = data
    const id = uuid()
    return axios({
      method: 'post',
      ...this.options,
      headers: {
        'ES-EventType': eventType,
        'ES-EventId': id,
        ...this.headers,
      },
      data: { // Axios data
        id,
        ...data,
        timestamp: timestamp ?  BigInt(timestamp) : new Date().getTime(),
      },
      url: `${this.options.url}/streams/${eventStreamName}`,
    })
  }

  public getEvents(
    eventStreamName: string,
    size: number = 10,
    page: number = 0,
    direction?: Direction,
  ): AxiosPromise {
    let pointer: number | string = 'head'
    if (page) {
      pointer = page*size
    }
    const pagination = direction ? `/${pointer}/${direction}/${size}` : ''
    return axios({
      method: 'get',
      ...this.options,
      headers: {
        ...this.headers,
      },
      url: `${this.options.url}/streams/${eventStreamName}${pagination}?embed=body`,
    })
  }

  public ack(
    eventStreamName: string, 
    subscriberName: string, 
    ids: string[],
  ): AxiosPromise {
    return axios({
      method: 'post',
      ...this.options,
      headers: {
        ...this.headers,
      },
      url: `${this.options.url}/subscriptions/${eventStreamName}/${subscriberName}/ack?ids=${ids.join(',')}`,
    })
  }
  
  delEventStream(eventStreamName: string, hard: boolean = false) {
    return axios({
      method: 'delete',
      ...this.options,
      headers: {
        ...this.headers,
        ...(hard ? {
          'ES-HardDelete': 'true'
        } : {})
      },
      url: `${this.options.url}/streams/${eventStreamName}`,
    })
  }

  public async subscribe(
    eventStreamName: string, 
    subscriberName: string, 
    next: (event: Entry[]) => void,
    error: (error: any) => void = () => {},
    complete: () => void = () => {},
    interval: number = this.DEFAULT_INTERVAL,
  ): Promise<ZenObservable.Subscription> {

    if(!(await this.createSubscription(eventStreamName, subscriberName))){
      throw new Error('Failed to create Subscription on Event Store');
    }

    return this.getObservable(eventStreamName, subscriberName, interval).subscribe({
      next,
      error,
      complete
    });
  }
  
  private async createSubscription(eventStreamName: string, subscriberName: string): Promise<boolean> {
    try {
      const response = await axios({
        method: 'put',
        ...this.options,
        headers: {
          ...this.headers,
        },
        data: {
          namedConsumerStrategy: 'RoundRobin'
        },
        url: `${this.options.url}/subscriptions/${eventStreamName}/${subscriberName}`,
      })
      return response.status === 201
    } catch (error) {
      return error.response.status === 409
    }
  }

  private getObservable(
    eventStreamName: string, 
    subscriberName: string, 
    interval: number = this.DEFAULT_INTERVAL,
  ): Observable<Entry[]> {
    return new Observable(observer => {
      const polling = setInterval(async () => {
        try {
          const response = await this.getViaSubscription(eventStreamName, subscriberName);
          const entries = response?.data?.entries || [] as Entry[];
          if (entries?.length) {
            observer.next(entries)
          }
        } catch (error) {
          observer.error(error);
        }
      }, interval)
      return () => clearInterval(polling);
    })
  }

  private getViaSubscription(
    eventStreamName: string, 
    subscriberName: string, 
  ): AxiosPromise {
    return axios({
      method: 'get',
      ...this.options,
      headers: {
        ...this.headers,
        'Accept': 'application/vnd.eventstore.competingatom+json',
      },
      url: `${this.options.url}/subscriptions/${eventStreamName}/${subscriberName}?embed=body`,
    })
  }
}
