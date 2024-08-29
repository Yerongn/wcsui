<template>
	<div class="system-dept-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form ref="deptDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="上级部门">
							<el-cascader
								:options="state.deptData"
								:props="{ checkStrictly: true, emitPath: false, value: 'id', label: 'deptName' }"
								placeholder="请选择部门"
								clearable
								class="w100"
								v-model="state.ruleForm.parentId"
							>
								<template #default="{ node, data }">
									<span>{{ data.deptName }}</span>
									<span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
								</template>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="部门名称" prop="deptName" :rules="[{ required: true, message: '菜单类型不能为空', trigger: 'blur' }]">
							<el-input v-model="state.ruleForm.deptName" placeholder="请输入部门名称" clearable></el-input>
						</el-form-item>
					</el-col>

					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="排序">
							<el-input-number v-model="state.ruleForm.sort" :min="0" :max="999" controls-position="right" placeholder="请输入排序" class="w100" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="部门状态">
							<el-switch v-model="state.ruleForm.state" inline-prompt active-text="启" inactive-text="禁"></el-switch>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="部门描述">
							<el-input v-model="state.ruleForm.remark" type="textarea" placeholder="请输入部门描述" maxlength="150"></el-input>
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

<script setup lang="ts" name="systemDeptDialog">
import { reactive, ref } from 'vue';
import { useDeptApi } from '/@/api/dept';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
const guidEmpty = '00000000-0000-0000-0000-000000000000';

// 定义变量内容
const deptDialogFormRef = ref();
const state = reactive({
	ruleForm: {} as RowDeptType,
	deptData: [] as DeptTreeType[], // 部门数据
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
		submitTxt: '',
	},
});

// 打开弹窗
const openDialog = (type: string, row: RowDeptType) => {
	if (type === 'edit') {
		state.ruleForm = row;
		state.dialog.title = '修改部门';
		state.dialog.submitTxt = '修 改';
	} else {
		state.dialog.title = '新增部门';
		state.dialog.submitTxt = '新 增';
		state.ruleForm = {
			state: true,
			id: guidEmpty,
		} as RowDeptType;
		// 清空表单，此项需加表单验证才能使用
		// nextTick(() => {
		// 	deptDialogFormRef.value.resetFields();
		// });
	}
	getDeptData();
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
	if (state.ruleForm.parentId === undefined) {
		state.ruleForm.parentId = guidEmpty;
	}
	deptDialogFormRef.value.validate(async (valid: boolean) => {
		if (!valid) return;
		if (state.dialog.type === 'add') {
			await useDeptApi().addDept(state.ruleForm);
		} else {
			await useDeptApi().updateDept(state.ruleForm);
		}
		closeDialog(); // 关闭弹窗
		emit('refresh');
	});
};
// 初始化部门数据
const getDeptData = async () => {
	const response = await useDeptApi().getDepts({});
	state.deptData = response.items;
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
