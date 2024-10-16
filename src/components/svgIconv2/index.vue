<template>
	<svg aria-hidden="true" :width="size" :height="size">
		<use :href="symbolId" :fill="color" />
	</svg>
</template>

<script>
import { defineComponent, computed } from 'vue';

export default defineComponent({
	name: 'SvgIconV2',
	props: {
		prefix: {
			type: String,
			default: 'icon',
		},
		name: {
			type: String,
			required: true,
		},
		size: {
			type: Number,
			default: () => 14,
		},
		color: {
			type: String,
			default: '#333',
		},
	},
	setup(props) {
		const symbolId = computed(() => `#${props.prefix}-${props.name}`);
		return { symbolId };
	},
});

// 设置图标样式
const setIconSvgStyle = computed(() => {
	return `font-size: ${props.size}px;color: ${props.color};`;
});
</script>
