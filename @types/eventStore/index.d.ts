export interface EventStoreOptions {
    url: string
    user: string
    password: string
}
  
export  interface EventStoreHeaders {
    [key: string]: string
}
  
export interface IEventStoreClient {
    [key: string]: any
}

export enum Direction {
    ASC = "forward",
    DESC = "backward"
}
