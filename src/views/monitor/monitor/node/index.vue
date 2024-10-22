<template>
	<div class="system-dept-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-tabs v-model="state.activeName" type="border-card" class="node-tabs" @tab-click="handleClick">
				<el-tab-pane label="设备信息" name="deviceInfo">
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
								<el-form-item label="异常编码">
									<el-input v-model="state.ruleForm.errorCode" placeholder="异常编码" />
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
				</el-tab-pane>
				<el-tab-pane label="设备日志" name="deviceLog">
					<el-table
						:data="state.tableData.deviceLogData"
						v-loading="state.tableData.loading"
						height="200"
						style="width: 100%"
						:row-class-name="tableRowClassName"
					>
						<el-table-column prop="timestamp" label="Time" width="110" />
						<el-table-column prop="level" label="Level" width="100" />
						<el-table-column prop="message" show-overflow-tooltip label="Message" />
						<!-- <el-table-column align="right">
							<template #header>
								<el-button type="primary" @click="getTableData" class="ml10"> 刷新 </el-button>
							</template>
						</el-table-column> -->
					</el-table>
				</el-tab-pane>
			</el-tabs>

			<template #footer v-if="state.activeName === 'deviceInfo'">
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">提 交</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="systemDeptDialog">
import { TabsPaneContext } from 'element-plus';
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
		errorCode: '',
	},
	tableData: {
		deviceLogData: [] as Array<DeviceLogType>,
		loading: false,
	},
	activeName: 'deviceInfo',
	dialog: {
		isShowDialog: false,
		deviceNo: '',
		title: '',
	},
});

const tableRowClassName = ({ row }: { row: DeviceLogType }) => {
	if (row.level === 'Error') {
		return 'error-row';
	}
	return '';
};

// 初始化表格数据
const getTableData = async () => {
	state.tableData.loading = true;
	const response = await useMonitorApi().getDeviceLog(state.dialog.deviceNo);
	state.tableData.deviceLogData = response.items;
	state.tableData.loading = false;
};

const handleClick = async (tab: TabsPaneContext) => {
	const tabName = tab.props.name;
	if (tabName === 'deviceLog' && state.tableData.deviceLogData.length === 0) await getTableData();
};

// 打开弹窗
const openDialog = async (deviceNo: string) => {
	state.dialog.title = deviceNo + ' 设备信息';

	// if (state.dialog.deviceNo !== deviceNo) {
	state.tableData.deviceLogData = [];
	// }

	state.dialog.deviceNo = deviceNo;
	state.activeName = 'deviceInfo';

	var response = await useMonitorApi().getConveryState(deviceNo);

	state.ruleForm.taskNo = response.taskNo;
	state.ruleForm.barcode = response.barcode;
	state.ruleForm.fromNode = response.fromNode;
	state.ruleForm.toNode = response.toNode;
	state.ruleForm.errorCode = response.errorCode;

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
<style>
.el-table .error-row {
	--el-table-tr-bg-color: var(--el-color-error-light-9);
}
</style>
