import { defineStore } from 'pinia';

export const useSignalRStore = defineStore('signalR', {
	state: () => ({
		SR: {} as signalR.HubConnection,
	}),
});
