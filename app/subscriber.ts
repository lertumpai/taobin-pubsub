import {IEvent, IPublishSubscribeService, ISubscriber} from "./pubsub"
import {LowStockWarningEvent, MachineEventEnum, MachineRefillEvent, MachineSaleEvent, StockLevelOkEvent} from "./event"
import {IMachineRepo} from "./machine"

export class MachineSaleSubscriber implements ISubscriber {
  private readonly machineRepo: IMachineRepo
  private readonly pubSubService: IPublishSubscribeService

  constructor (
    machineService: IMachineRepo,
    pubSubService: IPublishSubscribeService
  ) {
    this.machineRepo = machineService
    this.pubSubService = pubSubService
  }

  handle(event: MachineSaleEvent): void {
    if (event.getSoldQuantity() < 0) {
      throw new Error('Invalid quantity')
    }

    const machine = this.machineRepo.find(event.machineId())
    if (!machine) return

    if (machine.stockLevel >= event.getSoldQuantity()) {
      machine.sale(event.getSoldQuantity())
      console.log(`machineId: ${event.machineId()}, current: ${event.getSoldQuantity() + machine.stockLevel}, sold: ${event.getSoldQuantity()}, remaining: ${machine.stockLevel}`)
    } else {
      console.log(`machineId: ${event.machineId()}, remaining: ${machine.stockLevel}, The stock is not enough`)
    }

    // check stock level
    this.checkStockLevel(machine, event)
  }

  checkStockLevel(machine: any, event: MachineSaleEvent): void {
    const firstTimeLow = machine.stockLevel + event.getSoldQuantity() >= 3
    if (machine.stockLevel < 3 && firstTimeLow) {
      const lowStockEvent = new LowStockWarningEvent(event.machineId())
      this.pubSubService.publish(lowStockEvent)
    }
  }
}

export class MachineRefillSubscriber implements ISubscriber {
  private readonly machineRepo: IMachineRepo
  private readonly pubSubService: IPublishSubscribeService

  constructor (
    machineService: IMachineRepo,
    pubSubService: IPublishSubscribeService
  ) {
    this.machineRepo = machineService
    this.pubSubService = pubSubService
  }

  handle(event: MachineRefillEvent): void {
    if (event.getRefillQuantity() < 0) {
      throw new Error('Invalid quantity')
    }

    const machine = this.machineRepo.find(event.machineId())
    if (!machine) return

    machine.addStock(event.getRefillQuantity())
    console.log(`machineId: ${event.machineId()}, current: ${machine.stockLevel - event.getRefillQuantity()}, refill: ${event.getRefillQuantity()}, remaining: ${machine.stockLevel}`)

    // check stock level
    this.checkStockLevel(machine, event)
  }

  checkStockLevel(machine: any, event: MachineRefillEvent): void {
    const firstTimeOk = machine.stockLevel - event.getRefillQuantity() < 3
    if (machine.stockLevel >= 3 && firstTimeOk) {
      const stockOkEvent = new StockLevelOkEvent(event.machineId())
      this.pubSubService.publish(stockOkEvent)
    }
  }
}

export class StockWarningSubscriber implements ISubscriber {
  handle(event: IEvent): void {
    switch (event.type()) {
      case MachineEventEnum.STOCK_LEVEL_LOW.toString():
        console.log(`Stock warning: machine ${event.machineId()} stocks < 3`)
        break
      case MachineEventEnum.STOCK_LEVEL_OK.toString():
        console.log(`Stock ok: machine ${event.machineId()} stocks > 3`)
        break
      default:
        throw new Error('Invalid event StockWarningSubscriber')
    }
  }
}
