<template>
	<div class="system-processflow-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form ref="processflowDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="流程名称" prop="processflowName" :rules="[{ required: true, message: '流程名称不能为空', trigger: 'blur' }]">
							<el-input v-model="state.ruleForm.processflowName" placeholder="请输入流程名称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="流程描述">
							<el-input v-model="state.ruleForm.remark" placeholder="请输入流程描述" maxlength="150"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">{{ state.dialog.submitTxt }}</el-button>
					<el-button type="primary" @click="onConfigure" size="default">配置流程</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="systemDeptDialog">
import { reactive, ref } from 'vue';

import { useRouter } from 'vue-router';
import { useProcessFlowApi } from '/@/api/processflow';

const router = useRouter();

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
const guidEmpty = '00000000-0000-0000-0000-000000000000';

// 定义变量内容
const processflowDialogFormRef = ref();
const state = reactive({
	ruleForm: {} as ProcessFlowType,
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
		submitTxt: '',
	},
});

// 打开弹窗
const openDialog = (type: string, row: ProcessFlowType) => {
	if (type === 'edit') {
		state.ruleForm = row;
		state.dialog.title = '修改流程';
		state.dialog.submitTxt = '修 改';
	} else {
		state.dialog.title = '新增流程';
		state.dialog.submitTxt = '新 增';
		state.ruleForm = {
			state: true,
			id: guidEmpty,
		} as ProcessFlowType;
		// 清空表单，此项需加表单验证才能使用
		// nextTick(() => {
		// 	processflowDialogFormRef.value.resetFields();
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
	processflowDialogFormRef.value.validate(async (valid: boolean) => {
		if (!valid) return;
		if (state.dialog.type === 'add') {
			await useProcessFlowApi().addProcessFlow(state.ruleForm);
		} else {
			await useProcessFlowApi().updateProcessFlow(state.ruleForm);
		}
		closeDialog(); // 关闭弹窗
		emit('refresh');
	});
};

const onConfigure = () => {
	router.push({ path: `/rule/workflow/${state.ruleForm.id}/${state.ruleForm.processflowName}` }); //'/rule/workflow/'
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss">
.system-processflow-dialog-container {
	.menu-data-tree {
		width: 100%;
		border: 1px solid var(--el-border-color);
		border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
		padding: 5px;
	}
}
</style>
