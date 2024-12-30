import {IEvent, IPublishSubscribeService, ISubscriber, PublishSubscribeService} from "./pubsub";
import {MachineEventEnum, MachineRefillEvent, MachineSaleEvent} from "./event";
import {MachineRepo} from "./machine";
import {MachineRefillSubscriber, MachineSaleSubscriber, StockWarningSubscriber} from "./subscriber";

// helpers
const randomMachine = (): string => {
  const random = Math.random() * 3
  if (random < 1) {
    return '001'
  } else if (random < 2) {
    return '002'
  }
  return '003'

}

const eventGenerator = (): IEvent => {
  const random = Math.random()
  if (random < 0.5) {
    const saleQty = Math.random() < 0.5 ? 1 : 2 // 1 or 2
    return new MachineSaleEvent(saleQty, randomMachine())
  }
  const refillQty = Math.random() < 0.5 ? 3 : 5 // 3 or 5
  return new MachineRefillEvent(refillQty, randomMachine())
}


(() => {
  const pubsub = new PublishSubscribeService()
  const machineRepo = new MachineRepo()

  machineRepo.create('001')
  machineRepo.create('002')
  machineRepo.create('003')

  const machineSaleSubscriber = new MachineSaleSubscriber(machineRepo, pubsub)
  const machineRefillSubscriber = new MachineRefillSubscriber(machineRepo, pubsub)
  const stockWarningSubscriber = new StockWarningSubscriber()

  pubsub.subscribe(MachineEventEnum.SALE, machineSaleSubscriber)
  pubsub.subscribe(MachineEventEnum.REFILL, machineRefillSubscriber)
  pubsub.subscribe(MachineEventEnum.STOCK_LEVEL_OK, stockWarningSubscriber)
  pubsub.subscribe(MachineEventEnum.STOCK_LEVEL_LOW, stockWarningSubscriber)

  const events = [... new Array(20)].map(i => eventGenerator())
  events.forEach(event => pubsub.publish(event))
})()
