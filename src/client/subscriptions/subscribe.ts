import { IEventStoreClient } from "../../../@types"
import { Entry } from "../../../@types/eventStore";

export default async function subscribe(
    this: IEventStoreClient,
    eventStreamName: string, 
    subscriberName: string, 
    next: (event: Entry[]) => void,
    error: (error: any) => void = () => {},
    complete: () => void = () => {},
    interval: number = this.DEFAULT_INTERVAL,
  ): Promise<ZenObservable.Subscription> {

    if(!(await this.createSubscription(eventStreamName, subscriberName))){
      throw new Error('Failed to create Subscription on Event Store');
    }

    return this.getObservable(eventStreamName, subscriberName, interval).subscribe({
      next,
      error,
      complete
    });
  }
