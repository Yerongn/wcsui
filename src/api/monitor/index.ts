import request from '/@/utils/request';

export function useMonitorApi() {
	return {
		getMonitors: (query: any) => {
			return request({
				url: '/device-monitor',
				method: 'get',
				params: query,
			});
		},
		addMonitor: (data: any) => {
			return request({
				url: '/device-monitor',
				method: 'post',
				data: data,
			});
		},
		updateMonitor: (data: any) => {
			return request({
				url: '/device-monitor/' + data.id,
				method: 'put',
				data: data,
			});
		},
		updateAreaMonitor: (data: any) => {
			return request({
				url: '/device-monitor/area/' + data.id,
				method: 'put',
				data: data,
			});
		},
		delMonitor: (id: any) => {
			return request({
				url: '/device-monitor',
				method: 'delete',
				params: { id: id },
			});
		},
		getMonitor: (id: any) => {
			return request({
				url: '/device-monitor/' + id,
				method: 'get',
			});
		},
		getServersState: (ids: Array<String>) => {
			return request({
				url: '/device-monitor/get-services-state',
				method: 'post',
				data: ids,
			});
		},
		getDevicesState: (deviceNos: Array<String>) => {
			return request({
				url: '/device-monitor/get-device-message',
				method: 'post',
				data: deviceNos,
			});
		},
		getConveyorState: (deviceNo: any) => {
			return request({
				url: '/device-monitor/conveyor-model/' + deviceNo,
				method: 'get',
			});
		},
		updateConveyorState: (deviceNo: string, data: any) => {
			return request({
				url: '/device-monitor/conveyor-model/' + deviceNo,
				method: 'put',
				data: data,
			});
		},
		getDeviceLog: (deviceNo: any) => {
			return request({
				url: '/device-monitor/device-log/' + deviceNo,
				method: 'get',
			});
		},
		test: () => {
			return request({
				url: '/test/hello-world',
				method: 'get',
			});
		},
	};
}
