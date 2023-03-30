import { type Model } from 'mongoose'
import { type IBaseRepository } from '../interfaces/base.repository.interface'

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  protected model: Model<T>

  constructor (model: Model<T>) {
    this.model = model
  }

  async findById (id: string): Promise<T | null> {
    return await this.model.findById(id)
  }

  async getPaginated (pageSize = 5, pageNumber = 1): Promise<T[]> {
    const skips = pageSize * (pageNumber - 1)
    return await this.model.find().skip(skips).limit(pageSize)
  }

  async findAll (): Promise<T[]> {
    return await this.model.find().sort({ createdAt: -1 })
  }

  async create (entity: any): Promise<T> {
    return await this.model.create(entity)
  }

  async update (id: string, entity: any): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, entity, { new: true })
  }

  async delete (id: string): Promise<T | null> {
    return await this.model.findByIdAndDelete(id)
  }
}
