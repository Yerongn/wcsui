import request from '/@/utils/request';

export function useProcessFlowApi() {
	return {
		getProcessFlows: (query: any) => {
			return request({
				url: '/process-flow',
				method: 'get',
				params: query,
			});
		},
		getProcessFlowsById: (id: any) => {
			return request({
				url: '/process-flow/' + id,
				method: 'get',
			});
		},
		addProcessFlow: (data: any) => {
			return request({
				url: '/process-flow',
				method: 'post',
				data: data,
			});
		},
		updateProcessFlow: (data: any) => {
			return request({
				url: '/process-flow/' + data.id,
				method: 'put',
				data: data,
			});
		},
		updateProcessFlowConfigure: (data: any) => {
			return request({
				url: '/process-flow/process-flow-configure',
				method: 'put',
				data: data,
			});
		},
		delProcessFlow: (processFlowId: any) => {
			return request({
				url: '/process-flow',
				method: 'delete',
				params: { id: processFlowId },
			});
		},
		getProcessFlow: (processFlowId: any) => {
			return request({
				url: '/process-flow/' + processFlowId,
				method: 'get',
			});
		},
		getProcess: () => {
			return request({
				url: '/process-flow/process',
				method: 'get',
			});
		},
		getProcessDataType: () => {
			return request({
				url: '/process-flow/process-data-type',
				method: 'get',
			});
		},
	};
}
