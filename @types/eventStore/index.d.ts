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
    ASC = 'forward',
    DESC = 'backward'
}

export interface Entry {
    eventId: string
    eventType: string
    eventNumber: number
    data?: string
    streamId: string
    isJson: boolean
    isMetaData: boolean
    isLinkMetaData: boolean
    positionEventNumber: number
    positionStreamId: string
    title: string
    id: string
    updated: string
    author: any
    summary: string
    links: EntryLink[]
}

export interface EntryLink {
    uri: string
    relation: string
}
