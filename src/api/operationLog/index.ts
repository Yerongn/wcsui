import request from '/@/utils/request';

export function useOperationLogApi() {
	return {
		getOperationLogs: (query: any) => {
			return request({
				url: '/operation-log/operation-log',
				method: 'get',
				params: query,
			});
		},
	};
}
