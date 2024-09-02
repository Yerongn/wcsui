<template>
	<div class="system-job-container layout-padding">
		<el-card shadow="hover" class="layout-padding-auto">
			<div class="system-job-search mb15">
				<el-input size="default" placeholder="请输入任务名称" v-model="state.tableData.queryParams.jobId" style="max-width: 180px" > </el-input>
				<el-input size="default" placeholder="请输入任务组名" v-model="state.tableData.queryParams.groupName" style="max-width: 180px" class="ml10"> </el-input>
                <el-button size="default" type="primary" @click="getTableData" class="ml10">
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button>
				<el-button size="default" type="success" class="ml10" @click="onOpenAddUser('add')">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					新增任务
				</el-button>
			</div>
			<el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
				<el-table-column type="index" label="序号" width="60" />
				<el-table-column prop="jobId" label="任务名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="groupName" label="任务组名" show-overflow-tooltip></el-table-column>
				<el-table-column prop="jobType" label="任务类型" show-overflow-tooltip></el-table-column>
				<el-table-column prop="assemblyName" label="程序集" show-overflow-tooltip></el-table-column>
                <el-table-column prop="assemblyName" label="程序集" show-overflow-tooltip></el-table-column>
				<el-table-column prop="status" label="任务状态" show-overflow-tooltip></el-table-column>
                <el-table-column prop="concurrent" label="执行方式" show-overflow-tooltip>
					<template #default="scope">
						<el-tag type="success" v-if="scope.row.state">并行</el-tag>
						<el-tag type="info" v-else>串行</el-tag>
					</template>
				</el-table-column>
                <el-table-column prop="triggerArgs" label="触发器参数" show-overflow-tooltip></el-table-column>
				<el-table-column prop="description" label="任务描述" show-overflow-tooltip></el-table-column>
				<el-table-column prop="updatedTime" label="最后执行时间" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="100">
					<template #default="scope">
						<el-button size="small" text type="primary" @click="onOpenEditUser('edit', scope.row)"
							>修改</el-button
						>
						<el-button size="small" text type="primary" @click="onRowDel(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
				@size-change="onHandleSizeChange"
				@current-change="onHandleCurrentChange"
				class="mt15"
				:pager-count="5"
				:page-sizes="[10, 20, 30]"
				v-model:current-page="state.tableData.queryParams.skipCount"
				background
				v-model:page-size="state.tableData.queryParams.maxResultCount"
				layout="total, sizes, prev, pager, next, jumper"
				:total="state.tableData.total"
			>
			</el-pagination>
		</el-card>
		<UserDialog ref="jobDialogRef" @refresh="getTableData()" />
	</div>
</template>

<script setup lang="ts" name="systemUser">
import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useJobApi } from '/@/api/task/job';

// 引入组件
const UserDialog = defineAsyncComponent(() => import('/@/views/task/job/dialog.vue'));

// 定义变量内容
const jobDialogRef = ref();
const state = reactive({
	tableData: {
		data: [] as Array<JobType>,
		total: 0,
		loading: false,
		queryParams: {
            jobId: '',
			groupName: '',
			skipCount: 1,
			maxResultCount: 10,
		},
	},
});

// 初始化表格数据
const getTableData = async () => {
	state.tableData.loading = true;
	const response = await useJobApi().getJobs(state.tableData.queryParams);
	state.tableData.data = response.items;
	state.tableData.total = response.totalCount;
	state.tableData.loading = false;
};
// 打开新增用户弹窗
const onOpenAddUser = (type: string) => {
	jobDialogRef.value.openDialog(type);
};
// 打开修改用户弹窗
const onOpenEditUser = (type: string, row: JobType) => {
	jobDialogRef.value.openDialog(type, row);
};
// 删除用户
const onRowDel = (row: JobType) => {
	ElMessageBox.confirm(`此操作将永久删除任务：“${row.jobId}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			await useJobApi().delJob(row.jobId);
			getTableData();
			ElMessage.success('删除成功');
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
.system-job-container {
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
