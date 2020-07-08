export interface EventStoreOptions {
  url: string;
  user: string;
  password: string;
}

export interface EventStoreCredentials {
  user: string;
  password: string;
}

export interface EventStoreHeaders {
  [key: string]: string;
}

export interface IEventStoreClient {
  [key: string]: any;
}

export const enum Direction {
  ASC = 'forward',
  DESC = 'backward',
}

export const enum UserRole {
  ADMIN = '$admins',
  OPS = '$ops',
}
export interface UserCreateInput {
  loginName: string;
  fullName: string;
  password: string;
  role?: UserRole;
  groups: string[];
}

export interface UserUpdateInput {
  fullName?: string;
  role?: UserRole;
  groups?: string[];
}

export interface Entry {
  eventId: string;
  eventType: string;
  eventNumber: number;
  data?: string;
  streamId: string;
  isJson: boolean;
  isMetaData: boolean;
  isLinkMetaData: boolean;
  positionEventNumber: number;
  positionStreamId: string;
  title: string;
  id: string;
  updated: string;
  author: any;
  summary: string;
  links: EntryLink[];
}

export interface EntryLink {
  uri: string;
  relation: string;
}
