import { IEventStoreClient } from '../../../@types';
import axios, { AxiosPromise } from 'axios';

export default function deleteUser(this: IEventStoreClient, loginName: string): AxiosPromise {
  return axios({
    method: 'delete',
    ...this.options,
    headers: {
      ...this.headers,
    },
    url: `${this.options.url}/users/${loginName}`,
  });
}
