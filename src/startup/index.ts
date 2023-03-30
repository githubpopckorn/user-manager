import express, { type Router } from 'express'
import http from 'http'
import { type IConfig } from '../config'

class Server {
  private readonly _express: any
  private readonly _server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
  private readonly _config: IConfig

  constructor ({ config, router }: { config: IConfig, router: Router }) {
    this._config = config
    this._express = express()
    this._server = http.createServer(this._express)
    this._express.use(router)
  }

  async start (): Promise<any> {
    return await new Promise((_resolve, _reject) => {
      this._server.listen(this._config.PORT, () => {
        console.log(`Server running on port ${this._config.PORT}`)
      })
    })
  }
}

export default Server
