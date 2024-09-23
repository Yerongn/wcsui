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
		<v-text
			:config="{
				y: props.config.height, //
				align: 'center',
				width: props.config.width,
				padding: 0,
				text: props.config.driveName,
				fontSize: 14,
				scaleX: 1,
				scaleY: 1,
			}"
		/>
	</v-group>
</template>

<script setup lang="ts" name="converyPortrait">
import { reactive } from 'vue';

const props = defineProps(['config']);

const state = reactive({
	image: null as any,
});
const image = new window.Image();
image.src = 'device/Cabinet.svg';
image.onload = () => {
	// set image only when it is loaded
	state.image = image;
};
</script>
