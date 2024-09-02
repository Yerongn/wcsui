<template>
	<div class="system-job-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form ref="jobDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="任务名称">
							<el-input v-model="state.ruleForm.jobId" placeholder="请输入任务名称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="任务组名">
							<el-input v-model="state.ruleForm.groupName" placeholder="请输入任务组名" clearable></el-input>
						</el-form-item>
					</el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="任务类型">
							<el-input v-model="state.ruleForm.jobType" placeholder="请输入任务类型" clearable></el-input>
						</el-form-item>
					</el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="程序集名称">
							<el-input v-model="state.ruleForm.assemblyName" placeholder="请输入程序集" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
                        <el-form-item label="执行模式">
							<el-switch v-model="state.ruleForm.concurrent" inline-prompt active-text="并行" inactive-text="串行"></el-switch>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="任务描述">
							<el-input v-model="state.ruleForm.description" type="textarea" placeholder="请输入任务描述" maxlength="150"></el-input>
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

<script setup lang="ts" name="taskJobDialog">
import { reactive, ref } from 'vue';
import { useJobApi } from '/@/api/task/job';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const jobDialogFormRef = ref();
const state = reactive({
	ruleForm: {} as JobType,
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
		submitTxt: '',
	},
});

// 打开弹窗
const openDialog = async (type: string, row: JobType) => {
	if (type === 'edit') {
		state.ruleForm = row;
		state.dialog.title = '修改任务';
		state.dialog.submitTxt = '修 改';
	} else {
		state.ruleForm = { } as JobType;
		state.dialog.title = '新增任务';
		state.dialog.submitTxt = '新 增';
		// 清空表单，此项需加表单验证才能使用
		// nextTick(() => {
		// 	jobDialogFormRef.value.resetFields();
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
	jobDialogFormRef.value.validate(async (valid: boolean) => {
		if (!valid) return;
		if (state.dialog.type === 'add') {
			await useJobApi().addJob(state.ruleForm);
		} else {
			await useJobApi().updateJob(state.ruleForm);
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
