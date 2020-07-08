import { IEventStoreClient } from '../../../@types';
import axios, { AxiosPromise } from 'axios';

export default function disableUser(this: IEventStoreClient, loginName: string): AxiosPromise {
  return axios({
    method: 'post',
    ...this.options,
    headers: {
      ...this.headers,
    },
    url: `${this.options.url}/users/${loginName}/command/disable`,
  });
}
