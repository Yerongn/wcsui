// 左侧菜单导航数据
export const leftNavList = [
	{
		title: '流程控制',
		isOpen: true,
		icon: 'iconfont icon-caijian',
		id: '2',
		children: [
			{
				icon: 'iconfont icon-step',
				name: '开始',
				id: '21',
				form: [
					{
						type: 'select',
						label: '数据类型选择',
						prop: 'process',
						placeholder: '请选择流程数据类型',
						required: true,
						disabled: false,
						options: [],
					},
				],
			},
			{
				icon: 'iconfont icon-shuxingtu',
				name: '分支',
				id: '22',
				form: [
					{
						type: 'input',
						label: '活动名称8',
						prop: 'name22',
					},
				],
			},
			{
				icon: 'iconfont icon-shuaxin',
				name: '重复执行',
				id: 'recur',
				form: [
					{
						type: 'input',
						label: '时间间隔',
						prop: 'interval',
					},
					{
						type: 'input',
						label: '停止条件',
						prop: 'stopCondition',
					},
				],
			},
		],
	},
	{
		title: '工作流',
		icon: 'iconfont icon-shouye',
		isOpen: true,
		id: '1',
		children: [
			{
				icon: 'iconfont icon-zhongduancanshu',
				name: '流程',
				id: '14',
				form: [
					{
						type: 'select',
						label: '流程选择',
						prop: 'process',
						placeholder: '请选择流程',
						required: true,
						disabled: false,
						options: [],
					},
				],
			},
			{
				icon: 'iconfont icon-shangchuan',
				name: '数据',
				id: '15',
				form: [
					{
						type: 'input',
						label: '活动名称9',
						prop: 'name23',
					},
				],
			},
		],
	},
];
