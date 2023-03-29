import express from 'express';
import http from 'http';
import { IConfig } from '../config'

class Server {
    private _express: any;
    private _server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
    private _config: any;

    constructor({ config, router }: { config: IConfig, router: Function })   {
        this._config = config;
        this._express = express();
        this._server = http.createServer(this._express);
        this._express.use(router);
    }
    
    start() {
        return new Promise((_, __) => {
            this._server.listen(this._config.PORT, () => {
                console.log(`Server running on port ${this._config.PORT}`);
            });
        })
    }
}

export default Server;