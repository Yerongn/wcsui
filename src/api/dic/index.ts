import request from '/@/utils/request';

export function useDicApi() {
	return {
		getDics: (query: any) => {
			return request({
				url: '/dictionary-type',
				method: 'get',
				params: query,
			});
		},
		getDicsByDicType: (dicType: string) => {
			return request({
				url: '/dictionary/dic-type/' + dicType,
				method: 'get',
			});
		},
		addDic: (data: any) => {
			return request({
				url: '/dictionary-type',
				method: 'post',
				data: data,
			});
		},
		updateDic: (data: any) => {
			return request({
				url: '/dictionary-type/' + data.id,
				method: 'put',
				data: data,
			});
		},
		delDic: (id: any) => {
			return request({
				url: '/dictionary-type',
				method: 'delete',
				params: { id: id },
			});
		},
		getDic: (id: any) => {
			return request({
				url: '/dictionary-type/' + id,
				method: 'get',
			});
		},
	};
}
