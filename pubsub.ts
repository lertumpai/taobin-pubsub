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
  // unsubscribe ( /* Question 2 - build this feature */ )
}

class PublishSubscribeService<t> implements IPublishSubscribeService {
  private subscriber: Map<t, ISubscriber> = new Map()

  publish(event: IEvent): void {
    const subscriber = this.subscriber.get(event.type())
    if (subscriber) {
      subscriber.handle(event)
    }
  }

  subscribe(type: t, handler: ISubscriber): void {
    this.subscriber.set(type, handler)
  }
}