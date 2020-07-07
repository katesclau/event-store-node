import { IEventStoreClient } from "../../../@types"
import axios, { AxiosPromise } from "axios"

export default function ack(
    this: IEventStoreClient,
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