<template>
	<div class="workflow-tool">
		<div class="pl15">{{ setToolTitle }}</div>

		<el-divider direction="vertical" />

		<el-text size="small" style="left: 10px"> 复制: </el-text>
		<el-button-group style="padding-left: 10px">
			<el-button size="small" title="上复制" @click="onToolClick('topCopy')">上</el-button>
			<el-button size="small" title="下复制" @click="onToolClick('bottomCopy')">下</el-button>
			<el-button size="small" title="左复制" @click="onToolClick('leftCopy')">左</el-button>
			<el-button size="small" title="右复制" @click="onToolClick('rightCopy')">右</el-button>
		</el-button-group>

		<!-- <div class="workflow-tool-icon" title="左复制" >
			<el-text size="small"> 左</el-text>
		</div>

		<div class="workflow-tool-icon" title="右复制" >
			<SvgIcon name="ele-Right" />
		</div>

		<div class="workflow-tool-icon" title="上复制" >
			<SvgIcon name="ele-Top" />
		</div>

		<div class="workflow-tool-icon" title="下复制" >
			<SvgIcon name="ele-Bottom" />
		</div> -->
		<div class="workflow-tool-right">
			<el-text size="small"> W: </el-text>
			<el-input v-model="width" style="width: 80px; padding: 5px 10px" size="small"></el-input>

			<el-text size="small"> H: </el-text>
			<el-input v-model="height" style="width: 80px; padding: 5px 10px" size="small" />

			<div class="workflow-tool-icon" title="放大" @click="onToolClick('zoomIn')">
				<SvgIcon name="ele-ZoomIn" />
			</div>

			<el-text size="small"> {{ Math.floor(props.scaleX * 100) }}%</el-text>

			<div class="workflow-tool-icon" title="缩小" @click="onToolClick('zoomOut')">
				<SvgIcon name="ele-ZoomOut" />
			</div>
		</div>

		<div class="workflow-tool-right">
			<div class="workflow-tool-icon" v-for="(v, k) in state.toolList" :key="k" :title="v.title" @click="onToolClick(v.fnName)">
				<SvgIcon :name="v.icon" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="pagesWorkflowTool">
import { computed, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['tool', 'setStageWidth', 'setStageHeight']);

const props = defineProps(['scaleX']);

// 定义变量内容
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const state = reactive({
	// width: props.config.width,
	// height: props.config.height,
	toolList: [
		{ icon: 'ele-Help', title: '帮助', fnName: 'help' },
		// { icon: 'ele-Download', title: '下载', fnName: 'download' },
		{ icon: 'ele-Check', title: '提交', fnName: 'submit' },
		// { icon: 'ele-DocumentCopy', title: '复制', fnName: 'copy' },
		{ icon: 'ele-Delete', title: '删除', fnName: 'del' },
		{ icon: 'ele-FullScreen', title: '全屏', fnName: 'fullscreen' },
	],
});

const width = defineModel('width');
const height = defineModel('height');

// const widthValueChange = () => {
// 	emit('setStageWidth', state.width);
// };

// const heightValueChange = () => {
// 	emit('setStageHeight', state.height);
// };

// 设置 tool 标题
const setToolTitle = computed(() => {
	let { globalTitle } = themeConfig.value;
	return `${globalTitle} 监控配置`;
});
// 顶部工具栏
const onToolClick = (fnName: string) => {
	emit('tool', fnName);
};
</script>

<style scoped lang="scss">
.workflow-tool {
	height: 35px;
	display: flex;
	align-items: center;
	user-select: none;
	border-bottom: 1px solid var(--el-border-color-light, #ebeef5);
	color: var(--el-text-color-primary);
	.workflow-tool-right {
		flex: 1;
		display: flex;
		justify-content: flex-end;
	}
	&-icon {
		padding: 0 10px;
		cursor: pointer;
		color: var(--next-bg-topBarColor);
		height: 35px;
		line-height: 35px;
		display: flex;
		align-items: center;
		&:hover {
			background: rgba(0, 0, 0, 0.04);
			i {
				display: inline-block;
				animation: logoAnimation 0.3s ease-in-out;
			}
		}
	}
}
</style>
