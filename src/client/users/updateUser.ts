import { IEventStoreClient } from '../../../@types';
import axios, { AxiosPromise } from 'axios';
import { UserUpdateInput } from '../../../@types/eventStore';

export default function updateUser(
  this: IEventStoreClient,
  loginName: string,
  data: UserUpdateInput
): AxiosPromise {
  return axios({
    method: 'put',
    ...this.options,
    headers: {
      ...this.headers,
    },
    data,
    url: `${this.options.url}/users/${loginName}`,
  });
}
