import { IEventStoreClient } from '../../../@types';
import axios, { AxiosPromise } from 'axios';

export default function updateUserPassword(
  this: IEventStoreClient,
  loginName: string,
  newPassword: string
): AxiosPromise {
  return axios({
    method: 'post',
    ...this.options,
    headers: {
      ...this.headers,
    },
    data: {
      newPassword,
    },
    url: `${this.options.url}/users/${loginName}/command/reset-password`,
  });
}
