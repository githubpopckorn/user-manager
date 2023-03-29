import { Model } from "mongoose";
import { HttpError } from "../exceptions/http.error";
import { IUser } from "../interfaces/models/user.interface";

export abstract class BaseService {
    repository: any;

    constructor(Repository: any ){
        this.repository = Repository;
    }

    async getById(id: string) {
        if (!id) {
            const error = new HttpError(400, "Parametro id debe ser enviado");
            throw error;
        }

        const entity = await this.repository.findById(id);
        if (!entity) {
            const error = new HttpError(404, "No se encontró el registro");
            throw error;
        }

        return entity;
    }

    async getAll(pageSize: number, pageNumber: number) {
        return await this.repository.findAll(pageSize, pageNumber);
    }

    async create(entity: Model<IUser>) {
        return await this.repository.create(entity);
    }

    async update(id: string, entity: Model<IUser>) {
        if (!id) {
            const error = new HttpError(400, "Parametro id debe ser enviado");
            throw error;
        }

        return await this.repository.update(id, entity);
    }

    async delete(id: string) {
        if (!id) {
            const error = new HttpError(400, "Parametro id debe ser enviado");
            throw error;
        }

        return await this.repository.delete(id);
    }

}