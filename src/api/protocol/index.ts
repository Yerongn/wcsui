import request from '/@/utils/request';

export function useProtocolTypeApi() {
	return {
		getProtocolType: () => {
			return request({
				url: '/protocol/protocol-type',
				method: 'get',
			});
		},
	};
}
