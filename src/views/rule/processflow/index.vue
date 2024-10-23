<template>
	<div class="system-processflow-container layout-padding">
		<el-card shadow="hover" class="layout-padding-auto">
			<div class="system-processflow-search mb15">
				<el-input size="default" placeholder="请输入流程名称" v-model="state.tableData.queryParams.processflowName" style="max-width: 180px">
				</el-input>
				<el-button size="default" type="primary" @click="getTableData" class="ml10">
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button>
				<el-button size="default" type="success" class="ml10" @click="onOpenAddDept('add')" v-auth="'system:processFlow:add'">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					新增流程
				</el-button>
			</div>
			<!-- <div class="card-container">
				<el-card v-for="item in state.tableData.data" :key="item.id" class="card">
					<el-descriptions :title="item.processflowName" :column="1">
						<template #extra>
							<el-button-group class="ml-4">
								<el-button size="small" :icon="Edit" @click="onOpenEditDept('edit', item)" />
								<el-button size="small" :icon="Delete" @click="onTabelRowDel(item)" />
							</el-button-group>
						</template>
						<el-descriptions-item label="流程描述">{{ item.remark }}</el-descriptions-item>
						<el-descriptions-item label="流程状态">
							<el-tag type="success" size="small" v-if="item.state">启用</el-tag>
							<el-tag type="info" size="small" v-else>禁用</el-tag>
						</el-descriptions-item>
						<el-descriptions-item label="流程配置">
							<el-tag type="success" v-if="item.processflowConfigure !== ''">已配置</el-tag>
							<el-tag type="info" v-else>未配置</el-tag>
						</el-descriptions-item>
						<el-descriptions-item label="创建时间">{{ item.creationTime }}</el-descriptions-item>
					</el-descriptions>
					<div class="card-actions">
						<el-button type="primary" size="small" :icon="Setting" @click="onConfigure(item)"> 配置 </el-button>
					</div>
				</el-card>
			</div> -->
			<el-table
				:data="state.tableData.data"
				v-loading="state.tableData.loading"
				style="width: 100%"
				row-key="id"
				default-expand-all
				:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
			>
				<el-table-column type="index" label="序号" width="60" />
				<el-table-column prop="processflowName" label="流程名称" show-overflow-tooltip> </el-table-column>

				<el-table-column prop="state" label="流程状态" show-overflow-tooltip>
					<template #default="scope">
						<el-tag type="success" v-if="scope.row.state">启用</el-tag>
						<el-tag type="info" v-else>禁用</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="processflowConfigure" label="流程配置">
					<template #default="scope">
						<el-tag type="success" v-if="scope.row.processflowConfigure !== ''">已配置</el-tag>
						<el-tag type="info" v-else>未配置</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="remark" label="流程描述" show-overflow-tooltip></el-table-column>
				<el-table-column prop="creationTime" label="创建时间" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" show-overflow-tooltip width="140">
					<template #default="scope">
						<el-button type="primary" text size="small" @click="onConfigure(scope.row)"> 配置 </el-button>
						<el-button size="small" text type="primary" @click="onOpenEditDept('edit', scope.row)" v-auth="'system:processFlow:edit'">修改</el-button>
						<el-button size="small" text type="danger" @click="onTabelRowDel(scope.row)" v-auth="'system:processFlow:remove'">删除</el-button>
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
		<ProcessFlowDialog ref="processFlowDialogRef" @refresh="getTableData()" />
	</div>
</template>

<script setup lang="ts" name="systemDept">
import { defineAsyncComponent, ref, reactive, onMounted } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useProcessFlowApi } from '/@/api/processflow';
import { useRouter } from 'vue-router';
// import { Delete, Edit, Setting } from '@element-plus/icons-vue';

// 引入组件
const ProcessFlowDialog = defineAsyncComponent(() => import('/@/views/rule/processflow/dialog.vue'));

// 定义变量内容
const processFlowDialogRef = ref();
const router = useRouter();
const state = reactive({
	tableData: {
		data: [] as Array<ProcessFlowType>,
		total: 0,
		loading: false,
		queryParams: {
			skipCount: 1,
			maxResultCount: 10,
			processflowName: '',
		},
	},
});

// 初始化表格数据
const getTableData = async () => {
	state.tableData.loading = true;
	const response = await useProcessFlowApi().getProcessFlows(state.tableData.queryParams);
	state.tableData.data = response.items;
	state.tableData.total = response.totalCount;
	state.tableData.loading = false;
};
// 打开新增菜单弹窗
const onOpenAddDept = (type: string) => {
	processFlowDialogRef.value.openDialog(type);
};
// 打开编辑菜单弹窗
const onOpenEditDept = (type: string, row: ProcessFlowType) => {
	processFlowDialogRef.value.openDialog(type, row);
};
// 删除当前行
const onTabelRowDel = (row: ProcessFlowType) => {
	ElMessageBox.confirm(`此操作将永久删除流程：${row.processflowName}, 是否继续?`, '提示', {
		confirmButtonText: '删除',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			await useProcessFlowApi().delProcessFlow(row.id);
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

const onConfigure = (row: ProcessFlowType) => {
	router.push({ path: `/rule/workflow/${row.id}/${row.processflowName}` }); //'/rule/workflow/'
};

// 页面加载时
onMounted(() => {
	getTableData();
});
</script>

<style scoped lang="scss">
.system-processflow-container {
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

.card-container {
	display: flex;
	flex-wrap: wrap;
	gap: 16px;
	margin-top: 20px;
}

.card {
	width: calc(20% - 16px); /* 4 cards per row with gap */
	box-sizing: border-box;
	border-radius: 8px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	transition: transform 0.2s ease-in-out;
}

.card:hover {
	transform: translateY(-5px);
}

.card-header {
	padding: 0px;
	font-weight: bold;
}

.card-body {
	padding: 15px;
	font-size: 14px;
	line-height: 1.5;
	color: #555;
}

.card-actions {
	display: flex;
	justify-content: flex-end;
	padding: 0px;
}

@media (max-width: 768px) {
	.card {
		width: calc(50% - 16px); /* 2 cards per row on smaller screens */
	}
}

@media (max-width: 480px) {
	.card {
		width: 100%; /* 1 card per row on very small screens */
	}
}
</style>
