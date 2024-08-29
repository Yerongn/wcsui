<template>
	<div class="system-user-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form ref="userDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="账户名称">
							<el-input v-model="state.ruleForm.userName" placeholder="请输入账户名称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="用户昵称">
							<el-input v-model="state.ruleForm.nick" placeholder="请输入用户昵称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="关联角色">
							<el-select v-model="state.ruleForm.roleIds" multiple collapse-tags placeholder="请选择" clearable class="w100">
								<el-option v-for="item in state.roleData" :key="item.id" :label="item.roleName" :value="item.id" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="部门">
							<el-cascader
								:options="state.deptData"
								:props="{ checkStrictly: true, emitPath: false, value: 'id', label: 'deptName' }"
								placeholder="请选择部门"
								clearable
								class="w100"
								v-model="state.ruleForm.deptId"
							>
								<template #default="{ node, data }">
									<span>{{ data.deptName }}</span>
									<span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
								</template>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="手机号">
							<el-input v-model="state.ruleForm.phone" placeholder="请输入手机号" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="邮箱">
							<el-input v-model="state.ruleForm.email" placeholder="请输入" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="性别">
							<el-select v-model="state.ruleForm.sex" placeholder="请选择" clearable class="w100">
								<el-option label="男" value="Male"></el-option>
								<el-option label="女" value="Woman"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="用户状态">
							<el-switch v-model="state.ruleForm.state" inline-prompt active-text="启" inactive-text="禁"></el-switch>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="用户描述">
							<el-input v-model="state.ruleForm.remark" type="textarea" placeholder="请输入用户描述" maxlength="150"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">{{ state.dialog.submitTxt }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="systemUserDialog">
import { reactive, ref } from 'vue';
import { useDeptApi } from '/@/api/dept';
import { useRoleApi } from '/@/api/role';
import { useUserApi } from '/@/api/user';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
const guidEmpty = '00000000-0000-0000-0000-000000000000';

// 定义变量内容
const userDialogFormRef = ref();
const state = reactive({
	ruleForm: {} as RowUserType,
	deptData: [] as DeptTreeType[], // 部门数据
	roleData: [] as RowRoleType[], // 角色数据
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
		submitTxt: '',
	},
});

// 打开弹窗
const openDialog = async (type: string, row: RowUserType) => {
	await getDeptData();
	await getRoleData();

	if (type === 'edit') {
		state.ruleForm = row;
		state.dialog.title = '修改用户';
		state.dialog.submitTxt = '修 改';
		var roleRespond = await useRoleApi().getRolesByUserId(row.id);
		state.ruleForm.roleIds = [];
		roleRespond.map((val: any) => {
			state.ruleForm.roleIds.push(val.roleId);
		});
	} else {
		state.ruleForm = { id: guidEmpty, state: true, password: '123456' } as RowUserType;
		state.dialog.title = '新增用户';
		state.dialog.submitTxt = '新 增';
		// 清空表单，此项需加表单验证才能使用
		// nextTick(() => {
		// 	userDialogFormRef.value.resetFields();
		// });
	}
	state.dialog.type = type;
	state.dialog.isShowDialog = true;
};
// 关闭弹窗
const closeDialog = () => {
	state.dialog.isShowDialog = false;
};
// 取消
const onCancel = () => {
	closeDialog();
};
// 提交
const onSubmit = () => {
	userDialogFormRef.value.validate(async (valid: boolean) => {
		if (!valid) return;
		if (state.dialog.type === 'add') {
			await useUserApi().addUser(state.ruleForm);
		} else {
			await useUserApi().updateUser(state.ruleForm);
		}
		closeDialog(); // 关闭弹窗
		emit('refresh');
	});
};

// 获取部门下拉数据
const getDeptData = async () => {
	const response = await useDeptApi().getDepts({});
	state.deptData = response.items;
};

// 获取角色下拉数据
const getRoleData = async () => {
	const response = await useRoleApi().getRoles({});
	state.roleData = response.items;
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
