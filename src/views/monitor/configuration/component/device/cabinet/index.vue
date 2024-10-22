<template>
	<v-group :config="props.config">
		<v-image
			ref="cabinet"
			:config="{
				image: state.image,
				width: props.config.width,
				height: props.config.height,
			}"
		>
		</v-image>
		<v-text
			ref="text"
			:config="{
				y: props.config.height, //
				align: 'center',
				width: props.config.width,
				padding: 2,
				text: props.config.driveName,
				fontSize: 10,
				scaleX: 1,
				scaleY: 1,
			}"
		/>
	</v-group>
</template>

<script setup lang="ts" name="cabinet">
import { reactive, ref } from 'vue';
import Konva from 'konva';

const props = defineProps(['config']);

const cabinet = ref();

const state = reactive({
	image: null as any,
});

//获取节点属性
const setAttrs = async (config: any) => {
	var node = cabinet.value.getNode();
	node.cache();
	node.filters([Konva.Filters.RGBA]);

	// 初始化 橙色
	if (config.connectionState === 'Initial') {
		node.blue(127);
		node.green(127);
		node.red(127);
	} else if (config.connectionState === 'Connected') {
		// 已连接绿色
		node.blue(0);
		node.green(225);
		node.red(0);
	} else {
		// 红色
		node.blue(0);
		node.green(0);
		node.red(225);
	}
	node.alpha(0.8);
};

// watch(
// 	() => props.config.connectionState,
// 	async (newConnectionState) => {
// 		await nextTick();

// 		const node = cabinet.value.getNode();

// 		console.log(newConnectionState);
// 		console.log(node);
// 		// node.cache();
// 		node.fill = 'red';
// 		node.filters([Konva.Filters.Blur]);
// 		node.blurRadius(10);
// 	},
// 	{
// 		immediate: true,
// 	}
// );

const image = new window.Image();
image.src = 'device/cabinet.svg';
image.onload = () => {
	// set image only when it is loaded
	state.image = image;
};

defineExpose({
	setAttrs,
});
</script>
