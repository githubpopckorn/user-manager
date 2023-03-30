import container from './startup/container'
import mongoose from 'mongoose'
import { Config } from './config'

const server = container.resolve('app')

mongoose.connect(Config.MONGO_URI, {})
  .then(() => server.start())
  .catch((err) => { console.log(err) })
