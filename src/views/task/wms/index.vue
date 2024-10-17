<template>
	<div class="system-wms-container layout-padding">
		<el-card shadow="hover" class="layout-padding-auto">
			<div class="system-wms-search mb15">
				<el-input size="default" placeholder="请输入任务编号" v-model="state.tableData.queryParams.wmsTaskNo" style="max-width: 180px"> </el-input>
				<el-input
					size="default"
					placeholder="请输入任务状态"
					v-model="state.tableData.queryParams.taskStatus"
					style="max-width: 180px"
					class="ml10"
				></el-input>
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
				<el-table-column type="index" label="序号" width="60" />
				<el-table-column prop="wmsTaskNo" label="任务号" show-overflow-tooltip></el-table-column>
				<el-table-column prop="containerBarcode" label="容器条码" show-overflow-tooltip></el-table-column>
				<el-table-column prop="taskStatus" label="任务状态" show-overflow-tooltip></el-table-column>
				<el-table-column prop="sourceAddress" label="起始地址" show-overflow-tooltip></el-table-column>
				<el-table-column prop="targetAddress" label="目标地址" show-overflow-tooltip></el-table-column>
				<el-table-column prop="priority" label="优先级" show-overflow-tooltip></el-table-column>
				<el-table-column prop="creationTime" label="创建时间" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="100">
					<template #default="scope">
						<el-button size="small" text type="primary" @click="onRowDel(scope.row)">回收</el-button>
					</template>
				</el-table-column>
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
		<UserDialog ref="wmsDialogRef" @refresh="getTableData()" />
	</div>
</template>

<script setup lang="ts" name="systemUser">
import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useWmsTaskApi } from '/@/api/task/wms/index';

// 引入组件
const UserDialog = defineAsyncComponent(() => import('/@/views/task/wms/dialog.vue'));

// 定义变量内容
const wmsDialogRef = ref();
const state = reactive({
	tableData: {
		data: [] as Array<WmsTaskType>,
		total: 0,
		loading: false,
		queryParams: {
			wmsTaskNo: '',
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
	const response = await useWmsTaskApi().getWmsTasks(state.tableData.queryParams);
	state.tableData.data = response.items;
	state.tableData.total = response.totalCount;
	state.tableData.loading = false;
};

// 删除用户
const onRowDel = (row: WmsTaskType) => {
	ElMessageBox.confirm(`此操作将永久删除任务：“${row.wmsTaskNo}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			await useWmsTaskApi().recoveryWmsTask(row.id);
			getTableData();
			ElMessage.success('回收成功');
		})
		.catch(() => {});
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
onMounted(() => {
	getTableData();
});
</script>

<style scoped lang="scss">
.system-wms-container {
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
