import * as dotenv from 'dotenv'

if (process.env.NODE_ENV !== 'production') {
    if (process.env.NODE_ENV === 'test') {
        dotenv.config({ path: 'test.env' })
    } else {
        dotenv.config()
    }
}
export interface IConfig {
    PORT: number
    MONGO_URI: string
    APPLICATION_NAME: string
    JWT_SECRET: string
    JWT_RESET_SECRET: string
    MAX_LOGIN_ATTEMPTS: number
    LOCK_TIME: number
}

export const Config: IConfig = {
    PORT: process.env.PORT != null ? parseInt(process.env.PORT, 10) : 5000,
    MONGO_URI: (process.env.MONGO_URI != null) ? process.env.MONGO_URI : '',
    APPLICATION_NAME: (process.env.APPLICATION_NAME != null) ? process.env.APPLICATION_NAME : '',
    JWT_SECRET: (process.env.JWT_SECRET != null) ? process.env.JWT_SECRET : '',
    JWT_RESET_SECRET: (process.env.JWT_RESET_SECRET != null) ? process.env.JWT_RESET_SECRET : '',
    MAX_LOGIN_ATTEMPTS: (process.env.MAX_LOGIN_ATTEMPTS != null) ? parseInt(process.env.MAX_LOGIN_ATTEMPTS) : 5,
    LOCK_TIME: (process.env.LOCK_TIME != null) ? parseInt(process.env.LOCK_TIME) : 5
}
