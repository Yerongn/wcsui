<template>
	<div class="system-ruleEngine-container layout-padding">
		<el-card shadow="hover" class="layout-padding-auto">
			<div class="system-ruleEngine-search mb15">
				<el-input size="default" placeholder="请输入规则名称" v-model="state.tableData.queryParams.ruleName" style="max-width: 180px"> </el-input>
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
					新增规则
				</el-button>
			</div>
			<el-table
				:data="state.tableData.data"
				v-loading="state.tableData.loading"
				style="width: 100%"
				row-key="id"
				default-expand-all
				:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
			>
				<el-table-column label="序号" show-overflow-tooltip width="80">
					<template #default="scope">
						{{ scope.$index }}
					</template>
				</el-table-column>
				<el-table-column prop="ruleName" label="规则名称" show-overflow-tooltip> </el-table-column>
				<el-table-column prop="expression" label="规则表达式" show-overflow-tooltip> </el-table-column>
				<el-table-column prop="deviceNo" label="设备号" show-overflow-tooltip> </el-table-column>
				<el-table-column prop="workflowName" label="流程名称" show-overflow-tooltip> </el-table-column>
				<el-table-column prop="state" label="规则状态" show-overflow-tooltip>
					<template #default="scope">
						<el-tag type="success" v-if="scope.row.state">启用</el-tag>
						<el-tag type="info" v-else>禁用</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="remark" label="规则描述" show-overflow-tooltip></el-table-column>
				<el-table-column prop="creationTime" label="创建时间" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" show-overflow-tooltip width="140">
					<template #default="scope">
						<el-button size="small" text type="primary" @click="onOpenEditDept('edit', scope.row)" v-auth="'system:processFlow:edit'">修改</el-button>
						<el-button size="small" text type="primary" @click="onTabelRowDel(scope.row)" v-auth="'system:processFlow:remove'">删除</el-button>
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
		<RuleEngineDialog ref="processFlowDialogRef" @refresh="getTableData()" />
	</div>
</template>

<script setup lang="ts" name="systemDept">
import { defineAsyncComponent, ref, reactive, onMounted } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useRuleEngineApi } from '/@/api/ruleEngine';

// 引入组件
const RuleEngineDialog = defineAsyncComponent(() => import('/@/views/rule/ruleEngine/dialog.vue'));

// 定义变量内容
const processFlowDialogRef = ref();
const state = reactive({
	tableData: {
		data: [] as Array<RuleEngineType>,
		total: 0,
		loading: false,
		queryParams: {
			skipCount: 1,
			maxResultCount: 10,
			ruleName: '',
		},
	},
});

// 初始化表格数据
const getTableData = async () => {
	state.tableData.loading = true;
	const response = await useRuleEngineApi().getRuleEngines(state.tableData.queryParams);
	state.tableData.data = response.items;
	state.tableData.loading = false;
};
// 打开新增菜单弹窗
const onOpenAddDept = (type: string) => {
	processFlowDialogRef.value.openDialog(type);
};
// 打开编辑菜单弹窗
const onOpenEditDept = (type: string, row: RuleEngineType) => {
	processFlowDialogRef.value.openDialog(type, row);
};
// 删除当前行
const onTabelRowDel = (row: RuleEngineType) => {
	ElMessageBox.confirm(`此操作将永久删除规则：${row.ruleName}, 是否继续?`, '提示', {
		confirmButtonText: '删除',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			await useRuleEngineApi().delRuleEngine(row.id);
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
.system-ruleEngine-container {
	.system-ruleEngine-padding {
		padding: 15px;
		.el-table {
			flex: 1;
		}
	}
}
</style>
