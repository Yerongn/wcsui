import request from '/@/utils/request';

export function useSharp7DeviceProtocolApi() {
	return {
		getSharp7DeviceProtocols: (query: any) => {
			return request({
				url: '/sharp7Device-protocol',
				method: 'get',
				params: query,
			});
		},
		getSharp7DeviceProtocolsById: (id: any) => {
			return request({
				url: '/sharp7Device-protocol/' + id,
				method: 'get',
			});
		},
		addSharp7DeviceProtocol: (data: any) => {
			return request({
				url: '/sharp7Device-protocol',
				method: 'post',
				data: data,
			});
		},
		updateSharp7DeviceProtocol: (data: any) => {
			return request({
				url: '/sharp7Device-protocol/' + data.id,
				method: 'put',
				data: data,
			});
		},
		delSharp7DeviceProtocol: (sharp7DeviceProtocolId: any) => {
			return request({
				url: '/sharp7Device-protocol',
				method: 'delete',
				params: { id: sharp7DeviceProtocolId },
			});
		},
		getSharp7DeviceProtocolList: () => {
			return request({
				url: '/sharp7Device-protocol/sharp7Device-protocol-list',
				method: 'get',
			});
		},
		batchAdd: (data: any) => {
			return request({
				url: '/sharp7Device-protocol/batch-add',
				method: 'post',
				data: data,
			});
		},
	};
}
