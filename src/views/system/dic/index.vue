<template>
	<div class="system-dic-container layout-padding">
		<el-card shadow="hover" class="layout-padding-auto">
			<div class="system-user-search mb15">
				<el-input size="default" placeholder="请输入字典名称" v-model="state.tableData.queryParams.dicName" style="max-width: 180px"> </el-input>
				<el-button size="default" type="primary" @click="getTableData" class="ml10">
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button>
				<el-button size="default" type="success" class="ml10" @click="onOpenAddDic('add')">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					新增字典
				</el-button>
			</div>
			<el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
				<el-table-column type="index" label="序号" width="60" />
				<el-table-column prop="dicName" label="字典名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="dicType" label="编码" show-overflow-tooltip></el-table-column>
				<el-table-column prop="state" label="字典状态" show-overflow-tooltip>
					<template #default="scope">
						<el-tag type="success" v-if="scope.row.state">启用</el-tag>
						<el-tag type="info" v-else>禁用</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="remark" label="字典描述" show-overflow-tooltip></el-table-column>
				<el-table-column prop="creationTime" label="创建时间" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="100">
					<template #default="scope">
						<el-button size="small" text type="primary" @click="onOpenEditDic('edit', scope.row)">修改</el-button>
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
		<DicDialog ref="dicDialogRef" @refresh="getTableData()" />
	</div>
</template>

<script setup lang="ts" name="systemDic">
import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useDicApi } from '/@/api/dic';

// 引入组件
const DicDialog = defineAsyncComponent(() => import('/@/views/system/dic/dialog.vue'));

// 定义变量内容
const dicDialogRef = ref();
const state = reactive<SysDicState>({
	tableData: {
		data: [],
		total: 0,
		loading: false,
		queryParams: {
			dicName: '',
			skipCount: 1,
			maxResultCount: 10,
		},
	},
});

// 初始化表格数据
const getTableData = async () => {
	state.tableData.loading = true;
	const response = await useDicApi().getDics(state.tableData.queryParams);
	state.tableData.data = response.items;
	state.tableData.total = response.totalCount;
	state.tableData.loading = false;
};
// 打开新增字典弹窗
const onOpenAddDic = (type: string) => {
	dicDialogRef.value.openDialog(type);
};
// 打开修改字典弹窗
const onOpenEditDic = (type: string, row: RowDicType) => {
	dicDialogRef.value.openDialog(type, row);
};
// 删除字典
const onRowDel = (row: RowDicType) => {
	ElMessageBox.confirm(`此操作将永久删除字典名称：“${row.dicName}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			await useDicApi().delDic(row.id);
			ElMessage.success('删除成功');
			getTableData();
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
