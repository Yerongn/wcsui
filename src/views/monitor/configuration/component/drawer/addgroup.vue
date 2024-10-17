<template>
	<el-drawer title="新增分组" v-model="state.isOpen" size="500px">
		<template #default>
			<div class="pt15 pr15 pb15 pl15" style="overflow: hidden">
				<el-form ref="groupDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
					<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="分组名称">
								<el-input v-model="state.ruleForm.groupName" placeholder="请输入分组名称" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="扫描频率">
								<el-input v-model="state.ruleForm.scanInterval" placeholder="请输入扫描频率" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="6" :md="6" :lg="6" :xl="6" class="mb20">
							<el-form-item label="分组状态">
								<el-switch v-model="state.ruleForm.state" inline-prompt active-text="启" inactive-text="禁"></el-switch>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="6" :md="6" :lg="6" :xl="6" class="mb20">
							<el-form-item label="自动读取">
								<el-switch v-model="state.ruleForm.isRead" inline-prompt active-text="是" inactive-text="否"></el-switch>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
							<el-form-item label="分组描述">
								<el-input v-model="state.ruleForm.remark" type="textarea" placeholder="请输入分组描述" maxlength="150"></el-input>
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
import { useGroupApi } from '/@/api/group';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const groupDialogFormRef = ref();
const state = reactive({
	ruleForm: {} as Group,
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
		submitTxt: '',
	},
	isOpen: false,
});

// 打开抽屉
const open = async (driveId: string) => {
	state.isOpen = true;
	state.ruleForm = { state: true, scanInterval: 500, isRead: true, driveId: driveId } as Group;
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
	groupDialogFormRef.value.validate(async (valid: boolean) => {
		if (!valid) return;
		await useGroupApi().addGroup(state.ruleForm);
		closeDialog(); // 关闭弹窗
		emit('refresh');
	});
};

// 暴露变量
defineExpose({
	open,
});
</script>
