import { v4 as uuid} from 'uuid'
import { IEventStoreClient } from "../../../@types"
import axios, { AxiosPromise } from "axios"

export default function postEvent(
    this: IEventStoreClient,
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