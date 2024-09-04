import request from '/@/utils/request';

export function useRuleEngineApi() {
	return {
		getRuleEngines: (query: any) => {
			return request({
				url: '/rule-engine',
				method: 'get',
				params: query,
			});
		},
		addRuleEngine: (data: any) => {
			return request({
				url: '/rule-engine',
				method: 'post',
				data: data,
			});
		},
		updateRuleEngine: (data: any) => {
			return request({
				url: '/rule-engine/' + data.id,
				method: 'put',
				data: data,
			});
		},
		delRuleEngine: (ruleEngineId: any) => {
			return request({
				url: '/rule-engine',
				method: 'delete',
				params: { id: ruleEngineId },
			});
		},
		getRuleEngine: (ruleEngineId: any) => {
			return request({
				url: '/rule-engine/' + ruleEngineId,
				method: 'get',
			});
		},
	};
}
