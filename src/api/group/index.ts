import request from '/@/utils/request';

export function useGroupApi() {
	return {
		getGroups: (query: any) => {
			return request({
				url: '/group',
				method: 'get',
				params: query,
			});
		},
		getGroupsById: (id: any) => {
			return request({
				url: '/group/' + id,
				method: 'get',
			});
		},
		addGroup: (data: any) => {
			return request({
				url: '/group',
				method: 'post',
				data: data,
			});
		},
		updateGroup: (data: any) => {
			return request({
				url: '/group/' + data.id,
				method: 'put',
				data: data,
			});
		},
		delGroup: (groupId: any) => {
			return request({
				url: '/group',
				method: 'delete',
				params: { id: groupId },
			});
		},
		getGroupList: () => {
			return request({
				url: '/group/group-list',
				method: 'get',
			});
		},
	};
}
