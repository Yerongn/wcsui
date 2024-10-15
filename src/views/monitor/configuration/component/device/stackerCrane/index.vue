<template>
	<v-group ref="groupRef" :config="props.config">
		<v-image
			:config="{
				image: state.image,
				width: props.config.width,
				height: props.config.height,
			}"
		>
		</v-image>
		<v-rect :config="{ x: 29.5, y: 9.5, width: 21, height: 21, fill: state.fill }"></v-rect>
	</v-group>
</template>

<script setup lang="ts" name="stackerCrane">
import { reactive, ref } from 'vue';

const props = defineProps(['config']);

const groupRef = ref();
const state = reactive({
	image: null as any,
	velocity: 25, // 移动每秒25个像素移动
	fill: 'rgba(110, 107, 107, 1)',
});

const image = new window.Image();
image.src = 'device/StackerCrane.svg';
image.onload = () => {
	// set image only when it is loaded
	state.image = image;
	// const node = groupRef.value.getNode();
	// const layer = node.getLayer();
	// var anim = new Konva.Animation(function (frame) {
	// 	var dist = state.velocity * (frame.timeDiff / 1000);
	// 	groupRef.value.getNode().move({ x: dist, y: 0 });
	// }, layer);
	// anim.start();
};
</script>
