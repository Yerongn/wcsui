<template>
	<div>
		<el-drawer title="新增驱动" v-model="state.isOpen" size="700px">
			<div class="pt15 pr15 pb15 pl15">
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

					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-table :data="state.ruleForm.driveargs" border style="width: 100%">
							<el-table-column prop="propertyDesc" label="属性描述" width="180" />
							<el-table-column prop="propertyName" label="属性名称" width="180" />
							<el-table-column prop="propertyValue" label="属性值">
								<template #default="{ row }">
									<el-select v-if="row.propertyName === 'CpuType'" v-model="row.propertyValue" placeholder="请选择" clearable class="w100">
										<el-option v-for="item in state.cpuType" :key="item.dicValue" :label="item.dicLabel" :value="item.dicValue" />
									</el-select>

									<el-input v-else v-model="row.propertyValue"></el-input>
								</template>
							</el-table-column>
						</el-table>
					</el-col>
					<el-form-item>
						<el-button class="mb15" @click="onCancel">
							<SvgIcon name="ele-RefreshRight" />
							取消
						</el-button>
						<el-button type="primary" class="mb15" @click="onSubmit">
							<SvgIcon name="ele-Check" />
							保存
						</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-drawer>
	</div>
</template>

<script setup lang="ts" name="pagesDriveDrawer">
import { reactive, ref } from 'vue';
import { useDriveApi } from '/@/api/drive';
import { useDicApi } from '/@/api/dic';
// 定义子组件向父组件传值/事件
const emit = defineEmits(['label', 'node']);

// 定义变量内容
const lineRef = ref();
const nodeRef = ref();
const state = reactive({
	ruleForm: {} as Drive,
	driveType: [] as DriveType[],
	cpuType: [] as ListType[],
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
		submitTxt: '',
	},
	isOpen: false,
});

// 打开抽屉
const open = async () => {
	state.isOpen = true;
	let response = await useDriveApi().geDriveTypeAndArg();
	state.driveType = response.items;

	response = await useDicApi().getDicsByDicType('CpuType');
	state.cpuType = response.items;
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
	open,
});
</script>
