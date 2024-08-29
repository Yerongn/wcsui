import request from '/@/utils/request';

export function useUserApi() {
	return {
		getUsers: (query: any) => {
			return request({
				url: '/user',
				method: 'get',
				params: query,
			});
		},
		addUser: (data: any) => {
			return request({
				url: '/user',
				method: 'post',
				data: data,
			});
		},
		updateUser: (data: any) => {
			return request({
				url: '/user/' + data.id,
				method: 'put',
				data: data,
			});
		},
		delUser: (userId: any) => {
			return request({
				url: '/user',
				method: 'delete',
				params: { id: userId },
			});
		},
		getUser: (userId: any) => {
			return request({
				url: '/user/' + userId,
				method: 'get',
			});
		},
	};
}
