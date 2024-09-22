<template>
	<v-group :config="props.config">
		<v-image
			:config="{
				image: state.image,
				width: props.config.width,
				height: props.config.height,
			}"
		>
		</v-image>
		<v-rect :config="{ x: 29.5, y: 9.5, width: 21, height: 21, fill: 'rgba(110, 107, 107, 1)' }"></v-rect>
	</v-group>
</template>

<script setup lang="ts" name="stackerCrane">
import { reactive } from 'vue';

const props = defineProps(['config']);

const state = reactive({
	image: null as any,
});
const image = new window.Image();
image.src = 'device/StackerCrane.svg';
image.onload = () => {
	// set image only when it is loaded
	state.image = image;
};
</script>
