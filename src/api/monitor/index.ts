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
		delMonitor: (id: any) => {
			return request({
				url: '/device-monitor',
				method: 'delete',
				params: { id: id },
			});
		},
		getMonitor: (id: any) => {
			return request({
				url: '/monitor/' + id,
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
