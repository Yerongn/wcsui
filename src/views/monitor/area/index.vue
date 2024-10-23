<template>
	<div class="system-area-container layout-padding">
		<el-card shadow="hover" class="layout-padding-auto">
			<div class="system-area-search mb15">
				<el-input size="default" placeholder="请输入区域名称" v-model="state.tableData.queryParams.areaName" style="max-width: 180px"> </el-input>
				<el-button size="default" type="primary" @click="getTableData" class="ml10">
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button>
				<el-button size="default" type="success" class="ml10" @click="onOpenAddDept('add')" v-auth="'system:processFlow:add'">
					<el-icon>
						<ele-Plus />
					</el-icon>
					新增监控区域
				</el-button>
			</div>
			<div class="card-container">
				<el-card v-for="item in state.tableData.data" :key="item.id" class="card">
					<el-descriptions :title="item.areaName" :column="1">
						<template #extra>
							<el-button-group class="ml-4">
								<el-button size="small" :icon="Edit" @click="onOpenEditDept('edit', item)" />
								<el-button size="small" :icon="Delete" @click="onTabelRowDel(item)" />
							</el-button-group>
						</template>
						<el-descriptions-item label="区域描述">{{ item.remark }}</el-descriptions-item>
						<el-descriptions-item label="区域状态">
							<el-tag type="success" size="small" v-if="item.state">启用</el-tag>
							<el-tag type="info" size="small" v-else>禁用</el-tag>
						</el-descriptions-item>
						<el-descriptions-item label="创建时间">{{ item.creationTime }}</el-descriptions-item>
					</el-descriptions>
					<div class="card-actions">
						<el-button type="primary" size="small" :icon="Setting" @click="onConfigure(item)"> 配置 </el-button>
						<el-button type="primary" size="small" @click="onMonitor(item)" :icon="Monitor">监控</el-button>
					</div>
				</el-card>
			</div>
			<el-pagination
				v-if="state.tableData.total > 0"
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
		<AreaDialog ref="processFlowDialogRef" @refresh="getTableData()" />
	</div>
</template>

<script setup lang="ts" name="area">
import { defineAsyncComponent, ref, reactive, onMounted } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useMonitorApi } from '/@/api/monitor';
import { Delete, Edit, Monitor, Setting } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 引入组件
const AreaDialog = defineAsyncComponent(() => import('/@/views/monitor/area/dialog.vue'));

// 定义变量内容
const processFlowDialogRef = ref();
const state = reactive({
	tableData: {
		data: [] as Array<AreaMonitor>,
		total: 0,
		loading: false,
		queryParams: {
			skipCount: 1,
			maxResultCount: 10,
			areaName: '',
		},
	},
});

// 初始化表格数据
const getTableData = async () => {
	state.tableData.loading = true;
	const response = await useMonitorApi().getMonitors(state.tableData.queryParams);
	state.tableData.data = response.items;
	state.tableData.loading = false;
};
// 打开新增菜单弹窗
const onOpenAddDept = (type: string) => {
	processFlowDialogRef.value.openDialog(type);
};
// 打开编辑菜单弹窗
const onOpenEditDept = (type: string, row: AreaMonitor) => {
	processFlowDialogRef.value.openDialog(type, row);
};
// 删除当前行
const onTabelRowDel = (row: AreaMonitor) => {
	ElMessageBox.confirm(`此操作将永久删除区域：${row.areaName}, 是否继续?`, '提示', {
		confirmButtonText: '删除',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			await useMonitorApi().delMonitor(row.id);
			getTableData();
			ElMessage.success('删除成功');
		})
		.catch(() => {});
};

const onConfigure = (row: AreaMonitor) => {
	router.push({ path: `/monitor/configuration/${row.id}/${row.areaName}` });
};

const onMonitor = (row: AreaMonitor) => {
	router.push({ path: `/monitor/monitor/${row.id}/${row.areaName}` });
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
.system-area-container {
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
