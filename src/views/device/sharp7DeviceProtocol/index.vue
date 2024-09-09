<template>
	<div class="system-sharp7DeviceProtocol-container layout-padding">
		<el-card shadow="hover" class="layout-padding-auto">
			<div class="system-sharp7DeviceProtocol-search mb15">
				<el-input size="default" placeholder="请输入设备编号" v-model="state.tableData.queryParams.deviceNo" style="max-width: 180px"> </el-input>
				<el-button size="default" type="primary" @click="getTableData" class="ml10">
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button>
				<el-button size="default" type="success" class="ml10" @click="onOpenAddSharp7DeviceProtocol('add')">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					新增设备协议
				</el-button>
			</div>
			<el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
				<el-table-column type="index" label="序号" width="60" />
				<el-table-column prop="deviceNo" label="设备号" show-overflow-tooltip></el-table-column>
				<el-table-column prop="protocol" label="设备协议" show-overflow-tooltip></el-table-column>
				<el-table-column prop="dbNumber" label="Db块编号" show-overflow-tooltip></el-table-column>
				<el-table-column prop="startByte" label="起始偏移量" show-overflow-tooltip></el-table-column>
				<el-table-column prop="dataLength" label="数据长度" show-overflow-tooltip></el-table-column>
				<el-table-column prop="state" label="状态" show-overflow-tooltip>
					<template #default="scope">
						<el-tag type="success" v-if="scope.row.state">启用</el-tag>
						<el-tag type="info" v-else>禁用</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="remark" label="描述" show-overflow-tooltip></el-table-column>
				<el-table-column prop="creationTime" label="创建时间" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="100">
					<template #default="scope">
						<el-button
							:disabled="scope.row.sharp7DeviceProtocolName === 'admin'"
							size="small"
							text
							type="primary"
							@click="onOpenEditSharp7DeviceProtocol('edit', scope.row)"
							>修改</el-button
						>
						<el-button :disabled="scope.row.sharp7DeviceProtocolName === 'admin'" size="small" text type="primary" @click="onRowDel(scope.row)"
							>删除</el-button
						>
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
		<Sharp7DeviceProtocolDialog ref="sharp7DeviceProtocolDialogRef" @refresh="getTableData()" />
	</div>
</template>

<script setup lang="ts" name="systemSharp7DeviceProtocol">
import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useSharp7DeviceProtocolApi } from '/@/api/sharp7DeviceProtocol';

// 引入组件
const Sharp7DeviceProtocolDialog = defineAsyncComponent(() => import('/@/views/device/sharp7DeviceProtocol/dialog.vue'));

// 定义变量内容
const sharp7DeviceProtocolDialogRef = ref();
const state = reactive({
	tableData: {
		data: [] as Sharp7DeviceProtocol[],
		total: 0,
		loading: false,
		queryParams: {
			deviceNo: '',
			skipCount: 1,
			maxResultCount: 10,
		},
	},
});

// 初始化表格数据
const getTableData = async () => {
	state.tableData.loading = true;
	const response = await useSharp7DeviceProtocolApi().getSharp7DeviceProtocols(state.tableData.queryParams);
	state.tableData.data = response.items;
	state.tableData.total = response.totalCount;
	state.tableData.loading = false;
};
// 打开新增用户弹窗
const onOpenAddSharp7DeviceProtocol = (type: string) => {
	sharp7DeviceProtocolDialogRef.value.openDialog(type);
};
// 打开修改用户弹窗
const onOpenEditSharp7DeviceProtocol = (type: string, row: Sharp7DeviceProtocol) => {
	sharp7DeviceProtocolDialogRef.value.openDialog(type, row);
};
// 删除用户
const onRowDel = (row: Sharp7DeviceProtocol) => {
	ElMessageBox.confirm(`此操作将永久删除设备协议：“${row.deviceNo}_${row.protocol}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(async () => {
			await useSharp7DeviceProtocolApi().delSharp7DeviceProtocol(row.id);
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
.system-sharp7DeviceProtocol-container {
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
