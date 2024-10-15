<template>
	<div class="system-operationLog-container layout-padding">
		<el-card shadow="hover" class="layout-padding-auto">
			<div class="system-user-search mb15">
				<el-input size="default" placeholder="请输入用户名称" v-model="state.tableData.queryParams.userName" style="max-width: 180px"> </el-input>
				<el-button size="default" type="primary" @click="getTableData" class="ml10">
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button>
			</div>
			<el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
				<el-table-column type="index" label="序号" width="60" />
				<el-table-column prop="timestamp" label="时间" width="150" show-overflow-tooltip></el-table-column>
				<el-table-column prop="message" label="日志信息" show-overflow-tooltip></el-table-column>
			</el-table>
			<el-pagination
				@size-change="onHandleSizeChange"
				@current-change="onHandleCurrentChange"
				class="mt15"
				:pager-count="5"
				:page-sizes="[50, 100, 200]"
				v-model:current-page="state.tableData.queryParams.skipCount"
				background
				v-model:page-size="state.tableData.queryParams.maxResultCount"
				layout="total, sizes, prev, pager, next, jumper"
				:total="state.tableData.total"
			>
			</el-pagination>
		</el-card>
	</div>
</template>

<script setup lang="ts" name="systemUser">
import { reactive, onMounted } from 'vue';
import { useOperationLogApi } from '/@/api/operationLog/index';

// 定义变量内容
const state = reactive({
	tableData: {
		data: [],
		total: 0,
		loading: false,
		queryParams: {
			userName: '',
			skipCount: 1,
			maxResultCount: 100,
		},
	},
});

// 初始化表格数据
const getTableData = async () => {
	state.tableData.loading = true;
	const response = await useOperationLogApi().getOperationLogs(state.tableData.queryParams);
	state.tableData.data = response.items;
	state.tableData.total = response.totalCount;
	state.tableData.loading = false;
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
.system-operationLog-container {
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
