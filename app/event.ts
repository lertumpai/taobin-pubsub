// implementations
import {IEvent} from "./pubsub";

export enum MachineEventEnum {
  SALE = 'SALE',
  REFILL = 'REFILL',
  STOCK_LEVEL_LOW = 'STOCK_LEVEL_LOW',
  STOCK_LEVEL_OK = 'STOCK_LEVEL_OK'
}

export class MachineSaleEvent implements IEvent {
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

export class MachineRefillEvent implements IEvent {
  constructor(private readonly _refill: number, private readonly _machineId: string) {}

  machineId(): string {
    return this._machineId
  }

  getRefileQuantity(): number {
    return this._refill
  }

  type(): MachineEventEnum {
    return MachineEventEnum.REFILL
  }
}

export class StockLevelOkEvent implements IEvent {
  constructor(private readonly _machineId: string) {}

  machineId(): string {
    return this._machineId
  }

  type(): MachineEventEnum {
    return MachineEventEnum.STOCK_LEVEL_OK
  }
}

export class LowStockWarningEvent implements IEvent {
  constructor(private readonly _machineId: string) {}

  machineId(): string {
    return this._machineId
  }

  type(): MachineEventEnum {
    return MachineEventEnum.STOCK_LEVEL_LOW
  }
}