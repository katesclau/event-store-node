import { v4 as uuid} from 'uuid'
import axios from 'axios'
import { IEventStoreProvider, EventStoreOptions, EventStoreHeaders } from '../../@types/eventStore'

export default class EventStoreProvider implements IEventStoreProvider {
  private options: EventStoreOptions
  private headers: EventStoreHeaders = {}

  protected constructor(options: EventStoreOptions) {
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

  private postEvent(
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

  private getEvents(
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
