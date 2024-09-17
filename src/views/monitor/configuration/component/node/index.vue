<template>
	<div id="node">
		<el-tabs v-model="state.tabsActive">
			<!-- 编辑测试 -->
			<el-tab-pane label="基础属性" name="0">
				<el-scrollbar>
					<el-form size="default" label-width="80px" class="pt15 pr15 pb15 pl15">
						<el-form-item v-if="state.form.component === 'converyTransverse'" label="设备编号" prop="deviceNo">
							<el-input v-model="nodeConfig['deviceNo']" clearable></el-input>
						</el-form-item>
						<el-form-item v-if="state.form.component === 'converyTransverse'" label="设备长度" prop="width">
							<el-input-number v-model="state.form.width" :min="1" :max="1500" clearable @change="widthValueChange"></el-input-number>
						</el-form-item>
						<el-form-item v-if="state.form.component === 'converyPportrait'" label="设备长度" prop="height">
							<el-input-number v-model="state.form.height" :min="1" :max="500" clearable @change="heightValueChange"></el-input-number>
						</el-form-item>

						<el-form-item v-if="state.form.component === 'v-text'" label="文本" prop="text">
							<el-input v-model="nodeConfig['text']" clearable></el-input>
						</el-form-item>
						<el-form-item v-if="state.form.component === 'v-rect'" label="填充色" prop="fill">
							<el-color-picker v-model="nodeConfig['fill']" show-alpha />
						</el-form-item>

						<el-form-item v-for="({ key, label }, index) in state.styleKeys" :key="index" :label="label">
							<el-input-number v-model="nodeConfig[key]" :step="0.1" :precision="1" :controls-step="0.1" />
						</el-form-item>
					</el-form>
				</el-scrollbar>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script setup lang="ts" name="canvasNode">
import { reactive, ref } from 'vue';

import { styleData } from '/@/utils/attr';
import { Shape } from 'konva/lib/Shape';
import { Group } from 'konva/lib/Group';

const nodeConfig = ref();

const state = reactive({
	node: {},
	shape: {} as Shape | Group,
	nodeRules: {
		id: [{ required: true, message: '请输入数据id', trigger: 'blur' }],
		nodeId: [{ required: true, message: '请输入节点id', trigger: 'blur' }],
		type: [{ required: true, message: '请输入类型', trigger: 'blur' }],
		left: [{ required: true, message: '请输入left坐标', trigger: 'blur' }],
		top: [{ required: true, message: '请输入top坐标', trigger: 'blur' }],
		icon: [{ required: true, message: '请输入icon图标', trigger: 'blur' }],
		name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
	},
	form: {
		component: '',
		module: [],
		width: 0,
		height: 0,
		color: '#409EFF',
	},
	tabsActive: '0',
	loading: {
		extend: false,
	},
	styleKeys: [] as any,
});

//获取节点属性
const getAttrs = (component: string, config: any, shape: Shape | Group) => {
	if (config) {
		nodeConfig.value = config;
		const curComponentStyleKeys = Object.keys(config);
		state.styleKeys = styleData.filter((item) => curComponentStyleKeys.includes(item.key));
	}

	state.shape = shape;
	state.form.width = config.width;
	state.form.height = config.height;
	state.form.component = component;
};

const widthValueChange = (value: number) => {
	if (state.form.component.indexOf('convery')) {
		(state.shape as Group).children[0].width(value);
		(state.shape as Group).children[1].width(value);
	}

	state.shape.width(value);
	state.shape.cache();
	nodeConfig.value['width'] = value;
};

const heightValueChange = (value: number) => {
	if (state.form.component.indexOf('convery')) {
		(state.shape as Group).children[0].height(value);
		(state.shape as Group).children[1].height(value);
	}

	state.shape.height(value);
	state.shape.cache();
	nodeConfig.value['height'] = value;
};

defineExpose({
	getAttrs,
});
</script>
<style lang="scss">
#node {
	height: 100%;
	.el-tabs__header {
		margin-bottom: 0;
		margin-left: 15px;
	}
	.el-tabs__content {
		overflow-y: auto;
	}
	.el-collapse-item__header {
		padding-left: 15px;
		font-weight: 600;
	}
	.el-form {
		.el-form-item--large {
			margin-bottom: 0;
		}
		.el-form-item__label {
			font-size: 12px;
		}
		.el-input {
			width: 150px;
			height: 24px;
		}
		.el-input__inner {
			height: 24px;
		}
		.el-input-number--large .el-input-number__decrease,
		.el-input-number--large .el-input-number__increase {
			width: 24px;
		}
		.el-input-number .el-input__inner {
			text-align: center !important;
		}
		.el-input-number--large {
			width: 150px;
		}
	}
}
</style>
