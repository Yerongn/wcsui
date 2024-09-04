import request from '/@/utils/request';

export function useDriveApi() {
	return {
		getDrives: (query: any) => {
			return request({
				url: '/drive',
				method: 'get',
				params: query,
			});
		},
		getDrivesById: (id: any) => {
			return request({
				url: '/drive/' + id,
				method: 'get',
			});
		},
		addDrive: (data: any) => {
			return request({
				url: '/drive',
				method: 'post',
				data: data,
			});
		},
		updateDrive: (data: any) => {
			return request({
				url: '/drive/' + data.id,
				method: 'put',
				data: data,
			});
		},
		delDrive: (driveId: any) => {
			return request({
				url: '/drive',
				method: 'delete',
				params: { id: driveId },
			});
		},
		getDriveList: () => {
			return request({
				url: '/drive/drive-list',
				method: 'get',
			});
		},
	};
}
