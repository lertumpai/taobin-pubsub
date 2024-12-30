// interfaces
export interface IEvent {
  type(): any
  machineId(): string
}

export interface ISubscriber {
  handle(event: IEvent): void
}

export interface IPublishSubscribeService {
  publish (event: IEvent): void
  subscribe (type: any, handler: ISubscriber): void
  unsubscribe (type: any, handler: ISubscriber): void
}

export class PublishSubscribeService implements IPublishSubscribeService {
  private subscriber: Map<string, ISubscriber[]> = new Map()

  publish(event: IEvent): void {
    console.log(`Publishing event: ${event.type()}, machine: ${event.machineId()}`)
    const subscribers = this.subscriber.get(event.type())
    subscribers?.forEach(subscriber => subscriber.handle(event))
  }

  subscribe(type: string, subscriber: ISubscriber): void {
    let subscribers = this.subscriber.get(type)

    if (!subscribers) {
      subscribers = []
      this.subscriber.set(type, subscribers)
    }

    subscribers.push(subscriber)
  }

  unsubscribe(type: string, subscriber: ISubscriber): void {
    const subscribers = this.subscriber.get(type)

    if (!subscribers) return

    const unsubscribed = subscribers.filter(s => s !== subscriber)

    if (unsubscribed.length === 0) {
      this.subscriber.delete(type)
    } else {
      this.subscriber.set(type, unsubscribed)
    }
  }
}