import * as signalR from '@microsoft/signalr';
import { Session } from '/@/utils/storage';
import { useSignalRStore } from '/@/stores/signalR';

// 失败连接重试次数
let failNum = 4;

// const signalRStore = useSignalRStore();

export default {
	// signalR对象
	async init(url: string) {
		const connection = new signalR.HubConnectionBuilder()
			.withUrl(`${import.meta.env.VITE_APP_BASE_WS}/` + url, {
				headers: {
					Authorization: `Bearer ${Session.get('token')}`,
				},
				accessTokenFactory: () => {
					// 返回授权 token
					return `${Session.get('token')}`;
				},
			})
			.withAutomaticReconnect() //自动重新连接
			.configureLogging(signalR.LogLevel.Information)
			.build();

		// eslint-disable-next-line no-console
		console.log(connection, 'connection');
		// signalRStore.$state = { SR: connection };
		// signalRStore.SR = connection;
		// 断线重连
		connection.onclose(async () => {
			// eslint-disable-next-line no-console
			console.log('断开连接了');
			// eslint-disable-next-line no-console
			console.assert(connection.state === signalR.HubConnectionState.Disconnected);
			// 建议用户重新刷新浏览器
			//	await this.start(connection);

			return;
		});
		connection.onreconnected(() => {
			// eslint-disable-next-line no-console
			console.log('断线重新连接成功');
		});
		// 启动
		// await this.start();
		return connection;
	},
	async start(client: signalR.HubConnection) {
		try {
			//使用async和await 或 promise的then 和catch 处理来自服务端的异常
			// eslint-disable-next-line no-console
			console.log(client, '执行连接');
			await client.start();
			//console.assert(this.SR.state === signalR.HubConnectionState.Connected);
			//console.log('signalR 连接成功了', this.SR.state);
			return true;
		} catch (error) {
			failNum--;
			//console.log(`失败重试剩余次数${that.failNum}`, error)
			if (failNum > 0) {
				setTimeout(async () => {
					await client.start();
				}, 5000);
			}
			return false;
		}
	},
	async close(client: signalR.HubConnection) {
		try {
			await client.stop();
		} catch {}
	},
};
