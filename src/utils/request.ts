import axios, { AxiosInstance } from 'axios';
import { ElNotification, ElMessage, ElMessageBox } from 'element-plus';
import { Session } from '/@/utils/storage';
import useLoginApi from '/@/api/login';
import qs from 'qs';
// import internal from 'stream';

// 是否显示重新登录
export let isRelogin = { show: false };

// 配置新建一个 axios 实例
const service: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_APP_BASE_API,
	timeout: 50000,
	headers: { 'Content-Type': 'application/json' },
	paramsSerializer: {
		serialize(params) {
			return qs.stringify(params, { allowDots: true });
		},
	},
});

// 添加请求拦截器
service.interceptors.request.use(
	(config) => {
		// 在发送请求之前做些什么 token
		if (Session.get('token')) {
			config.headers['Authorization'] = `Bearer ${Session.get('token')}`; // 让每个请求携带自定义token 请根据实际情况自行修改
		}

		return config;
	},
	(error) => {
		// 对请求错误做些什么
		return Promise.reject(error);
	}
);

// 添加响应拦截器
service.interceptors.response.use(
	(response) => {
		// 对响应数据做点什么
		const res = response.data;
		if (res.code && res.code !== 0) {
			// `token` 过期或者账号已在别处登录
			if (res.code === 401 || res.code === 4001) {
				Session.clear(); // 清除浏览器全部临时缓存
				window.location.href = '/'; // 去登录页
				ElMessageBox.alert('你已被登出，请重新登录', '提示', {})
					.then(() => {})
					.catch(() => {});
			}
			return Promise.reject(service.interceptors.response);
		} else {
			return res;
		}
	},
	(error) => {
		// 对响应错误做点什么
		//if (error.message.indexOf('timeout') != -1) {
		//	ElMessage.error('网络超时');
		// } else if (error.message == 'Network Error') {
		//	ElMessage.error('网络连接错误');
		// } else {
		// ElMessage.error(error.message);
		//	if (error.response.data) ElMessage.error(error.response.statusText);
		// 	else ElMessage.error('接口路径找不到');
		// }
		const errorRes = error.response;
		const code = errorRes.status || 200;
		const msg = `${errorRes.data?.error?.message}`;
		handler(code, msg);

		return Promise.reject(error);
	}
);

const handler = (code?: any, msg?: string) => {
	switch (code) {
		//服务器异常
		case 500:
			ElMessage({
				message: msg,
				type: 'error',
			});
			break;
		//业务异常
		case 403:
			ElNotification.error({
				title: msg,
			});
			break;
		//接口异常
		case 400:
			ElNotification.error({
				title: msg,
			});
			break;
		//未授权
		case 401:
			ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
				confirmButtonText: '重新登录',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					isRelogin.show = false;
					useLoginApi()
						.signOut()
						.then(() => {
							location.href = '/index';
						});
				})
				.catch(() => {
					isRelogin.show = false;
				});
			break;
		case 404:
			ElMessage({
				message: '404未找到资源',
				type: 'error',
			});
			break;
		//正常
		case 200:
			break;
	}
};
// 导出 axios 实例
export default service;
