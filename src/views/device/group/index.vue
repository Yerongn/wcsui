<template>
	<div class="system-group-container layout-padding">
		<el-card shadow="hover" class="layout-padding-auto">
			<div class="system-group-search mb15">
				<el-input size="default" placeholder="请输入分组名称" v-model="state.tableData.queryParams.groupName" style="max-width: 180px"> </el-input>
				<el-button size="default" type="primary" @click="getTableData" class="ml10">
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button>
				<el-button size="default" type="success" class="ml10" @click="onOpenAddGroup('add')">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>

					新增分组
				</el-button>
			</div>
			<el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
				<el-table-column type="index" label="序号" width="60" />
				<el-table-column prop="groupName" label="分组名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="driveName" label="驱动名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="isRead" label="自动读取" show-overflow-tooltip>
					<template #default="scope">
						<el-tag type="success" v-if="scope.row.isRead">是</el-tag>
						<el-tag type="info" v-else>否</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="scanInterval" label="扫描频率" show-overflow-tooltip></el-table-column>
				<el-table-column prop="state" label="分组状态" show-overflow-tooltip>
					<template #default="scope">
						<el-tag type="success" v-if="scope.row.state">启用</el-tag>
						<el-tag type="info" v-else>禁用</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="remark" label="分组描述" show-overflow-tooltip></el-table-column>
				<el-table-column prop="creationTime" label="创建时间" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="100">
					<template #default="scope">
						<el-button :disabled="scope.row.groupName === 'admin'" size="small" text type="primary" @click="onOpenEditGroup('edit', scope.row)"
							>修改</el-button
						>
						<el-button :disabled="scope.row.groupName === 'admin'" size="small" text type="danger" @click="onRowDel(scope.row)">删除</el-button>
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
		<GroupDialog ref="groupDialogRef" @refresh="getTableData()" />
	</div>
</template>

<script setup lang="ts" name="systemGroup">
import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useGroupApi } from '/@/api/group';

// 引入组件
const GroupDialog = defineAsyncComponent(() => import('/@/views/device/group/dialog.vue'));

// 定义变量内容
const groupDialogRef = ref();
const state = reactive({
	tableData: {
		data: [] as Group[],
		total: 0,
		loading: false,
		queryParams: {
			groupName: '',
			skipCount: 1,
			maxResultCount: 10,
		},
	},
});

// 初始化表格数据
const getTableData = async () => {
	state.tableData.loading = true;
	const response = await useGroupApi().getGroups(state.tableData.queryParams);
	state.tableData.data = response.items;
	state.tableData.total = response.totalCount;
	state.tableData.loading = false;
};
// 打开新增用户弹窗
const onOpenAddGroup = (type: string) => {
	groupDialogRef.value.openDialog(type);
};
// 打开修改用户弹窗
const onOpenEditGroup = (type: string, row: Group) => {
	groupDialogRef.value.openDialog(type, row);
};
// 删除用户
const onRowDel = (row: Group) => {
	ElMessageBox.confirm(`此操作将永久删除分组名称：“${row.groupName}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			await useGroupApi().delGroup(row.id);
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
.system-group-container {
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
