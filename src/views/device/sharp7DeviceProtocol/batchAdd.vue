<template>
	<div class="system-group-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form ref="batchAddDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="设备协议">
							<el-select v-model="state.ruleForm.protocol" placeholder="请选择" clearable class="w100">
								<el-option
									v-for="item in state.protocolTypeList"
									:key="item.protocolType"
									:label="item.protocolTypeDescribe"
									:value="item.protocolType"
								/>
							</el-select>
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
						<el-form-item label="起始设备" prop="deviceNo" :rules="[{ required: true, message: '设备编号不能为空', trigger: 'blur' }]">
							<el-select v-model="state.ruleForm.deviceNo" filterable placeholder="请选择" clearable class="w100">
								<el-option v-for="item in state.devices" :key="item.id" :label="item.deviceNo" :value="item.deviceNo" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="设备数量">
							<el-input v-model="state.ruleForm.deviceNum" placeholder="请输入数据长度" clearable></el-input>
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
import { useProtocolTypeApi } from '/@/api/protocol';
import { useSharp7DeviceProtocolApi } from '/@/api/sharp7DeviceProtocol';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const batchAddDialogFormRef = ref();
const state = reactive({
	ruleForm: {} as BatchAddDto,
	protocolTypeList: [] as Array<protocolType>,
	groups: [] as Group[],
	devices: [] as DeviceType[], // 设备数据
	dialog: {
		isShowDialog: false,
		title: '',
		submitTxt: '',
	},
});

// 打开弹窗
const openDialog = async () => {
	await getlistData();

	state.ruleForm = {} as BatchAddDto;
	state.dialog.title = '批量新增';
	state.dialog.submitTxt = '新 增';
	state.dialog.isShowDialog = true;

	async function getlistData() {
		// groups
		let response = await useGroupApi().getGroupList();
		state.groups = response.items;

		// devices
		response = await useDeviceApi().getDeviceList();
		state.devices = response.items;

		response = await useProtocolTypeApi().getProtocolType();
		state.protocolTypeList = response.items;
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
	batchAddDialogFormRef.value.validate(async (valid: boolean) => {
		if (!valid) return;
		await useSharp7DeviceProtocolApi().batchAdd(state.ruleForm);

		closeDialog(); // 关闭弹窗
		emit('refresh');
	});
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
