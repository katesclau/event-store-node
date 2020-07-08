import { IEventStoreClient } from '../../../@types';
import axios, { AxiosPromise } from 'axios';

export default function getUser(this: IEventStoreClient, loginName: string): AxiosPromise {
  return axios({
    method: 'get',
    ...this.options,
    headers: {
      ...this.headers,
    },
    url: `${this.options.url}/users/${loginName}`,
  });
}
