<template>
	<div class="workflow-tool">
		<div class="pl15">{{ props.titel }} 设备监控</div>
		<div class="workflow-tool-right">
			<div class="workflow-tool-icon" title="放大" @click="onToolClick('zoomIn')">
				<SvgIcon name="ele-ZoomIn" />
			</div>
			<el-text size="small"> {{ Math.floor(props.config.scaleX * 100) }}%</el-text>

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
import { reactive } from 'vue';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['tool']);

const props = defineProps(['titel', 'config']);

// 定义变量内容
const state = reactive({
	toolList: [
		{ icon: 'ele-Help', title: '帮助', fnName: 'help' },
		{ icon: 'ele-FullScreen', title: '全屏', fnName: 'fullscreen' },
	],
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
