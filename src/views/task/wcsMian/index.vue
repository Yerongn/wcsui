<template>
	<div class="system-wcs-container layout-padding">
		<el-card shadow="hover" class="layout-padding-auto">
			<div class="system-wcs-search mb15">
				<el-input size="default" placeholder="请输入任务编号" v-model="state.tableData.queryParams.wcsTaskNo" style="max-width: 180px"> </el-input>
				<el-select
					size="default"
					v-model="state.tableData.queryParams.taskStatus"
					placeholder="请选择任务状态"
					clearable
					style="max-width: 180px"
					class="ml10"
				>
					<el-option v-for="item in state.taskStatusType" :key="item.dicValue" :label="item.dicLabel" :value="item.dicValue">
						<span style="float: left">{{ item.dicLabel }} ({{ item.dicValue }})</span>
						<!-- <span style="float: left">{{ item.dicLabel }}</span>
						<span style="float: right; color: var(--el-text-color-secondary); font-size: 13px">
							{{ item.dicValue }}
						</span> -->
					</el-option>
				</el-select>
				<el-input
					size="default"
					placeholder="请输入容器条码"
					v-model="state.tableData.queryParams.containerBarcode"
					style="max-width: 180px"
					class="ml10"
				></el-input>
				<el-input
					size="default"
					placeholder="请输入起始地址"
					v-model="state.tableData.queryParams.sourceAddress"
					style="max-width: 180px"
					class="ml10"
				></el-input>
				<el-input
					size="default"
					placeholder="请输入目标地址"
					v-model="state.tableData.queryParams.targetAddress"
					style="max-width: 180px"
					class="ml10"
				></el-input>

				<el-button size="default" type="primary" @click="getTableData" class="ml10">
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button>
			</div>
			<el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
				<el-table-column type="expand">
					<template #default="props">
						<div m="4">
							<el-table :data="props.row.taskSubs">
								<el-table-column type="index" label="序号" width="60" />
								<el-table-column prop="taskStatus" label="任务状态" :formatter="formatStatus" show-overflow-tooltip></el-table-column>
								<el-table-column prop="sourceAddress" label="起始地址" show-overflow-tooltip></el-table-column>
								<el-table-column prop="targetAddress" label="目标地址" show-overflow-tooltip></el-table-column>
								<el-table-column prop="executionTime" label="执行时间" show-overflow-tooltip></el-table-column>
								<el-table-column prop="finishTime" label="完成时间" show-overflow-tooltip></el-table-column>
								<el-table-column label="操作" width="100">
									<template #default="scope">
										<el-button size="small" text type="primary" @click="onOpenEditTask(scope.row)">修改</el-button>
										<el-button size="small" text type="danger" @click="onSubRowDel(scope.row)">取消</el-button>
									</template>
								</el-table-column>
							</el-table>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="wmsTaskNo" label="任务号" show-overflow-tooltip></el-table-column>
				<el-table-column prop="taskNo" label="任务号" show-overflow-tooltip></el-table-column>
				<el-table-column prop="containerBarcode" label="容器条码" show-overflow-tooltip></el-table-column>
				<el-table-column prop="taskStatus" label="任务状态" :formatter="formatStatus" show-overflow-tooltip></el-table-column>
				<el-table-column prop="taskType" label="任务类型" :formatter="formatTaskType" show-overflow-tooltip></el-table-column>
				<el-table-column prop="sourceAddress" label="起始地址" show-overflow-tooltip></el-table-column>
				<el-table-column prop="targetAddress" label="目标地址" show-overflow-tooltip></el-table-column>
				<el-table-column prop="priority" label="优先级" show-overflow-tooltip></el-table-column>
				<el-table-column prop="creationTime" label="创建时间" show-overflow-tooltip></el-table-column>
				<!-- <el-table-column label="操作" width="100">
					<template #default="scope">
						<el-button size="small" text type="danger" @click="onRowDel(scope.row)">回收</el-button>
					</template>
				</el-table-column> -->
			</el-table>
			<el-pagination
				@size-change="onHandleSizeChange"
				@current-change="onHandleCurrentChange"
				class="mt15"
				:pager-count="5"
				:page-sizes="[30, 50, 100]"
				v-model:current-page="state.tableData.queryParams.skipCount"
				background
				v-model:page-size="state.tableData.queryParams.maxResultCount"
				layout="total, sizes, prev, pager, next, jumper"
				:total="state.tableData.total"
			>
			</el-pagination>
		</el-card>

		<TaskDialogRef ref="taskDialogRef" @refresh="getTableData()" />
	</div>
</template>

<script setup lang="ts" name="systemUser">
import { reactive, onMounted, ref, defineAsyncComponent } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useWcsTaskApi } from '/@/api/task/wcs/index';

import { useDicApi } from '/@/api/dic';

// 引入组件
const TaskDialogRef = defineAsyncComponent(() => import('/@/views/task/wcs/dialog.vue'));

// 定义变量内容
const taskDialogRef = ref();

const state = reactive({
	taskStatusType: [] as ListType[],
	taskType: [] as ListType[],
	tableData: {
		data: [] as Array<WcsTaskType>,
		total: 0,
		loading: false,
		queryParams: {
			wcsTaskNo: '',
			containerBarcode: '',
			taskStatus: '',
			sourceAddress: '',
			targetAddress: '',
			skipCount: 1,
			maxResultCount: 10,
		},
	},
});

// 初始化表格数据
const getTableData = async () => {
	state.tableData.loading = true;
	const response = await useWcsTaskApi().getWcsMainTasks(state.tableData.queryParams);
	state.tableData.data = response.items;
	state.tableData.total = response.totalCount;
	state.tableData.loading = false;
};

// 删除用户
const onRowDel = (row: WcsTaskType) => {
	ElMessageBox.confirm(`此操作将回收任务：“${row.taskNo}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			await useWcsTaskApi().recoveryWcsTask(row.id);
			getTableData();
			ElMessage.success('回收成功');
		})
		.catch(() => {});
};

// 删除用户
const onSubRowDel = (row: WcsSubTaskType) => {
	ElMessageBox.confirm(`此操作将取消执行任务：“${row.taskNo}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			await useWcsTaskApi().recoveryWcsTask(row.id);
			getTableData();
			ElMessage.success('回收成功');
		})
		.catch(() => {});
};

// 任务状态转换
const formatStatus = (row: WmsTaskType) => {
	const dic = state.taskStatusType.find((s) => s.dicValue == row.taskStatus);
	return dic?.dicLabel || '未知';
};

// 任务类型转换
const formatTaskType = (row: WmsTaskType) => {
	const dic = state.taskType.find((s) => s.dicValue == row.taskType);
	return dic?.dicLabel || '未知';
};

// 打开修改用户弹窗
const onOpenEditTask = (row: WcsSubTaskType) => {
	taskDialogRef.value.openDialog(row);
};

// 分页改变
const onHandleSizeChange = (val: number) => {
	state.tableData.queryParams.maxResultCount = val;
	getTableData();
};
// 分页改变
const onHandleCurrentChange = (val: number) => {
	state.tableData.queryParams.skipCount = val;
	getTableData();
};
// 页面加载时
onMounted(async () => {
	getTableData();
	let response = await useDicApi().getDicsByDicType('wcs_task_status');
	state.taskStatusType = response.items;

	response = await useDicApi().getDicsByDicType('wcs_task_type');
	state.taskType = response.items;
});
</script>

<style scoped lang="scss">
.system-wcs-container {
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
