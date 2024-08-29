import { defineStore } from 'pinia';

export const useSocketStore = defineStore('socket', {
	state: () => ({
		onlineNum: 1,
	}),
	actions: {
		getOnlineNum() {
			return this.onlineNum;
		},
		setOnlineNum(value: number) {
			this.onlineNum = value;
		},
	},
});
