<template>
	<div class="system-drive-container layout-padding">
		<el-card shadow="hover" class="layout-padding-auto">
			<div class="system-drive-search mb15">
				<el-input size="default" placeholder="请输入驱动名称" v-model="state.tableData.queryParams.driveName" style="max-width: 180px"> </el-input>
				<el-button size="default" type="primary" @click="getTableData" class="ml10">
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button>
				<el-button size="default" type="success" class="ml10" @click="onOpenAddDrive('add')">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					新增驱动
				</el-button>
			</div>
			<el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
				<el-table-column type="index" label="序号" width="60" />
				<el-table-column prop="driveName" label="驱动名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="driveType" label="驱动类型" show-overflow-tooltip></el-table-column>
				<el-table-column prop="state" label="驱动状态" show-overflow-tooltip>
					<template #default="scope">
						<el-tag type="success" v-if="scope.row.state">启用</el-tag>
						<el-tag type="info" v-else>禁用</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="remark" label="驱动描述" show-overflow-tooltip></el-table-column>
				<el-table-column prop="creationTime" label="创建时间" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="100">
					<template #default="scope">
						<el-button :disabled="scope.row.driveName === 'admin'" size="small" text type="primary" @click="onOpenEditDrive('edit', scope.row)"
							>修改</el-button
						>
						<el-button :disabled="scope.row.driveName === 'admin'" size="small" text type="danger" @click="onRowDel(scope.row)">删除</el-button>
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
		<DriveDialog ref="driveDialogRef" @refresh="getTableData()" />
	</div>
</template>

<script setup lang="ts" name="systemDrive">
import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useDriveApi } from '/@/api/drive';

// 引入组件
const DriveDialog = defineAsyncComponent(() => import('/@/views/device/drive/dialog.vue'));

// 定义变量内容
const driveDialogRef = ref();
const state = reactive({
	tableData: {
		data: [] as Drive[],
		total: 0,
		loading: false,
		queryParams: {
			driveName: '',
			skipCount: 1,
			maxResultCount: 10,
		},
	},
});

// 初始化表格数据
const getTableData = async () => {
	state.tableData.loading = true;
	const response = await useDriveApi().getDrives(state.tableData.queryParams);
	state.tableData.data = response.items;
	state.tableData.total = response.totalCount;
	state.tableData.loading = false;
};
// 打开新增用户弹窗
const onOpenAddDrive = (type: string) => {
	driveDialogRef.value.openDialog(type);
};
// 打开修改用户弹窗
const onOpenEditDrive = (type: string, row: Drive) => {
	driveDialogRef.value.openDialog(type, row);
};
// 删除用户
const onRowDel = (row: Drive) => {
	ElMessageBox.confirm(`此操作将永久删除账户名称：“${row.driveName}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			await useDriveApi().delDrive(row.id);
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
.system-drive-container {
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
