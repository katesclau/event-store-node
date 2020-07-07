import { IEventStoreClient } from "../../../@types"
import axios, { AxiosPromise } from "axios"

export default function delEventStream(
    this: IEventStoreClient,
    eventStreamName: string, 
    hard: boolean = false,
): AxiosPromise {
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