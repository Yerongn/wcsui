<template>
	<div class="system-ruleEngine-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form ref="ruleEngineDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="规则名称" prop="ruleName" :rules="[{ required: true, message: '规则名称不能为空', trigger: 'blur' }]">
							<el-input v-model="state.ruleForm.ruleName" placeholder="请输入规则名称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="设备编号" prop="deviceNo" :rules="[{ required: true, message: '设备编号不能为空', trigger: 'blur' }]">
							<el-select v-model="state.ruleForm.deviceNo" filterable placeholder="请选择" clearable class="w100">
								<el-option v-for="item in state.deviceData" :key="item.id" :label="item.deviceNo" :value="item.deviceNo" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="工艺流程" prop="workflowId" :rules="[{ required: true, message: '工艺流程不能为空', trigger: 'blur' }]">
							<el-select v-model="state.ruleForm.workflowId" filterable placeholder="请选择" clearable class="w100">
								<el-option v-for="item in state.processFlowData" :key="item.id" :label="item.processflowName" :value="item.id" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="规则表达式">
							<el-input v-model="state.ruleForm.expression" placeholder="请输入规则表达式" maxlength="150"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="规则描述">
							<el-input v-model="state.ruleForm.remark" type="textarea" placeholder="请输入规则描述" maxlength="150"></el-input>
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
import { useRuleEngineApi } from '/@/api/ruleEngine';
import { useDeviceApi } from '/@/api/device';
import { useProcessFlowApi } from '/@/api/processflow';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
const guidEmpty = '00000000-0000-0000-0000-000000000000';

// 定义变量内容
const ruleEngineDialogFormRef = ref();
const state = reactive({
	deviceData: [] as DeviceType[], // 设备数据
	processFlowData: [] as ProcessFlowType[], // 流程数据
	ruleForm: {} as RuleEngineType,
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
		submitTxt: '',
	},
});

// 打开弹窗
const openDialog = async (type: string, row: RuleEngineType) => {
	await getDeviceData();
	await getProcessFlowData();

	if (type === 'edit') {
		state.ruleForm = row;
		state.dialog.title = '修改规则';
		state.dialog.submitTxt = '修 改';
	} else {
		state.dialog.title = '新增规则';
		state.dialog.submitTxt = '新 增';
		state.ruleForm = {
			state: true,
			id: guidEmpty,
		} as RuleEngineType;
		// 清空表单，此项需加表单验证才能使用
		// nextTick(() => {
		// 	ruleEngineDialogFormRef.value.resetFields();
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
	ruleEngineDialogFormRef.value.validate(async (valid: boolean) => {
		if (!valid) return;
		if (state.dialog.type === 'add') {
			await useRuleEngineApi().addRuleEngine(state.ruleForm);
		} else {
			await useRuleEngineApi().updateRuleEngine(state.ruleForm);
		}
		closeDialog(); // 关闭弹窗
		emit('refresh');
	});
};

// 获取下拉数据
const getDeviceData = async () => {
	const response = await useDeviceApi().getDeviceList();
	state.deviceData = response.items;
};

// 获取下拉数据
const getProcessFlowData = async () => {
	const response = await useProcessFlowApi().getProcessFlowList();
	state.processFlowData = response.items;
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss">
.system-ruleEngine-dialog-container {
	.menu-data-tree {
		width: 100%;
		border: 1px solid var(--el-border-color);
		border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
		padding: 5px;
	}
}
</style>
