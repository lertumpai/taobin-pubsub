import {IEvent, IPublishSubscribeService, ISubscriber} from "./pubsub";
import {IMachineService} from "./machine";
import {MachineSaleEvent} from "./event";

class MachineSaleSubscriber implements ISubscriber {
  private readonly machineService: IMachineService
  private readonly pubSubService: IPublishSubscribeService

  constructor (
    machineService: IMachineService,
    pubSubService: IPublishSubscribeService
  ) {
    this.machineService = machineService
    this.pubSubService = pubSubService
  }

  handle(event: MachineSaleEvent): void {
    this.machineService.sell(event.machineId(), event.getSoldQuantity())
  }
}

class MachineRefillSubscriber implements ISubscriber {
  handle(event: IEvent): void {
    throw new Error("Method not implemented.")
  }
}
