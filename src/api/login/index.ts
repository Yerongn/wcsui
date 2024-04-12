import request from '/@/utils/request';

/**
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 登录api接口集合
 * @method signIn 用户登录
 * @method signOut 用户退出登录
 */
export function useLoginApi() {
	return {
		signIn: (data: object) => {
			return request({
				url: '/account/login',
				headers: {
					isToken: false,
				},
				method: 'post',
				data: data,
			});
		},
		signOut: () => {
			return request({
				url: '/account/logout',
				method: 'post',
			});
		},
		getInfo: () => {
			return request({
				url: '/account',
				method: 'get',
			});
		},
		getCodeImg: () => {
			return request({
				url: '/account/captcha-image',
				headers: {
					isToken: false,
				},
				method: 'get',
				timeout: 20000,
			});
		},
	};
}

export default useLoginApi;
