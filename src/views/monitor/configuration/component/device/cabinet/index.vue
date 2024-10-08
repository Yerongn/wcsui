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

const props = defineProps(['config']);

const cabinet = ref();

const state = reactive({
	image: null as any,
});

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
image.src = 'device/Cabinet.svg';
image.onload = () => {
	// set image only when it is loaded
	state.image = image;
};
</script>
