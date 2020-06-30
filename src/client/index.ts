import { v4 as uuid} from 'uuid'
import axios from 'axios'
import { IEventStoreProvider as IEventStoreClient, EventStoreOptions, EventStoreHeaders } from '../../@types/eventStore'

export default class EventStoreClient implements IEventStoreClient {
  private options: EventStoreOptions
  private headers: EventStoreHeaders = {}

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
    eventType: string,
    eventStreamName: string,
    data: any,
  ) {
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
  ) {
    let pointer: number | string = 'head'
    if (page) {
      pointer = page*size
    }
    return axios({
      method: 'get',
      ...this.options,
      headers: {
        ...this.headers,
      },
      url: `${this.options.url}/streams/${eventStreamName}/${pointer}/backward/${size}?embed=body`,
    })
  }
}
