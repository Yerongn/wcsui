<template>
	<div class="system-role-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form ref="roleDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="角色名称" prop="roleName" :rules="[{ required: true, message: '角色名称不能为空', trigger: 'blur' }]">
							<el-input v-model="state.ruleForm.roleName" placeholder="请输入角色名称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="角色标识" prop="roleName" :rules="[{ required: true, message: '角色标识不能为空', trigger: 'blur' }]">
							<template #label>
								<el-tooltip effect="dark" content="用于 `router/route.ts` meta.roles" placement="top-start">
									<span>角色标识</span>
								</el-tooltip>
							</template>
							<el-input v-model="state.ruleForm.roleCode" placeholder="请输入角色标识" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="排序">
							<el-input-number
								v-model="state.ruleForm.orderNum"
								:min="0"
								:max="999"
								controls-position="right"
								placeholder="请输入排序"
								class="w100"
							/>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="角色状态">
							<el-switch v-model="state.ruleForm.state" inline-prompt active-text="启" inactive-text="禁"></el-switch>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="部门" prop="deptIds" :rules="[{ required: true, message: '部门集合不能为空', trigger: 'blur' }]">
							<el-cascader
								:options="state.deptData"
								:props="state.deptProps"
								placeholder="请选择所属部门"
								clearable
								class="w100"
								v-model="state.ruleForm.deptIds"
							>
								<template #default="{ node, data }">
									<span>{{ data.deptName }}</span>
									<span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
								</template>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="角色描述">
							<el-input v-model="state.ruleForm.remark" type="textarea" placeholder="请输入角色描述" maxlength="150"></el-input>
						</el-form-item>
					</el-col>

					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="菜单权限">
							<el-tree
								ref="treeRef"
								:data="state.menuData"
								node-key="id"
								:props="state.menuProps"
								show-checkbox
								class="menu-data-tree"
								default-expand-all
							/>
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

<script setup lang="ts" name="systemRoleDialog">
import { reactive, ref } from 'vue';
import type { ElTree } from 'element-plus';
import { useMenuApi } from '/@/api/menu';
import { useRoleApi } from '/@/api/role';
import { useDeptApi } from '/@/api/dept';

// 定义子组件向父组件传值/事件 :default-checked-keys="state.ruleForm.menuIds"
const emit = defineEmits(['refresh']);
const treeRef = ref<InstanceType<typeof ElTree>>();
const guidEmpty = '00000000-0000-0000-0000-000000000000';

// 定义变量内容
const roleDialogFormRef = ref();
const state = reactive({
	ruleForm: {} as RowRoleType,
	menuData: [],
	deptData: [],
	menuProps: {
		children: 'children',
		label: 'title',
	},
	deptProps: { multiple: true, checkStrictly: true, emitPath: false, value: 'id', label: 'deptName' },
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
		submitTxt: '',
	},
});

// 打开弹窗
const openDialog = async (type: string, row: RowRoleType) => {
	getDeptData();
	await getMenuData();
	if (type === 'edit') {
		state.ruleForm = row;
		var menuRespond = await useMenuApi().getMemusByRoleId(row.id);
		state.ruleForm.menuIds = [];
		menuRespond.map((val: any) => {
			state.ruleForm.menuIds.push(val.id);
			setTimeout(() => {
				treeRef.value?.setChecked(val.id, true, false);
			}, 100);
		});

		var deptRespond = await useDeptApi().getDeptsByRoleId(row.id);
		state.ruleForm.deptIds = [];
		deptRespond.map((val: any) => {
			state.ruleForm.deptIds.push(val.id);
		});

		state.dialog.title = '修改角色';
		state.dialog.submitTxt = '修 改';
	} else {
		state.dialog.title = '新增角色';
		state.dialog.submitTxt = '新 增';
		state.ruleForm = {
			state: true,
			id: guidEmpty,
		} as RowRoleType;
		state.dialog.type = type;

		// 清空表单，此项需加表单验证才能使用
		// nextTick(() => {
		// 	roleDialogFormRef.value.resetFields();
		// });
	}

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
	roleDialogFormRef.value.validate(async (valid: boolean) => {
		if (!valid) return;
		state.ruleForm.menuIds = treeRef.value?.getCheckedKeys(true) as Array<number>;
		state.ruleForm.menuIds.push(...(treeRef.value?.getHalfCheckedKeys() as Array<number>));

		if (state.dialog.type === 'add') {
			await useRoleApi().addRole(state.ruleForm);
		} else {
			await useRoleApi().updateRole(state.ruleForm);
		}
		closeDialog(); // 关闭弹窗
		emit('refresh');
	});
};
// 获取菜单结构数据
const getMenuData = async () => {
	var response = await useMenuApi().getMemus({});
	state.menuData = response.items;
};

// 获取部门下拉数据
const getDeptData = async () => {
	const response = await useDeptApi().getDepts({});
	state.deptData = response.items;
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss">
.system-role-dialog-container {
	.menu-data-tree {
		width: 100%;
		border: 1px solid var(--el-border-color);
		border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
		padding: 5px;
	}
}
</style>
