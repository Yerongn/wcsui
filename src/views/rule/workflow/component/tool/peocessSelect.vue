<template>
	<div class="rule-workflow-processSelect-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form ref="userDialogFormRef" :model="state.processData" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="流程选择">
							<el-select v-model="state.processData.name" multiple collapse-tags placeholder="请选择" clearable class="w100">
								<el-option v-for="item in state.processList" :key="item.processType" :label="item.processDescribe" :value="item.processType" />
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button type="primary" @click="onSubmit" size="default">{{ state.dialog.submitTxt }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="systemUserDialog">
import { reactive, ref } from 'vue';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const userDialogFormRef = ref();
const state = reactive({
	processList: [] as Process[], // 流程列表
	processData: {
		name: '',
		describe: '',
	},
	dialog: {
		isShowDialog: false,
		title: '流程选择',
		submitTxt: '',
	},
});

// 打开弹窗
const openDialog = async (list: Process[]) => {
	state.processList = list;
	state.dialog.submitTxt = '提 交';
	state.dialog.isShowDialog = true;
};

// 关闭弹窗
const closeDialog = () => {
	state.dialog.isShowDialog = false;
};

// 提交
const onSubmit = () => {
	userDialogFormRef.value.validate(async (valid: boolean) => {
		if (!valid) return;
		closeDialog(); // 关闭弹窗
		emit('refresh');
	});
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss">
.rule-workflow-processSelect-container {
	:deep(.el-card__body) {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: auto;
		.el-table {
			flex: 1;
		}
	}
}
</style>
