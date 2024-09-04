import request from '/@/utils/request';

export function useDeviceApi() {
	return {
		getDevices: (query: any) => {
			return request({
				url: '/device',
				method: 'get',
				params: query,
			});
		},
		getDevicesById: (id: any) => {
			return request({
				url: '/device/' + id,
				method: 'get',
			});
		},
		addDevice: (data: any) => {
			return request({
				url: '/device',
				method: 'post',
				data: data,
			});
		},
		updateDevice: (data: any) => {
			return request({
				url: '/device/' + data.id,
				method: 'put',
				data: data,
			});
		},
		delDevice: (deviceId: any) => {
			return request({
				url: '/device',
				method: 'delete',
				params: { id: deviceId },
			});
		},
		getDeviceList: () => {
			return request({
				url: '/device/device-list',
				method: 'get',
			});
		},
	};
}
