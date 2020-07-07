import { IEventStoreClient, Direction } from "../../../@types"
import axios, { AxiosPromise } from "axios"

export default function getEvents(
    this: IEventStoreClient,
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