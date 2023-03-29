export interface IBaseRepository<T> {
    create(data: Partial<T>): Promise<T>;
    update(id: string, data: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<T | null>;
    findById(id: string): Promise<T | null>;
    getPaginated(pageSize: number, pageNumber: number): Promise<T[]>;
    findAll(): Promise<T[]>;
}