import request from '/@/utils/request';

export function useJobApi() {
	return {
		getJobs: (query: any) => {
			return request({
				url: '/task',
				method: 'get',
				params: query,
			});
		},
		addJob: (data: any) => {
			return request({
				url: '/task',
				method: 'post',
				data: data,
			});
		},
		updateJob: (data: any) => {
			return request({
				url: '/task/' + data.id,
				method: 'put',
				data: data,
			});
		},
		delJob: (jobId: any) => {
			return request({
				url: '/task',
				method: 'delete',
				params: { id: jobId },
			});
		},
		getJob: (jobId: any) => {
			return request({
				url: '/task/' + jobId,
				method: 'get',
			});
		},
	};
}
