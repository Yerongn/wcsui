import request from '/@/utils/request';

export function useRoleApi() {
	return {
		getRoles: (query: any) => {
			return request({
				url: '/role',
				method: 'get',
				params: query,
			});
		},
		getRolesByUserId: (userId: any) => {
			return request({
				url: '/role/user-id/' + userId,
				method: 'get',
			});
		},
		addRole: (data: any) => {
			return request({
				url: '/role',
				method: 'post',
				data: data,
			});
		},
		updateRole: (data: any) => {
			return request({
				url: '/role/' + data.id,
				method: 'put',
				data: data,
			});
		},
		delRole: (roleId: any) => {
			return request({
				url: '/role',
				method: 'delete',
				params: { id: roleId },
			});
		},
		getRole: (roleId: any) => {
			return request({
				url: '/role/' + roleId,
				method: 'get',
			});
		},
	};
}
