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
}

export const Config: IConfig = {
    PORT: process.env.PORT != null ? parseInt(process.env.PORT, 10) : 5000,
    MONGO_URI: (process.env.MONGO_URI != null) ? process.env.MONGO_URI : '',
    APPLICATION_NAME: (process.env.APPLICATION_NAME != null) ? process.env.APPLICATION_NAME : '',
    JWT_SECRET: (process.env.JWT_SECRET != null) ? process.env.JWT_SECRET : ''
}
