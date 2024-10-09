<template>
	<div class="system-dept-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form ref="deptDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="任务编号">
							<el-input v-model="state.ruleForm.taskNo" placeholder="任务编号" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="容器条码">
							<el-input v-model="state.ruleForm.barcode" placeholder="容器条码" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="起始地址">
							<el-input v-model="state.ruleForm.fromNode" placeholder="起始地址" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="目标地址">
							<el-input v-model="state.ruleForm.toNode" placeholder="目标地址" />
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">提 交</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="systemDeptDialog">
import { reactive, ref } from 'vue';
import { useMonitorApi } from '/@/api/monitor';

// 定义变量内容
const deptDialogFormRef = ref();
const state = reactive({
	ruleForm: {
		taskNo: '',
		barcode: '',
		fromNode: '',
		toNode: '',
	},
	dialog: {
		isShowDialog: false,
		deviceNo: '',
		title: '',
	},
});

// 打开弹窗
const openDialog = async (deviceNo: string) => {
	state.dialog.title = deviceNo + ' 设备信息';
	state.dialog.deviceNo = deviceNo;

	var response = await useMonitorApi().getConveryState(deviceNo);

	state.ruleForm.taskNo = response.taskNo;
	state.ruleForm.barcode = response.barcode;
	state.ruleForm.fromNode = response.fromNode;
	state.ruleForm.toNode = response.toNode;

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
	deptDialogFormRef.value.validate(async (valid: boolean) => {
		if (!valid) return;
		await useMonitorApi().updateConveryState(state.dialog.deviceNo, state.ruleForm);
		closeDialog(); // 关闭弹窗
	});
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
