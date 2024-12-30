import {IEvent, IPublishSubscribeService, ISubscriber} from "./pubsub";

class MachineSaleSubscriber implements ISubscriber {
  private machines: Machine[]

  constructor (machines: Machine[]) {
    this.machines = machines
  }

  handle(event: MachineSaleEvent): void {
    const machine = this.machines.find(m => m.id === event.machineId())
    if (machine) {
      machine.sale(event.getSoldQuantity())
    }
  }
}

class MachineRefillSubscriber implements ISubscriber {
  handle(event: IEvent): void {
    throw new Error("Method not implemented.")
  }
}
