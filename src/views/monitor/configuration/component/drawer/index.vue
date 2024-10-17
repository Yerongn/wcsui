<template>
	<el-drawer title="新增设备通讯" v-model="state.isOpen" size="800px">
		<template #default>
			<div class="pt15 pr15 pb15 pl15" style="overflow: hidden">
				<el-form v-if="state.type === 'addDrive'" ref="driveDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
					<el-row :gutter="35">
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="驱动名称">
								<el-input v-model="state.ruleForm.driveName" placeholder="请输入驱动名称" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="驱动类型" prop="driveType" :rules="[{ required: true, message: '驱动类型不能为空', trigger: 'blur' }]">
								<el-select v-model="state.ruleForm.driveType" placeholder="请选择" clearable class="w100" @change="onDriveTypeChange">
									<el-option v-for="item in state.driveType" :key="item.driveType" :label="item.driveType" :value="item.driveType" />
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
							<el-form-item label="驱动状态">
								<el-switch v-model="state.ruleForm.state" inline-prompt active-text="启" inactive-text="禁"></el-switch>
							</el-form-item>
						</el-col>
						<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
							<el-form-item label="驱动描述">
								<el-input v-model="state.ruleForm.remark" type="textarea" placeholder="请输入驱动描述" maxlength="150"></el-input>
							</el-form-item>
						</el-col>
					</el-row>

					<el-divider content-position="left">驱动参数</el-divider>

					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-table :data="state.ruleForm.driveargs" border style="width: 100%">
							<el-table-column prop="propertyDesc" label="属性描述" width="180" />
							<el-table-column prop="propertyName" label="属性名称" width="180" />
							<el-table-column prop="propertyValue" label="属性值">
								<template #default="{ row }">
									<el-select v-if="row.propertyName === 'CpuType'" v-model="row.propertyValue" placeholder="请选择" clearable class="w100">
										<el-option v-for="item in state.cpuType" :key="item.dicValue" :label="item.dicLabel" :value="item.dicValue" />
									</el-select>

									<el-input v-else v-model="row.propertyValue"></el-input>
								</template>
							</el-table-column>
						</el-table>
					</el-col>
				</el-form>
				<template v-else>
					<el-row :gutter="20">
						<el-col :span="8">
							<el-button type="primary" style="width: 200px" class="mb15" @click="onAddGroup"> 新增分组 </el-button>
							<el-scrollbar>
								<el-space direction="vertical">
									<el-card
										style="width: 200px"
										:class="{ selected: state.selectedItem.id === item.id }"
										shadow="hover"
										v-for="item in state.groupData"
										:key="item.id"
										@click="handleSelect(item)"
									>
										<el-row>
											<el-col :span="22">
												<span>{{ item.groupName }}</span>
											</el-col>
											<el-col :span="2">
												<SvgIcon name="ele-Delete" />
											</el-col>
										</el-row>
									</el-card>
								</el-space> </el-scrollbar
						></el-col>
						<el-col :span="16">
							<el-row>
								<el-col :span="18"> </el-col>
								<el-col :span="6">
									<el-button type="primary" class="mb15" @click="onAddDeviceProtocolDrawerRef"> 新增设备协议 </el-button>
								</el-col>
							</el-row>
							<el-scrollbar>
								<el-table stripe :data="state.tableData.data" v-loading="state.tableData.loading">
									<el-table-column prop="deviceNo" label="设备号" width="100" />
									<el-table-column prop="startByte" label="偏移量" width="100" />
									<el-table-column prop="protocol" label="协议" show-overflow-tooltip />
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
							</el-scrollbar>
						</el-col>
					</el-row>
				</template>
			</div>
		</template>
		<template #footer>
			<div style="flex: auto" class="pt0 pr15 pb0 pl5">
				<el-button class="mb15" @click="onCancel"> 取消 </el-button>
				<el-button v-if="state.type == 'addDrive'" class="mb15" @click="onNext"> {{ state.step }} </el-button>
				<el-button type="primary" class="mb15" @click="onSubmit"> 保存 </el-button>
			</div>
		</template>
	</el-drawer>
	<AddgroupDrawer ref="addgroupDrawerRef" @refresh="getGroupData()" />
	<AddDeviceProtocolDrawer ref="addDeviceProtocolDrawerRef" @refresh="getTableData()" />
</template>

<script setup lang="ts" name="pagesDriveDrawer">
import { reactive, ref, defineAsyncComponent } from 'vue';
import { useDriveApi } from '/@/api/drive';
import { useDicApi } from '/@/api/dic';
import { useSharp7DeviceProtocolApi } from '/@/api/sharp7DeviceProtocol';
import { useGroupApi } from '/@/api/group';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const driveDialogFormRef = ref();
const addgroupDrawerRef = ref();
const addDeviceProtocolDrawerRef = ref();

const AddgroupDrawer = defineAsyncComponent(() => import('./addgroup.vue'));
const AddDeviceProtocolDrawer = defineAsyncComponent(() => import('./addDeviceProtocol.vue'));

const state = reactive({
	ruleForm: {} as Drive,
	driveType: [] as DriveType[],
	cpuType: [] as ListType[],
	groupData: [] as Group[],
	tableData: {
		data: [] as Sharp7DeviceProtocol[],
		total: 0,
		loading: false,
		queryParams: {
			deviceNo: '',
			groupId: null,
			skipCount: 1,
			sorting: '',
			maxResultCount: 10,
		},
	},
	type: 'addDrive',
	title: '新增设备通讯',
	step: '下一步',
	selectedItem: {} as Group,
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
		submitTxt: '',
	},
	isOpen: false,
});

// 打开抽屉
const open = async () => {
	state.isOpen = true;
	state.ruleForm = { state: true } as Drive;
	let response = await useDriveApi().geDriveTypeAndArg();
	state.driveType = response.items;
	state.type = 'addDrive';
	response = await useDicApi().getDicsByDicType('CpuType');
	state.cpuType = response.items;
};

const onAddGroup = () => {
	addgroupDrawerRef.value.open(state.ruleForm.id);
};

const onAddDeviceProtocolDrawerRef = () => {
	addDeviceProtocolDrawerRef.value.open(state.selectedItem.id);
};

// 关闭弹窗
const closeDialog = () => {
	state.isOpen = false;
};

// 取消
const onCancel = () => {
	closeDialog();
};

// 初始化标签表格数据
const getTableData = async () => {
	state.tableData.loading = true;
	const response = await useSharp7DeviceProtocolApi().getSharp7DeviceProtocols(state.tableData.queryParams);
	state.tableData.data = response.items;
	state.tableData.total = response.totalCount;
	state.tableData.loading = false;
};

// 初始化分组数据
const getGroupData = async () => {
	const response = await useGroupApi().getGroups({
		driveId: state.ruleForm.id,
		skipCount: 1,
		maxResultCount: 100,
	});
	state.groupData = response.items;
};

const handleSelect = async (item: any) => {
	state.selectedItem = item;
	state.tableData.queryParams.groupId = item.id;
	await getTableData();
};

// 提交
const onSubmit = () => {
	if (state.type === 'addDrive') {
		driveDialogFormRef.value.validate(async (valid: boolean) => {
			if (!valid) return;

			var reult = await useDriveApi().addDrive(state.ruleForm);
			state.ruleForm = reult;

			closeDialog(); // 关闭弹窗
			emit('refresh');
		});
	} else {
		closeDialog(); // 关闭弹窗
		emit('refresh');
	}
};

const onNext = async () => {
	// if (state.type === 'addDrive') {
	// state.step = '上一步';
	driveDialogFormRef.value.validate(async (valid: boolean) => {
		if (!valid) return;
		state.type = 'addGroup';
		var reult = await useDriveApi().addDrive(state.ruleForm);
		state.ruleForm = reult;
		await getGroupData();
	});
	// } else {
	// 	state.type = 'addDrive';
	// 	state.step = '下一步';
	// }
};

const onDriveTypeChange = (value: string) => {
	const driveType = state.driveType.find((d) => d.driveType === value);
	state.ruleForm.driveargs = driveType?.driveargs ?? [];
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

// 暴露变量
defineExpose({
	open,
});
</script>

<style scoped>
.box-card {
	margin-bottom: 20px;
	cursor: pointer;
	transition: all 0.3s;
}

.box-card:hover {
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.selected {
	border-color: #409eff;
	color: #409eff;
	background-color: #ecf5ff;
}

.clearfix:before,
.clearfix:after {
	display: table;
	content: '';
}
.clearfix:after {
	clear: both;
}
</style>
