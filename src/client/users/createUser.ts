import { IEventStoreClient } from "../../../@types";
import axios, { AxiosPromise } from "axios";
import { UserCreateInput } from "../../../@types/eventStore";

export default function createUser(
    this: IEventStoreClient,
    data: UserCreateInput,
  ): AxiosPromise {
    return axios({
        method: 'post',
        ...this.options,
        headers: {
          ...this.headers,
        },
        data,
        url: `${this.options.url}/users`,
    });
  }