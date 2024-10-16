<template>
	<el-drawer title="新增分组" v-model="state.isOpen" size="500px">
		<template #default>
			<div class="pt15 pr15 pb15 pl15" style="overflow: hidden">
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
			</div>
		</template>
		<template #footer>
			<div style="flex: auto" class="pt0 pr15 pb0 pl5">
				<el-button class="mb15" @click="onCancel"> 取消 </el-button>
				<el-button type="primary" class="mb15" @click="onSubmit"> 保存 </el-button>
			</div>
		</template>
	</el-drawer>
</template>

<script setup lang="ts" name="pagesDriveDrawer">
import { reactive, ref } from 'vue';
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
	isOpen: false,
});

// 打开抽屉
const open = async (groupId: string) => {
	state.isOpen = true;
	await getlistData();

	state.ruleForm = { groupId: groupId } as BatchAddDto;
	state.dialog.title = '批量新增';
	state.dialog.submitTxt = '新 增';
	state.dialog.isShowDialog = true;

	async function getlistData() {
		// devices
		var response = await useDeviceApi().getDeviceList();
		state.devices = response.items;

		response = await useProtocolTypeApi().getProtocolType();
		state.protocolTypeList = response.items;
	}
};

// 关闭弹窗
const closeDialog = () => {
	state.isOpen = false;
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
	open,
});
</script>
