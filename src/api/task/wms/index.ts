import request from '/@/utils/request';

export function useWmsTaskApi() {
	return {
		getWmsTasks: (query: any) => {
			return request({
				url: '/wms-task',
				method: 'get',
				params: query,
			});
		},
		recoveryWmsTask: (taskId: any) => {
			return request({
				url: '/wms-task',
				method: 'delete',
				params: { id: taskId },
			});
		},
	};
}
