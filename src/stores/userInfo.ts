import { defineStore } from 'pinia';
import { Session } from '/@/utils/storage';
import useLoginApi from '/@/api/login';
/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
export const useUserInfo = defineStore('userInfo', {
	state: (): UserInfosState => ({
		userInfos: {
			userName: '',
			photo: '',
			time: 0,
			avatar: '',
			roles: [],
			authBtnList: [],
		},
	}),
	actions: {
		async setUserInfos() {
			// 存储用户信息到浏览器缓存
			if (Session.get('userInfo')) {
				this.userInfos = Session.get('userInfo');
			} else {
				const userInfos = await this.getApiUserInfo();
				this.userInfos = userInfos;
			}
		},
		// 模拟接口数据
		async getApiUserInfo() {
			var res = await useLoginApi().getInfo();
			const user = res.user;
			let defaultRoles: Array<string> = [];
			if (res.roleCodes && res.roleCodes.length > 0) {
				// 验证返回的roles是否是一个非空数组
				defaultRoles = res.roleCodes;
				//this.permissions = res.permissionCodes;
			} else {
				defaultRoles = ['ROLE_DEFAULT'];
			}
			// 用户信息
			const userInfos = {
				userName: user.userName,
				photo:
					user.userName === 'admin'
						? 'https://img2.baidu.com/it/u=1978192862,2048448374&fm=253&fmt=auto&app=138&f=JPEG?w=504&h=500'
						: 'https://img2.baidu.com/it/u=2370931438,70387529&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
				time: new Date().getTime(),
				avatar: user.icon ? user.icon : '/favicon.ico',
				permissions: res.permissionCodes,
				roles: defaultRoles,
				authBtnList: res.permissionCodes,
			};
			Session.set('userInfo', userInfos);

			return userInfos;
		},
	},
});
