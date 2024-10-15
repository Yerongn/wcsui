<template>
	<v-group ref="rectRef" :config="props.config">
		<v-image
			:config="{
				image: state.image,
				width: props.config.width,
				height: props.config.height,
			}"
		>
		</v-image>

		<v-rect
			v-if="state.loaded"
			:config="{ x: 12, y: 12, width: props.config.width - 25, height: props.config.height - 25, fill: 'rgba(217, 129, 14, 1)' }"
		></v-rect>

		<v-text
			:config="{
				y: props.config.height / 2 - 7, //
				align: 'center',
				width: props.config.width,
				padding: 0,
				text: props.config.deviceNo,
				fontSize: 14,
				scaleX: 1,
				scaleY: 1,
			}"
		/>
	</v-group>
</template>

<script setup lang="ts" name="converyTransverse">
import { reactive, ref } from 'vue';

const props = defineProps(['config']);

const rectRef = ref();

const state = reactive({
	loaded: false,
	velocity: 25, // 移动每秒25个像素移动
	image: null as any,
});

//获取节点属性
const setAttrs = async (config: any) => {
	state.loaded = config.state.loaded;
	if (state.loaded) {
		console.log('12312');
		const node = rectRef.value;
		const layer = node.getLayer();
		var anim = new Konva.Animation(function (frame) {
			var dist = state.velocity * (frame.timeDiff / 1000);
			rectRef.value.getNode().move({ x: dist, y: 0 });
		}, layer);
		anim.start();
	}
};

const image = new window.Image();
image.src = 'device/Convery-Transverse.svg';
image.onload = () => {
	// set image only when it is loaded
	state.image = image;
};
defineExpose({
	setAttrs,
});
</script>
