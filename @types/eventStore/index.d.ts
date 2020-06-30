export interface EventStoreOptions {
    url: string
    user: string
    password: string
}
  
export  interface EventStoreHeaders {
    [key: string]: string
}
  
export interface IEventStoreProvider {
    [key: string]: any
}

export interface IEventPaginationType {
    page: number
    size: number
}
