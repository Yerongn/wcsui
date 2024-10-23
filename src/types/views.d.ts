/**
 * views personal
 */
type NewInfo = {
	title: string;
	date: string;
	link: string;
};
type Recommend = {
	title: string;
	msg: string;
	icon: string;
	bg: string;
	iconColor: string;
};
declare type PersonalState = {
	newsInfoList: NewInfo[];
	recommendList: Recommend[];
	personalForm: {
		name: string;
		email: string;
		autograph: string;
		occupation: string;
		phone: string;
		sex: string;
	};
};

/**
 * views visualizing
 */
declare type Demo2State<T = any> = {
	time: {
		txt: string;
		fun: number;
	};
	dropdownList: T[];
	dropdownActive: string;
	skyList: T[];
	dBtnList: T[];
	chartData4Index: number;
	dBtnActive: number;
	earth3DBtnList: T[];
	chartData4List: T[];
	myCharts: T[];
};

/**
 * views params
 */
declare type ParamsState = {
	value: string;
	tagsViewName: string;
	tagsViewNameIsI18n: boolean;
};

/**
 * views system
 */
// role
declare interface RowRoleType {
	id: string;
	roleName: string;
	roleCode: string;
	remark: string;
	orderNum: number;
	state: boolean;
	createTime: string;
	menuIds: Array<number>;
	deptIds: Array<number>;
}

interface SysRoleTableType extends TableType {
	data: RowRoleType[];
}

declare interface SysRoleState {
	tableData: SysRoleTableType;
}

declare type TreeType = {
	id: number;
	label: string;
	children?: TreeType[];
};

// job
declare type JobType<T = any> = {
	jobId: string;
	groupName: string;
	jobType: string;
	assemblyName: string;
	description: string;
	concurrent: boolean;
	includeAnnotations: boolean;
	properties: string;
	updatedTime: T;
	status: boolean;
	triggerArgs: string;
};

// wms
declare type WmsTaskType<T = any> = {
	id: string;
	wmsTaskNo: string;
	containerBarcode: string;
	taskStatus: string;
	taskType: string;
	billType: string;
	sourceAddress: string;
	targetAddress: string;
	priority: number;
	creationTime: T;
	finishTime: T;
};

// wcs
declare type WcsTaskType<T = any> = {
	id: string;
	taskNo: string;
	wmsTaskNo: string;
	containerBarcode: string;
	taskRunStatus: string;
	taskType: string;
	sourceAddress: string;
	targetAddress: string;
	priority: number;
	creationTime: T;
	finishTime: T;
	taskSubs: Array<WcsSubTaskType>;
};

// wcs
declare type WcsSubTaskType<T = any> = {
	id: string;
	taskNo: string;
	orderNum: number;
	wmsTaskNo: string;
	containerBarcode: string;
	taskStatus: string;
	taskRunStatus: string;
	taskType: string;
	executionDeviceType: string;
	executionDevice: string;
	sourceAddress: string;
	targetAddress: string;
	priority: number;
	creationTime: T;
	executionTime: T;
	finishTime: T;
};

// user
declare type RowUserType<T = any> = {
	id: string;
	userName: string;
	nick: string;
	phone: string;
	email: string;
	sex: string;
	deptId: string;
	roleIds: Array<string>;
	password: string;
	overdueTime: T;
	state: boolean;
	remark: string;
	creationTime: T;
};

interface SysUserTableType extends TableType {
	data: RowUserType[];
}

declare interface SysUserState {
	tableData: SysUserTableType;
}

// dept
declare type DeptTreeType = {
	id: string;
	deptName: string;
	creationTime: string;
	state: boolean;
	orderNum: number;
	remark: string;
	id: number | string;
	children?: DeptTreeType[];
};

declare interface RowDeptType extends DeptTreeType {
	id: string;
	parentId: string;
	state: boolean;
	deptName: string;
	remark: string;
}

interface SysDeptTableType extends TableType {
	data: DeptTreeType[];
}

declare interface SysDeptState {
	tableData: SysDeptTableType;
}

// dic
type ListType = {
	id: string;
	dicLabel: string;
	dicValue: string;
	orderNum: number;
};

declare interface RowDicType {
	id: string;
	dicName: string;
	dicType: string;
	remark: string;
	state: boolean;
	creationTime: string;
	dictionaries: ListType[];
}

interface SysDicTableType extends TableType {
	data: RowDicType[];
}

declare interface SysDicState {
	tableData: SysDicTableType;
}

// processflow
declare type ProcessFlowType = {
	id: string;
	processflowName: string;
	processflowConfigure: string;
	remark: string;
	state: boolean;
	orderNum: number;
	creationTime: string;
};

// RuleEngineType
declare type RuleEngineType = {
	id: string;
	ruleName: string;
	workflowId: string;
	workflowName: string;
	protocolType: string;
	deviceNo: string;
	expression: string;
	remark: string;
	state: boolean;
	orderNum: number;
	creationTime: string;
};

// DeviceType
declare type DeviceType = {
	id: string;
	deviceNo: string;
	deviceType: string;
	deviceBrand: string;
	state: boolean;
	orderNum: number;
	creationTime: string;
};

// DriveType
declare type Drive = {
	id: string;
	driveName: string;
	driveType: string;
	driveargs: DriveargType[];
	state: boolean = true;
	remark: string;
	orderNum: number;
	creationTime: string;
};

// DriveType
declare type DriveType = {
	driveTypeName: string;
	driveType: string;
	driveargs: DriveargType[];
};

// DriveargType
declare type DriveargType = {
	id: string;
	propertyName: string;
	propertyValue: string;
	propertyDesc: string;
};

// GroupType
declare type Group = {
	id: string;
	groupName: string;
	driveName: string;
	scanInterval: number;
	driveId: string;
	driveargs: DriveargType[];
	state: boolean;
	isRead: boolean;
	remark: string;
	orderNum: number;
	creationTime: string;
};

// Sharp7DeviceProtocol
declare type Sharp7DeviceProtocol = {
	id: string;
	groupId: string;
	groupName: string;
	deviceNo: string;
	protocolId: string;
	protocol: string;
	driveName: string;
	dbNumber: string;
	startByte: string;
	dataLength: number;
	transmissionMode: string;
	state: boolean;
	remark: string;
	orderNum: number;
	creationTime: string;
};

// batchAddDto
declare type BatchAddDto = {
	groupId: string;
	deviceNo: string;
	protocol: string;
	dbNumber: string;
	startByte: string;
	dataLength: number;
	deviceNum: number;
};

declare type protocolType = {
	protocolType: string;
	protocolTypeDescribe: string;
	protocolType: string;
};

/**
 * views pages
 */
//  filtering
declare type FilteringChilType = {
	id: number | string;
	label: string;
	active: boolean;
};

declare type FilterListType = {
	img: string;
	title: string;
	evaluate: string;
	collection: string;
	price: string;
	monSales: string;
	id: number | string;
	loading?: boolean;
};

declare type FilteringRowType = {
	title: string;
	isMore: boolean;
	isShowMore: boolean;
	id: number | string;
	children: FilteringChilType[];
};

// tableRules
declare type TableRulesHeaderType = {
	prop: string;
	width: string | number;
	label: string;
	isRequired?: boolean;
	isTooltip?: boolean;
	type: string;
};

declare type TableRulesState = {
	tableData: {
		data: EmptyObjectType[];
		header: TableRulesHeaderType[];
		option: SelectOptionType[];
	};
};

declare type TableRulesOneProps = {
	name: string;
	email: string;
	autograph: string;
	occupation: string;
};

// tree
declare type RowTreeType = {
	id: number;
	label: string;
	label1: string;
	label2: string;
	isShow: boolean;
	children?: RowTreeType[];
};

// workflow index
declare type NodeListState = {
	id: string | number;
	nodeId: string | undefined;
	class: HTMLElement | string;
	left: number | string;
	top: number | string;
	icon: string;
	name: string;
	process: string;
	stopCondition: string;
	interval: string;
};

declare type LineListState = {
	sourceId: string;
	targetId: string;
	label: string;
};

declare type XyState = {
	x: string | number;
	y: string | number;
};

declare type WorkflowState<T = any> = {
	leftNavList: T[];
	processList: Process[];
	processDataTypeList: ProcessDataType[];
	dropdownNode: XyState;
	dropdownLine: XyState;
	isShow: boolean;
	jsPlumb: T;
	jsPlumbNodeIndex: null | number;
	jsplumbDefaults: T;
	jsplumbMakeSource: T;
	jsplumbMakeTarget: T;
	jsplumbConnect: T;
	jsplumbData: {
		nodeList: NodeListState[];
		lineList: LineListState[];
	};
};

// process
declare type Process = {
	processName: string;
	processType: string;
	processDescribe: string;
};

// process data type
declare type ProcessDataType = {
	processDataTypeName: string;
	processDataType: string;
	processDataTypeDescribe: string;
};

// serviceMessageClintType
declare type serviceMessageClintType = {
	connectionState: string;
	id: string;
	name: string;
	messageType: string;
};

declare type DeviceLogType = {
	timestamp: string;
	level: string;
	message: string;
};

// workflow drawer
declare type WorkflowDrawerNodeState<T = any> = {
	node: { [key: string]: T };
	nodeRules: T;
	form: T;
	processList: Process[];
	processDataTypeList: ProcessDataType[];
	tabsActive: string;
	loading: {
		extend: boolean;
	};
};

declare type WorkflowDrawerLabelType = {
	type: string;
	label: string;
};

declare type WorkflowDrawerState<T = any> = {
	isOpen: boolean;
	nodeData: {
		type: string;
	};
	jsplumbConn: T;
};

// deviceMonitor
declare type CanvasComponent<T = any> = {
	id: string;
	component: string;
	config: T;
};

// areaMonitor
declare type AreaMonitor<T = any> = {
	id: string;
	areaName: string;
	stageWidth: number;
	stageHeight: number;
	stageScale: number;
	state: boolean;
	creatorId: string;
	creationTime: T;
	remark: string;
	monitorDevices: Array<MonitorDevices>;
};

// monitorDevices
declare type MonitorDevices = {
	id: string;
	component: string;
	config: string;
	orderNum: number;
};

/**
 * views make
 */
// tableDemo
declare type TableDemoPageType = {
	pageNum: number;
	pageSize: number;
};

declare type TableHeaderType = {
	key: string;
	width: string;
	title: string;
	type: string | number;
	colWidth: string;
	width?: string | number;
	height?: string | number;
	isCheck: boolean;
};

declare type TableSearchType = {
	label: string;
	prop: string;
	placeholder: string;
	required: boolean;
	type: string;
	options?: SelectOptionType[];
};

declare type TableDemoState = {
	tableData: {
		data: EmptyObjectType[];
		header: TableHeaderType[];
		config: {
			total: number;
			loading: boolean;
			isBorder: boolean;
			isSelection: boolean;
			isSerialNo: boolean;
			isOperate: boolean;
		};
		search: TableSearchType[];
		param: EmptyObjectType;
		printName: string;
	};
};
