import request from '/@/utils/request';

export function useWcsTaskApi() {
	return {
		getWcsMainTasks: (query: any) => {
			return request({
				url: '/wcs-task',
				method: 'get',
				params: query,
			});
		},
		updateTaskStatus: (data: any) => {
			return request({
				url: '/wcs-task-sub/' + data.id,
				method: 'put',
				data: data,
			});
		},
		recoveryWcsTask: (taskId: any) => {
			return request({
				url: '/wcs-task',
				method: 'delete',
				params: { id: taskId },
			});
		},
		getWcsSubTasks: (query: any) => {
			return request({
				url: '/wcs-task-sub',
				method: 'get',
				params: query,
			});
		},
	};
}
