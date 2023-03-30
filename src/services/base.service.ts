import { type Model } from 'mongoose'
import { HttpError } from '../exceptions/http.error'
import { type IUser } from '../interfaces/models/user.interface'
import { type BaseRepository } from '../repositories/base.repository'

export abstract class BaseService<T> {
  repository: BaseRepository<T>

  constructor (Repository: BaseRepository<T>) {
    this.repository = Repository
  }

  async getById (id: string): Promise<any> {
    if (id.length === 0) {
      const error = new HttpError(400, 'Parametro id debe ser enviado')
      throw error
    }

    const entity = await this.repository.findById(id)
    if (entity == null) {
      const error = new HttpError(404, 'No se encontró el registro')
      throw error
    }

    return entity
  }

  async getAll (pageSize: number, pageNumber: number): Promise<T[]> {
    return await this.repository.getPaginated(pageSize, pageNumber)
  }

  async create (entity: Model<IUser>): Promise<T> {
    return await this.repository.create(entity)
  }

  async update (id: string, entity: Model<IUser>): Promise<T | null> {
    if (id === '') {
      const error = new HttpError(400, 'Parametro id debe ser enviado')
      throw error
    }

    return await this.repository.update(id, entity)
  }

  async delete (id: string): Promise<T | null> {
    if (id === '') {
      const error = new HttpError(400, 'Parametro id debe ser enviado')
      throw error
    }

    return await this.repository.delete(id)
  }
}
