import express, { Express } from 'express';
import path from 'path';
import http from 'http';

export default class Server {
	private readonly _port: number;
	private readonly _server: Express;
	private _instance?: http.Server;

	constructor(port: number) {
		this._port = port;
		this._server = express();
	}

	init(dir: string): Promise<void> {
		this._server.use(express.static(dir, { dotfiles: 'allow' }));
		this._server.get('*', (_req, res) =>
			res.sendFile(path.join(dir, 'index.html'))
		);

		return new Promise((resolve) => {
			this._instance = this._server.listen(this._port, () => resolve());
		});
	}

	async destroy(): Promise<void> {
		await this._instance?.close();
	}
}
