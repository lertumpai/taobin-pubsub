// objects
import {IEvent} from "./pubsub"

export class Machine {
  private _stockLevel = 10
  private readonly _id: string

  constructor (id: string) {
    this._id = id
  }

  get stockLevel(): number {
    return this._stockLevel
  }

  get id(): string {
    return this._id
  }

  sale(quantity: number): void {
    this._stockLevel -= quantity
  }

  addStock(quantity: number): void {
    this._stockLevel += quantity
  }
}

export interface IMachineRepo {
  create(id: string): void
  find(id: string): Machine | null
}

export class MachineRepo implements IMachineRepo {
  private machines: Machine[] = []

  create (id: string): void {
    if (this.find(id)) {
      throw new Error('Machine already exists')
    }
    this.machines.push(new Machine(id))
  }

  find (id: string): Machine | null {
    return this.machines.find(m => m.id === id)
  }
}