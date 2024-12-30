// implementations
import {IEvent} from "./pubsub";

export enum MachineEventEnum {
  SALE = 'sale',
  REFILL = 'refill',
  NOT_ENOUGH_STOCK = 'not_enough_stock'
}

class MachineSaleEvent implements IEvent {
  constructor(private readonly _sold: number, private readonly _machineId: string) {}

  machineId(): string {
    return this._machineId
  }

  getSoldQuantity(): number {
    return this._sold
  }

  type(): MachineEventEnum {
    return MachineEventEnum.SALE
  }
}

class MachineRefillEvent implements IEvent {
  constructor(private readonly _refill: number, private readonly _machineId: string) {}

  machineId(): string {
    throw new Error("Method not implemented.")
  }

  type(): MachineEventEnum {
    throw MachineEventEnum.REFILL
  }
}