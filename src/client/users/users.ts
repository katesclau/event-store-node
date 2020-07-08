import { IEventStoreClient } from '../../../@types';
import axios, { AxiosPromise } from 'axios';

export default function users(this: IEventStoreClient): AxiosPromise {
  return axios({
    method: 'get',
    ...this.options,
    headers: {
      ...this.headers,
    },
    url: `${this.options.url}/users`,
  });
}
