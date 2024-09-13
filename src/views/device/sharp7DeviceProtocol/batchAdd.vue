<template>
	<div class="system-group-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form ref="groupDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="设备编号" prop="deviceNo" :rules="[{ required: true, message: '设备编号不能为空', trigger: 'blur' }]">
							<el-select v-model="state.ruleForm.deviceNo" filterable placeholder="请选择" clearable class="w100">
								<el-option v-for="item in state.devices" :key="item.id" :label="item.deviceNo" :value="item.deviceNo" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="设备协议">
							<el-input v-model="state.ruleForm.protocol" placeholder="请输入设备协议" clearable></el-input>
						</el-form-item>
					</el-col>

					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="设备分组" prop="groupId" :rules="[{ required: true, message: '分组不能为空', trigger: 'blur' }]">
							<el-select v-model="state.ruleForm.groupId" placeholder="请选择" clearable class="w100">
								<el-option v-for="item in state.groups" :key="item.id" :label="item.groupName" :value="item.id" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="DB块编号">
							<el-input v-model="state.ruleForm.dbNumber" placeholder="请输入DB块编号" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="起始偏移量">
							<el-input v-model="state.ruleForm.startByte" placeholder="请输入起始偏移量" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="数据长度">
							<el-input v-model="state.ruleForm.dataLength" placeholder="请输入数据长度" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="状态">
							<el-switch v-model="state.ruleForm.state" inline-prompt active-text="启" inactive-text="禁"></el-switch>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="分组描述">
							<el-input v-model="state.ruleForm.remark" type="textarea" placeholder="请输入分组描述" maxlength="150"></el-input>
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

<script setup lang="ts" name="systemGroupDialog">
import { reactive, ref } from 'vue';
import { useGroupApi } from '/@/api/group';
import { useDeviceApi } from '/@/api/device';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const groupDialogFormRef = ref();
const state = reactive({
	ruleForm: {} as Sharp7DeviceProtocol,
	groups: [] as Group[],
	devices: [] as DeviceType[], // 设备数据
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
		submitTxt: '',
	},
});

// 打开弹窗
const openDialog = async (type: string, row: Sharp7DeviceProtocol) => {
	await getlistData();

	if (type === 'edit') {
		state.ruleForm = row;
		state.dialog.title = '修改分组';
		state.dialog.submitTxt = '修 改';
	} else {
		state.ruleForm = { state: true } as Sharp7DeviceProtocol;
		state.dialog.title = '新增分组';
		state.dialog.submitTxt = '新 增';
		// 清空表单，此项需加表单验证才能使用
		// nextTick(() => {
		// 	groupDialogFormRef.value.resetFields();
		// });
	}
	state.dialog.type = type;
	state.dialog.isShowDialog = true;

	async function getlistData() {
		// groups
		let response = await useGroupApi().getGroupList();
		state.groups = response.items;

		// devices
		response = await useDeviceApi().getDeviceList();
		state.devices = response.items;
	}
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
	groupDialogFormRef.value.validate(async (valid: boolean) => {
		if (!valid) return;
		if (state.dialog.type === 'add') {
			await useGroupApi().addGroup(state.ruleForm);
		} else {
			await useGroupApi().updateGroup(state.ruleForm);
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
