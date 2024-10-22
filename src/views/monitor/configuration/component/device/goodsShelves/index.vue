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
	</v-group>
</template>

<script setup lang="ts" name="goodsShelves">
import { reactive } from 'vue';

const props = defineProps(['config']);

const state = reactive({
	image: null as any,
});
const image = new window.Image();
image.src = 'device/goods-shelves.svg';
image.onload = () => {
	// set image only when it is loaded
	state.image = image;
};
</script>
