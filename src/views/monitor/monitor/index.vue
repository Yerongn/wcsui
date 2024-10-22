<template>
	<div class="canvas-container layout-padding">
		<div class="layout-padding-auto layout-padding-view canvas-warp">
			<div class="canvas">
				<!-- 顶部工具栏 -->
				<Tool @tool="onToolClick" :titel="state.title" :config="state.stageSize" />
				<div class="canvas-content">
					<!-- 绘画区 -->
					<div class="canvas-right" id="canvas" ref="canvasRightRef">
						<v-stage ref="stage" :config="state.stageSize">
							<v-layer ref="layer">
								<component
									v-for="(item, index) in state.componentData"
									:key="item.id"
									:is="item.component"
									:config="item.config"
									:ref="setComponentRef(index)"
									@dblclick="ondblclick"
								/>
							</v-layer>
						</v-stage>
					</div>

					<!-- 节点信息 -->
					<Node ref="devicePropertiesRef" :props="selectedNode"></Node>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
const ConveyorTransverse = defineAsyncComponent(() => import('../../monitor/configuration/component/device/conveyor-transverse/index.vue'));
const ConveyorPortrait = defineAsyncComponent(() => import('../../monitor/configuration/component/device/conveyor-portrait/index.vue'));
const Cabinet = defineAsyncComponent(() => import('../../monitor/configuration/component/device/cabinet/index.vue'));
const GoodsShelves = defineAsyncComponent(() => import('../../monitor/configuration/component/device/goodsShelves/index.vue'));
const StackerCrane = defineAsyncComponent(() => import('../../monitor/configuration/component/device/stackerCrane/index.vue'));

export default {
	components: {
		conveyorTransverse: ConveyorTransverse,
		conveyorPortrait: ConveyorPortrait,
		cabinet: Cabinet,
		goodsShelves: GoodsShelves,
		stackerCrane: StackerCrane,
	},
};
</script>

<script setup lang="ts" name="pagescanvas1">
import { defineAsyncComponent, reactive, onMounted, onUnmounted, nextTick, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';
import signalR from '/@/utils/signalR';
import { useMonitorApi } from '/@/api/monitor';
import { useRoute } from 'vue-router';

// 引入组件
const Tool = defineAsyncComponent(() => import('./tool/index.vue'));

const Node = defineAsyncComponent(() => import('./node/index.vue'));

// 用于存储组件引用的数组
const componentRefs = ref([]);

// 设置组件引用
const setComponentRef = (index: number) => {
	return (el: never) => {
		if (el) {
			componentRefs.value[index] = el;
		}
	};
};

// 定义变量内容
const canvasRightRef = ref();
const route = useRoute();
const helpRef = ref();
const stage = ref();
const layer = ref();
const selectedNode = ref();
const devicePropertiesRef = ref();
const stores = useTagsViewRoutes();
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const state = reactive({
	componentData: [] as Array<CanvasComponent>,
	SR: {} as signalR.HubConnection,
	isShow: false,
	stageSize: {
		width: 800,
		height: 800,
		scaleX: 1,
		scaleY: 1,
		draggable: true,
	},
	isEditing: false,
	selectedShapeName: '',
	selected: [] as Array<any>,
	image: null as unknown,
	title: '设备监控',
});

// 设置 宽度小于 768，不支持操
const setClientWidth = () => {
	const clientWidth = document.body.clientWidth;
	clientWidth < 768 ? (state.isShow = true) : (state.isShow = false);
};
// 左侧导航-数据初始化
const initLeftNavList = async () => {
	state.title = '入库区域';

	// 查询数据
	const respond = await useMonitorApi().getMonitor(route.params.id);
	var componentData = respond.monitorDevices?.map((device: any) => {
		device.config = JSON.parse(device.config);
		device.config.draggable = false;
		return device;
	});

	state.componentData = componentData;

	// state.stageSize.width = respond.stageWidth;
	// state.stageSize.height = respond.stageHeight;
	state.stageSize.scaleX = respond.stageScale;
	state.stageSize.scaleY = respond.stageScale;
};

const initMonitorState = async () => {
	// 电控柜
	const serviceIds = state.componentData.filter((x) => x.component === 'cabinet' && x.config.driveId !== '').map((c) => c.config.driveId);
	if (serviceIds.length === 0) return;
	console.log(serviceIds);
	const serviceRespond = await useMonitorApi().getServersState(serviceIds);
	serviceRespond.items.forEach(cabinetStateChange);

	// 物流设备
	const deviceNos = state.componentData.filter((x) => x.config.deviceNo !== undefined).map((c) => c.config.deviceNo);
	if (deviceNos.length === 0) return;
	const deviceRespond = await useMonitorApi().getDevicesState(deviceNos);
	deviceRespond.items.forEach(deviceStateChange);
};

const ondblclick = (e: any) => {
	// 获取设备节点信息

	let id = e.target.id() === '' ? e.target.getParent().id() : e.target.id();

	const component = state.componentData.find((r) => r.config.id === id);

	if (component?.component.startsWith('conveyor')) {
		devicePropertiesRef.value.openDialog(component?.config.deviceNo);
	}
};

// 初始化 Konva
const initKonva = () => {
	let ele = document.getElementById('canvas');
	state.stageSize.width = ele?.offsetWidth ?? 800;
	state.stageSize.height = ele?.offsetHeight ?? 800;
};

// 顶部工具栏-当前项点击
const onToolClick = (fnName: String) => {
	switch (fnName) {
		case 'help':
			onToolHelp();
			break;
		case 'download':
			onToolDownload();
			break;
		case 'fullscreen':
			onToolFullscreen();
			break;
		case 'zoomIn':
			state.stageSize.scaleX = state.stageSize.scaleX + 0.1;
			state.stageSize.scaleY = state.stageSize.scaleY + 0.1;
			break;
		case 'zoomOut':
			state.stageSize.scaleX = state.stageSize.scaleX - 0.1;
			state.stageSize.scaleY = state.stageSize.scaleY - 0.1;
			break;
	}
};
// 顶部工具栏-帮助
const onToolHelp = () => {
	nextTick(() => {
		helpRef.value.open();
	});
};
// 顶部工具栏-下载
const onToolDownload = () => {
	const { globalTitle } = themeConfig.value;
	// const href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state.jsplumbData, null, '\t'));
	const aLink = document.createElement('a');
	// aLink.setAttribute('href', href);
	aLink.setAttribute('download', `${globalTitle}工作流.json`);
	aLink.click();
	aLink.remove();
	ElMessage.success('下载成功');
};

// 顶部工具栏-全屏
const onToolFullscreen = () => {
	stores.setCurrenFullscreen(true);
};

// 页面加载时
onMounted(async () => {
	await initLeftNavList();
	initKonva();
	setClientWidth();
	window.addEventListener('resize', setClientWidth);
	// 订阅设备实时信息
	state.SR = await signalR.init(`main`);

	state.SR.on('ondevicepropvaluechange', (data) => {
		// 反序列化
		var deviceProperties = JSON.parse(data);

		deviceStateChange(deviceProperties);
	});

	state.SR.on('onservicestatechange', (data) => {
		// 反序列化
		var servicestate = JSON.parse(data);

		cabinetStateChange(servicestate);
	});

	await state.SR.start();

	await initMonitorState();
});

const deviceStateChange = (deviceState: any) => {
	// 查找设备
	if (deviceState === null) return;

	const component = state.componentData.find((r) => r.config.deviceNo == deviceState.deviceNo);
	if (component !== undefined) componentRefs.value[state.componentData.indexOf(component)].setAttrs(deviceState);
};

const cabinetStateChange = (servicestate: any) => {
	// 查找设备
	const component = state.componentData.find((r) => r.component === 'cabinet' && r.config.driveId === servicestate.id);
	if (component !== undefined) componentRefs.value[state.componentData.indexOf(component)].setAttrs(servicestate);

	// var st = stage.value.getStage();
	// let id = '#' + component?.config.id;
	// var service = st.findOne(id);
	// if (service === undefined) return;
	// // device.children[0].fill(Konva.Util.getRandomColor());
	// let node = service.children[0];

	// // 更新设备状态
	// node.cache();
	// node.filters([Konva.Filters.RGBA]);

	// // 初始化 橙色
	// if (servicestate.connectionState === 'Initial') {
	// 	node.blue(127);
	// 	node.green(127);
	// 	node.red(127);
	// } else if (servicestate.connectionState === 'Connected') {
	// 	// 已连接绿色
	// 	node.blue(0);
	// 	node.green(225);
	// 	node.red(0);
	// } else {
	// 	// 红色
	// 	node.blue(0);
	// 	node.green(0);
	// 	node.red(225);
	// }
	// node.alpha(0.8);
};

// 页面卸载时
onUnmounted(async () => {
	window.removeEventListener('resize', setClientWidth);
	// 取消订阅设备实时信息
	await state.SR.stop();
});
</script>

<style scoped lang="scss">
.canvas-container {
	position: relative;
	.canvas-warp {
		position: relative;
	}
	.canvas {
		display: flex;
		height: 100%;
		width: 100%;
		flex-direction: column;
		position: absolute;
		top: 0;
		left: 0;
		.canvas-content {
			display: flex;
			height: calc(100% - 35px);
			.canvas-left {
				width: 220px;
				height: 100%;
				border-right: 1px solid var(--el-border-color-light, #ebeef5);
				:deep(.el-collapse-item__content) {
					padding-bottom: 0;
				}
				.canvas-left-title {
					height: 50px;
					display: flex;
					align-items: center;
					padding: 0 10px;
					border-top: 1px solid var(--el-border-color-light, #ebeef5);
					color: var(--el-text-color-primary);
					cursor: default;
					span {
						flex: 1;
					}
				}
				.canvas-left-item {
					display: inline-block;
					width: calc(50% - 15px);
					position: relative;
					cursor: move;
					margin: 0 0 10px 10px;
					.canvas-left-item-icon {
						height: 35px;
						display: flex;
						align-items: center;
						transition: all 0.3s ease;
						padding: 5px 10px;
						border: 1px dashed transparent;
						background: var(--next-bg-color);
						border-radius: 3px;
						i,
						.name {
							color: var(--el-text-color-secondary);
							transition: all 0.3s ease;
							white-space: nowrap;
							text-overflow: ellipsis;
							overflow: hidden;
						}
						&:hover {
							transition: all 0.3s ease;
							border: 1px dashed var(--el-color-primary);
							background: var(--el-color-primary-light-9);
							border-radius: 5px;
							i,
							.name {
								transition: all 0.3s ease;
								color: var(--el-color-primary);
							}
						}
					}
				}
				& .canvas-left-id:first-of-type {
					.canvas-left-title {
						border-top: none;
					}
				}
			}
			.canvas-right {
				flex: 1;
				position: relative;
				overflow: hidden;
				height: 100%;
				background-image: linear-gradient(90deg, rgb(156 214 255 / 15%) 10%, rgba(0, 0, 0, 0) 10%),
					linear-gradient(rgb(156 214 255 / 15%) 10%, rgba(0, 0, 0, 0) 10%);
				background-size: 10px 10px;
				.canvas-right-clone {
					position: absolute;
					.canvas-right-box {
						height: 35px;
						align-items: center;
						color: var(--el-text-color-secondary);
						padding: 0 10px;
						border-radius: 3px;
						cursor: move;
						transition: all 0.3s ease;
						min-width: 94.5px;
						background: var(--el-color-white);
						border: 1px solid var(--el-border-color-light, #ebeef5);
						.canvas-left-item-icon {
							display: flex;
							align-items: center;
							height: 35px;
						}
						&:hover {
							border: 1px dashed var(--el-color-primary);
							background: var(--el-color-primary-light-9);
							transition: all 0.3s ease;
							color: var(--el-color-primary);
							i {
								cursor: Crosshair;
							}
						}
					}
					.canvas-right-active {
						border: 1px dashed var(--el-color-primary);
						background: var(--el-color-primary-light-9);
						color: var(--el-color-primary);
					}
				}
				:deep(.jtk-overlay):not(.aLabel) {
					padding: 4px 10px;
					border: 1px solid var(--el-border-color-light, #ebeef5) !important;
					color: var(--el-text-color-secondary) !important;
					background: var(--el-color-white) !important;
					border-radius: 3px;
					font-size: 10px;
				}
				:deep(.jtk-overlay.canvas-right-empty-label) {
					display: none;
				}
			}
			.nodeInfo {
				background: #fff;
				position: fixed;
				width: 300px;
				position: absolute;
				top: 35px;
				right: 0;
				height: 100%;
				border-left: 1px solid var(--el-border-color-light, #ebeef5);
			}
		}
	}
	.canvas-mask {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		&::after {
			content: '手机版不支持 jsPlumb 操作';
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: 1;
			background: rgba(255, 255, 255, 0.9);
			color: #666666;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
}
</style>
: number: number
