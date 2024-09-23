<template>
	<div class="system-group-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form ref="groupDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="分组名称">
							<el-input v-model="state.ruleForm.groupName" placeholder="请输入分组名称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="设备驱动" prop="driveId" :rules="[{ required: true, message: '设备驱动不能为空', trigger: 'blur' }]">
							<el-select v-model="state.ruleForm.driveId" popper-class="custom-header" placeholder="请选择" clearable class="w100">
								<template #header>
									<el-button text bg size="small"> Add </el-button>
								</template>
								<el-option v-for="item in state.drives" :key="item.id" :label="item.driveName" :value="item.id" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="扫描频率">
							<el-input v-model="state.ruleForm.scanInterval" placeholder="请输入扫描频率" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="分组状态">
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
import { useDriveApi } from '/@/api/drive';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const groupDialogFormRef = ref();
const state = reactive({
	ruleForm: {} as Group,
	drives: [] as Drive[],
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
		submitTxt: '',
	},
});

// 打开弹窗
const openDialog = async (type: string, row: Group) => {
	const response = await useDriveApi().getDriveList();
	state.drives = response.items;

	if (type === 'edit') {
		state.ruleForm = row;
		state.dialog.title = '修改分组';
		state.dialog.submitTxt = '修 改';
	} else {
		state.ruleForm = { state: true, scanInterval: 500 } as Group;
		state.dialog.title = '新增分组';
		state.dialog.submitTxt = '新 增';
		// 清空表单，此项需加表单验证才能使用
		// nextTick(() => {
		// 	groupDialogFormRef.value.resetFields();
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
