import request from '/@/utils/request';

export function useSharp7DeviceProtocolApi() {
	return {
		getSharp7DeviceProtocols: (query: any) => {
			return request({
				url: '/sharp7-device-protocol',
				method: 'get',
				params: query,
			});
		},
		getSharp7DeviceProtocolsById: (id: any) => {
			return request({
				url: '/sharp7-device-protocol/' + id,
				method: 'get',
			});
		},
		addSharp7DeviceProtocol: (data: any) => {
			return request({
				url: '/sharp7-device-protocol',
				method: 'post',
				data: data,
			});
		},
		updateSharp7DeviceProtocol: (data: any) => {
			return request({
				url: '/sharp7-device-protocol/' + data.id,
				method: 'put',
				data: data,
			});
		},
		delSharp7DeviceProtocol: (sharp7DeviceProtocolId: any) => {
			return request({
				url: '/sharp7-device-protocol',
				method: 'delete',
				params: { id: sharp7DeviceProtocolId },
			});
		},
		getSharp7DeviceProtocolList: () => {
			return request({
				url: '/sharp7-device-protocol/sharp7-device-protocol-list',
				method: 'get',
			});
		},
	};
}
