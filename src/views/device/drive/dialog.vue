<template>
	<div class="system-drive-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form ref="driveDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="驱动名称">
							<el-input v-model="state.ruleForm.driveName" placeholder="请输入驱动名称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="驱动类型" prop="driveType" :rules="[{ required: true, message: '驱动类型不能为空', trigger: 'blur' }]">
							<el-select v-model="state.ruleForm.driveType" placeholder="请选择" clearable class="w100" @change="onDriveTypeChange">
								<el-option v-for="item in state.driveType" :key="item.driveType" :label="item.driveType" :value="item.driveType" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="驱动状态">
							<el-switch v-model="state.ruleForm.state" inline-prompt active-text="启" inactive-text="禁"></el-switch>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="驱动描述">
							<el-input v-model="state.ruleForm.remark" type="textarea" placeholder="请输入驱动描述" maxlength="150"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-divider content-position="left">驱动参数</el-divider>
				<el-table :data="state.ruleForm.driveargs" border style="width: 100%">
					<el-table-column prop="propertyDesc" label="属性描述" width="180" />
					<el-table-column prop="propertyName" label="属性名称" width="180" />
					<el-table-column prop="propertyValue" label="属性值">
						<template #default="{ row }">
							<el-input v-model="row.propertyValue"></el-input>
						</template>
					</el-table-column>
				</el-table>
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

<script setup lang="ts" name="systemDriveDialog">
import { reactive, ref } from 'vue';
import { useDriveApi } from '/@/api/drive';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const driveDialogFormRef = ref();
const state = reactive({
	ruleForm: {} as Drive,
	driveType: [] as DriveType[],
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
		submitTxt: '',
	},
});

// 打开弹窗
const openDialog = async (type: string, row: Drive) => {
	const response = await useDriveApi().geDriveTypeAndArg();
	state.driveType = response.items;

	if (type === 'edit') {
		state.ruleForm = row;
		state.dialog.title = '修改驱动';
		state.dialog.submitTxt = '修 改';
	} else {
		state.ruleForm = { state: true } as Drive;
		state.dialog.title = '新增驱动';
		state.dialog.submitTxt = '新 增';
		// 清空表单，此项需加表单验证才能使用
		// nextTick(() => {
		// 	driveDialogFormRef.value.resetFields();
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
	driveDialogFormRef.value.validate(async (valid: boolean) => {
		if (!valid) return;
		if (state.dialog.type === 'add') {
			await useDriveApi().addDrive(state.ruleForm);
		} else {
			await useDriveApi().updateDrive(state.ruleForm);
		}
		closeDialog(); // 关闭弹窗
		emit('refresh');
	});
};

const onDriveTypeChange = (value: string) => {
	const driveType = state.driveType.find((d) => d.driveType === value);
	state.ruleForm.driveargs = driveType?.driveargs ?? [];
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
