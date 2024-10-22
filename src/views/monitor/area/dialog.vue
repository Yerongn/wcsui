<template>
	<div class="system-processflow-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form ref="dialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="区域名称" prop="areaName" :rules="[{ required: true, message: '区域名称不能为空', trigger: 'blur' }]">
							<el-input v-model="state.ruleForm.areaName" placeholder="请输入区域名称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="区域状态">
							<el-switch v-model="state.ruleForm.state" inline-prompt active-text="启" inactive-text="禁"></el-switch>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="区域描述">
							<el-input v-model="state.ruleForm.remark" placeholder="请输入区域描述" maxlength="150"></el-input>
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

import { useMonitorApi } from '/@/api/monitor';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const dialogFormRef = ref();
const state = reactive({
	ruleForm: {} as AreaMonitor,
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
		submitTxt: '',
	},
});

// 打开弹窗
const openDialog = (type: string, row: AreaMonitor) => {
	if (type === 'edit') {
		state.ruleForm = row;
		state.dialog.title = '修改区域';
		state.dialog.submitTxt = '修 改';
	} else {
		state.dialog.title = '新增区域';
		state.dialog.submitTxt = '新 增';
		state.ruleForm = { state: true } as AreaMonitor;
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
	dialogFormRef.value.validate(async (valid: boolean) => {
		if (!valid) return;
		if (state.dialog.type === 'add') {
			await useMonitorApi().addMonitor(state.ruleForm);
		} else {
			await useMonitorApi().updateAreaMonitor(state.ruleForm);
		}
		closeDialog(); // 关闭弹窗
		emit('refresh');
	});
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
