import request from '/@/utils/request';

export function useDeptApi() {
	return {
		getDepts: (query: any) => {
			return request({
				url: '/dept',
				method: 'get',
				params: query,
			});
		},
		getDeptsByRoleId: (roleId: any) => {
			return request({
				url: '/dept/role-id/' + roleId,
				method: 'get',
			});
		},
		addDept: (data: any) => {
			return request({
				url: '/dept',
				method: 'post',
				data: data,
			});
		},
		updateDept: (data: any) => {
			return request({
				url: '/dept/' + data.id,
				method: 'put',
				data: data,
			});
		},
		delDept: (deptId: any) => {
			return request({
				url: '/dept',
				method: 'delete',
				params: { id: deptId },
			});
		},
		getDept: (deptId: any) => {
			return request({
				url: '/dept/' + deptId,
				method: 'get',
			});
		},
	};
}
