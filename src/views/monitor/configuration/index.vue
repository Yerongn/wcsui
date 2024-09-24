<template>
	<div class="canvas-container layout-padding">
		<div class="canvas-mask" v-if="state.isShow"></div>
		<div class="layout-padding-auto layout-padding-view canvas-warp">
			<div class="canvas">
				<!-- 顶部工具栏 -->
				<Tool @tool="onToolClick" @setStageHeight="setStageHeight" @set-stage-width="setStageWidth" :config="state.stageSize" />
				<!-- 左侧导航区 -->
				<div class="canvas-content">
					<div class="canvas-left">
						<el-scrollbar>
							<div
								ref="leftNavRefs"
								v-for="val in state.leftNavList"
								:key="val.id"
								:style="{ height: val.isOpen ? 'auto' : '50px', overflow: 'hidden' }"
								class="canvas-left-id"
							>
								<div class="canvas-left-title" @click="onTitleClick(val)">
									<span>{{ val.title }}</span>
									<SvgIcon :name="val.isOpen ? 'ele-ArrowDown' : 'ele-ArrowRight'" />
								</div>
								<div
									class="canvas-left-item"
									v-for="(v, k) in val.children"
									:key="k"
									:data-name="v.name"
									:data-icon="v.icon"
									:data-id="v.id"
									:data-type="v.componentType"
								>
									<div class="canvas-left-item-icon">
										<SvgIcon :name="v.icon" class="canvas-icon-drag" />
										<div class="font10 pl5 name">{{ v.name }}</div>
									</div>
								</div>
							</div>
						</el-scrollbar>
					</div>

					<!-- 右侧绘画区 -->
					<div class="canvas-right" id="canvas" ref="canvasRightRef" @keyup.delete="handleDeleteKeyDown">
						<v-stage ref="stage" :config="state.stageSize" @click="handleStageMouseDown">
							<v-layer ref="layer" @dragmove="onDragmove" @dragend="onDragend">
								<component
									v-for="item in state.componentData"
									:key="item.id"
									:is="item.component"
									:config="item.config"
									@transformend="handleTransformEnd"
									@dblclick="onTextDblclick"
								/>
								<v-rect ref="selectionRectangle" :config="state.selectionRectangle" />
								<v-transformer ref="transformer" />
							</v-layer>
							<v-layer ref="dragLayer"></v-layer>
						</v-stage>
					</div>

					<!-- 节点信息 -->
					<div class="nodeInfo" v-show="state.selected.length === 1">
						<Node ref="devicePropertiesRef" :props="selectedNode"></Node>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import ConveryTransverse from './component/device/convery-transverse/index.vue';
import ConveryPortrait from './component/device/convery-portrait/index.vue';
import Cabinet from './component/device/cabinet/index.vue';
import GoodsShelves from './component/device/goodsShelves/index.vue';
import StackerCrane from './component/device/StackerCrane/index.vue';
import { stat } from 'fs';

export default {
	components: {
		converyPortrait: ConveryPortrait,
		converyTransverse: ConveryTransverse,
		cabinet: Cabinet,
		goodsShelves: GoodsShelves,
		stackerCrane: StackerCrane,
	},
};
</script>

<script setup lang="ts" name="pagescanvas1">
import { defineAsyncComponent, reactive, onMounted, onUnmounted, nextTick, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import Sortable from 'sortablejs';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';
import { leftNavList } from './js/mock';
import Konva from 'konva';

import { useMonitorApi } from '/@/api/monitor';

// 引入组件
const Tool = defineAsyncComponent(() => import('./component/tool/index.vue'));

const Node = defineAsyncComponent(() => import('./component/node/index.vue'));

// 定义变量内容
const leftNavRefs = ref([]);
const canvasRightRef = ref();
const helpRef = ref();
const transformer = ref();
const selectionRectangle = ref();
const stage = ref();
const layer = ref();
const selectedNode = ref();
const devicePropertiesRef = ref();
const stores = useTagsViewRoutes();
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
var GUIDELINE_OFFSET = 5;

const state = reactive({
	leftNavList: [] as Array<any>,
	componentData: [] as Array<CanvasComponent>,
	isShow: false,
	stageSize: {
		width: 800,
		height: 800,
		draggable: false,
		scaleX: 1,
		scaleY: 1,
	},
	isEditing: false,
	selectedShapeName: '',
	selected: [] as Array<any>,
	selectionRectangle: { x: 0, y: 0, width: 0, height: 0, visible: false, listening: false, fill: 'rgba(230,230,250,0.5)' },
});

// 设置 宽度小于 768，不支持操
const setClientWidth = () => {
	const clientWidth = document.body.clientWidth;
	clientWidth < 768 ? (state.isShow = true) : (state.isShow = false);
};
// 左侧导航-数据初始化
const initLeftNavList = async () => {
	state.leftNavList = leftNavList;

	const respond = await useMonitorApi().getMonitor('017bcd59-38bf-f00d-3436-3a11d8ebe1cc');
	var componentData = respond.monitorDevices.map((device: any) => {
		device.config = JSON.parse(device.config);
		return device;
	});

	state.stageSize.width = respond.stageWidth;
	state.stageSize.height = respond.stageHeight;
	state.stageSize.scaleX = respond.stageScale;
	state.stageSize.scaleY = respond.stageScale;

	// 查询接口数据
	state.componentData = componentData;
};
// 左侧导航-初始化拖动
const initSortable = () => {
	leftNavRefs.value.forEach((v) => {
		Sortable.create(v as HTMLDivElement, {
			group: {
				name: 'vue-next-admin-1',
				pull: 'clone',
				put: false,
			},
			animation: 0,
			sort: false,
			draggable: '.canvas-left-item',
			forceFallback: true,
			ondragstart: function (evt: any) {
				evt.preventDefault();
			},
			onEnd: function (evt: any) {
				const { id, type } = evt.clone.dataset;
				const { clientX, clientY } = evt.originalEvent;
				const mousePos = stage.value.getNode().getPointerPosition();
				const stageX = stage.value.getNode().x();
				const stageY = stage.value.getNode().y();
				const el = canvasRightRef.value!;
				const { x, y, width, height } = el.getBoundingClientRect();
				if (clientX < x || clientX > width + x || clientY < y || y > y + height) {
					ElMessage.warning('请把节点拖入到画布中');
				} else {
					// 节点id（唯一）
					const nodeId = Math.random().toString(36).substr(2, 12) + 'object';
					// 处理节点数据

					let config: any;

					state.leftNavList.forEach((item) => {
						return item.children.forEach((c: any) => {
							if (c.id === id) config = { ...c.config };
						});
					});

					config.x = mousePos.x - stageX;
					config.y = mousePos.y - stageY;
					config.name = 'object';
					config.id = nodeId;
					if (type.startsWith('convery')) {
						config.deviceNo = getMaxDeviceNo();
					}
					const node = {
						id: nodeId,
						component: type,
						config: config,
					};
					// 右侧视图内容数组
					state.componentData.push(node);
				}
			},
		});
	});
};

const handleStageMouseDown = (e: any) => {
	// if we are selecting with rect, do nothing
	if (state.selectionRectangle.visible) {
		return;
	}

	// if click on empty area - remove all selections
	if (e.target === e.target.getStage()) {
		state.selected = [];
		// transformer.value.getNode().nodes([]);
		return;
	}

	// clicked on transformer - do nothing
	const clickedOnTransformer = e.target.getParent().className === 'Transformer';
	if (clickedOnTransformer) {
		return;
	}

	const shape = e.target.id() ? e.target : e.target.getParent();

	// 判断是否有按 shift or ctrl?
	const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
	const isSelected = state.selected.indexOf(shape) >= 0;

	if (!metaPressed && !isSelected) {
		// 如果节点未选择且没有按 shift or ctrl 选择当前节点
		state.selected = [shape];
		// 查询选中的id
		let id = e.target.id() === '' ? e.target.getParent().id() : e.target.id();
		const rect = state.componentData.find((r) => r.config.id === id);
		devicePropertiesRef.value.getAttrs(rect?.component, rect?.config, shape);
	} else if (metaPressed && isSelected) {
		// 如果按键且已经选中，取消选择
		state.selected.splice(state.selected.indexOf(shape), 1);
	} else if (metaPressed && !isSelected) {
		// 加入这个选择
		state.selected.push(shape);
	}
	transformer.value.getNode().nodes(state.selected);
};

const updateComponentData = () => {
	state.selected.forEach((item) => {
		// 查询选中的id
		let id = item.id() === '' ? item.getParent().id() : item.id();
		const componentData = state.componentData.find((r: CanvasComponent) => r.config.id === id);
		if (componentData) {
			componentData.config.x = item.x();
			componentData.config.y = item.y();
			componentData.config.rotation = item.rotation();
			componentData.config.scaleX = item.scaleX();
			componentData.config.scaleY = item.scaleY();
		}
	});
};

const handleTransformEnd = (e: any) => {
	updateComponentData();
};

// were can we snap our objects?
const getLineGuideStops = (skipShape: any) => {
	var stage = skipShape.getStage();
	// 我们可以捕捉到舞台边界和舞台中心
	var vertical = [0, stage.width() / 2, stage.width()];
	var horizontal = [0, stage.height() / 2, stage.height()];

	// 然后我们捕捉画布上每个对象的边缘和中心

	layer.value.getNode().children.forEach((guideItem: any) => {
		if (guideItem === skipShape || guideItem.getParent().className === 'Transformer') {
			return;
		}
		var box = guideItem.getClientRect();
		// 我们可以捕捉到形状的所有边缘
		vertical.push([box.x, box.x + box.width, box.x + box.width / 2]);
		horizontal.push([box.y, box.y + box.height, box.y + box.height / 2]);
	});
	return {
		vertical: vertical.flat(),
		horizontal: horizontal.flat(),
	};
};

// 对象的哪些点将触发捕捉？
// 它可以正好在物体的中心
// 但我们将启用所有边缘和中心
const getObjectSnappingEdges = (node: any) => {
	var box = node.getClientRect();
	var absPos = node.absolutePosition();

	return {
		vertical: [
			{
				guide: Math.round(box.x),
				offset: Math.round(absPos.x - box.x),
				snap: 'start',
			},
			{
				guide: Math.round(box.x + box.width / 2),
				offset: Math.round(absPos.x - box.x - box.width / 2),
				snap: 'center',
			},
			{
				guide: Math.round(box.x + box.width),
				offset: Math.round(absPos.x - box.x - box.width),
				snap: 'end',
			},
		],
		horizontal: [
			{
				guide: Math.round(box.y),
				offset: Math.round(absPos.y - box.y),
				snap: 'start',
			},
			{
				guide: Math.round(box.y + box.height / 2),
				offset: Math.round(absPos.y - box.y - box.height / 2),
				snap: 'center',
			},
			{
				guide: Math.round(box.y + box.height),
				offset: Math.round(absPos.y - box.y - box.height),
				snap: 'end',
			},
		],
	};
};

// 查找所有捕捉可能性
const getGuides = (lineGuideStops: any, itemBounds: any) => {
	var resultV = [] as any;
	var resultH = [] as any;

	lineGuideStops.vertical.forEach((lineGuide: any) => {
		itemBounds.vertical.forEach((itemBound: any) => {
			var diff = Math.abs(lineGuide - itemBound.guide);
			// if the distance between guild line and object snap point is close we can consider this for snapping
			if (diff < GUIDELINE_OFFSET) {
				resultV.push({
					lineGuide: lineGuide,
					diff: diff,
					snap: itemBound.snap,
					offset: itemBound.offset,
				});
			}
		});
	});

	lineGuideStops.horizontal.forEach((lineGuide: any) => {
		itemBounds.horizontal.forEach((itemBound: any) => {
			var diff = Math.abs(lineGuide - itemBound.guide);
			if (diff < GUIDELINE_OFFSET) {
				resultH.push({
					lineGuide: lineGuide,
					diff: diff,
					snap: itemBound.snap,
					offset: itemBound.offset,
				});
			}
		});
	});

	var guides = [];

	// find closest snap
	var minV = resultV.sort((a: any, b: any) => a.diff - b.diff)[0];
	var minH = resultH.sort((a: any, b: any) => a.diff - b.diff)[0];
	if (minV) {
		guides.push({
			lineGuide: minV.lineGuide,
			offset: minV.offset,
			orientation: 'V',
			snap: minV.snap,
		});
	}
	if (minH) {
		guides.push({
			lineGuide: minH.lineGuide,
			offset: minH.offset,
			orientation: 'H',
			snap: minH.snap,
		});
	}
	return guides;
};

const drawGuides = (guides: any) => {
	guides.forEach((lg: any) => {
		if (lg.orientation === 'H') {
			var line = new Konva.Line({
				points: [-6000, 0, 6000, 0],
				stroke: 'rgb(0, 161, 255)',
				strokeWidth: 1,
				name: 'guid-line',
				dash: [4, 6],
			});
			layer.value.getNode().add(line);
			line.absolutePosition({
				x: 0,
				y: lg.lineGuide,
			});
		} else if (lg.orientation === 'V') {
			line = new Konva.Line({
				points: [0, -6000, 0, 6000],
				stroke: 'rgb(0, 161, 255)',
				strokeWidth: 1,
				name: 'guid-line',
				dash: [4, 6],
			});
			layer.value.getNode().add(line);
			line.absolutePosition({
				x: lg.lineGuide,
				y: 0,
			});
		}
	});
};

const onDragmove = async (e: any) => {
	transformer.value.getNode().detach();
	if (!(e.target instanceof Konva.Transformer)) {
		// 清除屏幕上以前的所有行
		layer.value
			.getNode()
			.find('.guid-line')
			.forEach((l: any) => l.destroy());

		// 查找可能的捕捉线
		var lineGuideStops = getLineGuideStops(e.target);
		// 查找当前对象的捕捉点
		var itemBounds = getObjectSnappingEdges(e.target);

		//现在找到在哪里可以捕捉当前对象
		var guides = getGuides(lineGuideStops, itemBounds);

		// do nothing of no snapping
		if (!guides.length) {
			return;
		}

		drawGuides(guides);

		var absPos = e.target.absolutePosition();
		// now force object position
		guides.forEach((lg) => {
			switch (lg.snap) {
				case 'start': {
					switch (lg.orientation) {
						case 'V': {
							absPos.x = lg.lineGuide + lg.offset;
							break;
						}
						case 'H': {
							absPos.y = lg.lineGuide + lg.offset;
							break;
						}
					}
					break;
				}
				case 'center': {
					switch (lg.orientation) {
						case 'V': {
							absPos.x = lg.lineGuide + lg.offset;
							break;
						}
						case 'H': {
							absPos.y = lg.lineGuide + lg.offset;
							break;
						}
					}
					break;
				}
				case 'end': {
					switch (lg.orientation) {
						case 'V': {
							absPos.x = lg.lineGuide + lg.offset;
							break;
						}
						case 'H': {
							absPos.y = lg.lineGuide + lg.offset;
							break;
						}
					}
					break;
				}
			}
		});
		e.target.absolutePosition(absPos);
	}
};

const onDragend = (e: any) => {
	// clear all previous lines on the screen
	layer.value
		.getNode()
		.find('.guid-line')
		.forEach((l: any) => l.destroy());

	if (!(e.target instanceof Konva.Transformer)) {
		if (state.selected.length > 1) transformer.value.getNode().nodes(state.selected);
		else {
			state.selected = [e.target];
			transformer.value.getNode().nodes(state.selected);
			// 查询选中的id
			let id = e.target.id() === '' ? e.target.getParent().id() : e.target.id();
			const rect = state.componentData.find((r) => r.config.id === id);
			devicePropertiesRef.value.getAttrs(rect?.component, rect?.config, e.target);
		}
	}

	updateComponentData();
};

// 文本
const onTextDblclick = (e: any) => {
	if (e.target.className !== 'Text') {
		return;
	}
	// 隐藏 tr text
	transformer.value.getNode().detach();
	var textNode = e.target;
	textNode.hide();
	state.isEditing = true;
	// 获取相对stage 位置
	var textPosition = textNode.absolutePosition();

	let ele = document.getElementById('canvas');

	// so position of textarea will be the sum of positions above:

	var areaPosition = {
		x: stage.value.getNode().container().offsetLeft + textPosition.x,
		y: stage.value.getNode().container().offsetTop + textPosition.y,
	};

	// create textarea and style it
	var textarea = document.createElement('textarea');
	//document.body.appendChild(textarea);
	ele?.appendChild(textarea);

	// apply many styles to match text on canvas as close as possible
	// remember that text rendering on canvas and on the textarea can be different
	// and sometimes it is hard to make it 100% the same. But we will try...
	textarea.value = textNode.text();
	textarea.style.position = 'absolute';
	textarea.style.top = areaPosition.y + 'px';
	textarea.style.left = areaPosition.x + 'px';
	textarea.style.width = textNode.width() - textNode.padding() * 2 + 'px';
	textarea.style.height = textNode.height() - textNode.padding() * 2 + 5 + 'px';
	textarea.style.fontSize = textNode.fontSize() + 'px';
	textarea.style.border = 'none';
	textarea.style.padding = '0px';
	textarea.style.margin = '0px';
	textarea.style.overflow = 'hidden';
	textarea.style.background = 'none';
	textarea.style.outline = 'none';
	textarea.style.resize = 'none';
	textarea.style.lineHeight = textNode.lineHeight();
	textarea.style.fontFamily = textNode.fontFamily();
	textarea.style.transformOrigin = 'left top';
	textarea.style.textAlign = textNode.align();
	textarea.style.color = textNode.fill();
	var rotation = textNode.rotation();
	var transform = '';
	if (rotation) {
		transform += 'rotateZ(' + rotation + 'deg)';
	}
	var px = 0;
	// also we need to slightly move textarea on firefox
	// because it jumps a bit
	var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
	if (isFirefox) {
		px += 2 + Math.round(textNode.fontSize() / 20);
	}
	transform += 'translateY(-' + px + 'px)';

	textarea.style.transform = transform;

	// reset height
	textarea.style.height = 'auto';
	// after browsers resized it we can set actual value
	textarea.style.height = textarea.scrollHeight + 3 + 'px';

	textarea.focus();

	function removeTextarea() {
		textarea?.parentNode?.removeChild(textarea);
		window.removeEventListener('click', handleOutsideClick);
		textNode.show();
		state.isEditing = false;
		// tr.show();
		// tr.forceUpdate();
	}

	function setTextareaWidth(newWidth: any) {
		if (!newWidth) {
			// set width for placeholder
			newWidth = textNode.placeholder.length * textNode.fontSize();
		}
		// some extra fixes on different browsers
		var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
		var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
		if (isSafari || isFirefox) {
			newWidth = Math.ceil(newWidth);
		}

		var isEdge = document.DOCUMENT_NODE || /Edge/.test(navigator.userAgent);
		if (isEdge) {
			newWidth += 1;
		}
		textarea.style.width = newWidth + 'px';
	}

	textarea.addEventListener('keydown', function (e) {
		// hide on enter
		// but don't hide on shift + enter
		if (e.keyCode === 13 && !e.shiftKey) {
			textNode.text(textarea.value);
			let id = textNode.id() === '' ? textNode.getParent().id() : textNode.id();
			const componentData = state.componentData.find((r: CanvasComponent) => r.config.id === id);
			if (componentData) {
				componentData.config.text = textarea.value;
			}
			removeTextarea();
		}
		// on esc do not set value back to node
		if (e.keyCode === 27) {
			removeTextarea();
		}
	});

	textarea.addEventListener('keydown', function (e) {
		var scale = textNode.getAbsoluteScale().x;
		setTextareaWidth(textNode.width() * scale);
		textarea.style.height = 'auto';
		textarea.style.height = textarea.scrollHeight + textNode.fontSize() + 'px';
	});

	function handleOutsideClick(e: any) {
		if (e.target !== textarea) {
			textNode.text(textarea.value);
			let id = textNode.id() === '' ? textNode.getParent().id() : textNode.id();
			const componentData = state.componentData.find((r: CanvasComponent) => r.config.id === id);
			if (componentData) {
				componentData.config.text = textarea.value;
			}
			removeTextarea();
		}
	}

	setTimeout(() => {
		window.addEventListener('click', handleOutsideClick);
	});
};

const getMaxDeviceNo = () => {
	var converys = state.componentData.filter((c: CanvasComponent) => c.component.startsWith('convery'));
	const maxConvery = converys.reduce(
		(max: CanvasComponent, component: CanvasComponent) => (component.config.deviceNo > max.config.deviceNo ? component : max),
		{
			id: '',
			component: '',
			config: {
				deviceNo: '1000',
			},
		}
	);

	return parseInt(maxConvery.config.deviceNo) + 1;
};

// 初始化 Konva
const initKonva = () => {
	let ele = document.getElementById('canvas');
	state.stageSize.width = ele?.offsetWidth ?? 800;
	state.stageSize.height = ele?.offsetHeight ?? 800;

	var st = stage.value.getStage();
	var container = st.container();
	container.tabIndex = 1;
	container.focus();

	let x1: number, y1: number, x2: number, y2: number;
	st.on('mousedown touchstart', (e: any) => {
		// if click on empty area - remove all selections
		if (e.target !== e.target.getStage()) {
			return;
		}
		// do nothing if we mousedown on the transformer
		if (e.target.className === 'Transformer') {
			return;
		}
		x1 = st.getPointerPosition().x;
		y1 = st.getPointerPosition().y;
		x2 = st.getPointerPosition().x;
		y2 = st.getPointerPosition().y;

		state.selectionRectangle.x = x1;
		state.selectionRectangle.y = y1;
		state.selectionRectangle.width = 0;
		state.selectionRectangle.height = 0;
		state.selectionRectangle.visible = true;
	});

	st.on('mousemove touchmove', (e: any) => {
		// do nothing if we didn't start selection
		if (!state.selectionRectangle.visible) {
			return;
		}
		x2 = st.getPointerPosition().x;
		y2 = st.getPointerPosition().y;

		state.selectionRectangle.x = Math.min(x1, x2);
		state.selectionRectangle.y = Math.min(y1, y2);
		state.selectionRectangle.width = Math.abs(x2 - x1);
		state.selectionRectangle.height = Math.abs(y2 - y1);
		state.selectionRectangle.visible = true;
	});

	st.on('mouseup touchend', () => {
		// no nothing if we didn't start selection
		if (!state.selectionRectangle.visible) {
			return;
		}
		// update visibility in timeout, so we can check it in click event
		setTimeout(() => {
			state.selectionRectangle.visible = false;
		});

		var shapes = st.find('.object');
		var box = selectionRectangle.value.getNode().getClientRect();

		state.selected = shapes.filter((shape: any) => Konva.Util.haveIntersection(box, shape.getClientRect()));
		transformer.value.getNode().nodes(state.selected);

		// then check intersections and add all shape into correct container
		state.selected.forEach((shape: any) => {
			shape.draggable = false;
		});
	});
};

// 左侧导航-菜单标题点击
const onTitleClick = (val: any) => {
	val.isOpen = !val.isOpen;
};

const handleDeleteKeyDown = (e: any) => {
	if (state.isEditing) return;
	transformer.value.getNode().nodes([]);
	state.selected.forEach((item) => {
		// item.destroy();
		state.componentData.splice(
			state.componentData.findIndex((r) => r.config.id === item.id()),
			1
		);
	});
	state.selected = [];
};

const setStageHeight = (value: number) => {
	var st = stage.value.getStage();
	st.height(Math.floor(value));
	state.stageSize.height = Math.floor(value);
};

const setStageWidth = (value: number) => {
	var st = stage.value.getStage();
	st.width(Math.floor(value));
	state.stageSize.width = Math.floor(value);
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
		case 'submit':
			onToolSubmit();
			break;
		case 'leftCopy':
			onToolLeftCopy();
			break;
		case 'rightCopy':
			onToolRightCopy();
			break;
		case 'topCopy':
			onToolTopCopy();
			break;
		case 'bottomCopy':
			onToolBottomCopy();
			break;
		case 'del':
			onToolDel();
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
// 顶部工具栏-提交
const onToolSubmit = async () => {
	// console.log(state.jsplumbData);
	var componentData = JSON.parse(JSON.stringify(state.componentData));
	componentData = componentData.map((device: any) => {
		device.config = JSON.stringify(device.config);
		device.id = '00000000-0000-0000-0000-000000000000';
		return device;
	});

	var data = {
		id: '017bcd59-38bf-f00d-3436-3a11d8ebe1cc',
		areaName: '入库区域监控',
		monitorDevices: componentData,
		stageWidth: state.stageSize.width,
		stageHeight: state.stageSize.height,
		stageScale: state.stageSize.scaleX,
	};

	await useMonitorApi().updateMonitor(data);

	ElMessage.success('数据提交成功');
};

// 顶部工具栏-复制
const onToolLeftCopy = () => {
	if (state.selected.length !== 1) return;

	// 查询选中的id
	let id = state.selected[0].id() === '' ? state.selected[0].getParent().id() : state.selected[0].id();

	const rect = state.componentData.find((r) => r.config.id === id);

	if (rect === undefined) return;

	const nodeId = Math.random().toString(36).substr(2, 12) + 'object';
	// 处理节点数据

	let config: any;
	config = { ...rect.config };
	config.x = rect.config.x - rect.config.width;
	config.y = rect.config.y;
	config.name = 'object';
	config.id = nodeId;
	if (rect.component.startsWith('convery')) {
		config.deviceNo = getMaxDeviceNo();
	}
	const node = {
		id: nodeId,
		component: rect.component,
		config: config,
	};
	// 右侧视图内容数组
	state.componentData.push(node);

	nextTick(() => {
		var st = stage.value.getStage();
		var device = st.findOne('#' + nodeId);
		state.selected = [device];

		transformer.value.getNode().nodes(state.selected);
	});
};

const onToolRightCopy = () => {
	if (state.selected.length !== 1) return;

	// 查询选中的id
	let id = state.selected[0].id() === '' ? state.selected[0].getParent().id() : state.selected[0].id();

	const rect = state.componentData.find((r) => r.config.id === id);

	if (rect === undefined) return;

	const nodeId = Math.random().toString(36).substr(2, 12) + 'object';
	// 处理节点数据

	let config: any;
	config = { ...rect.config };
	config.x = rect.config.x + rect.config.width;
	config.y = rect.config.y;
	config.name = 'object';
	config.id = nodeId;
	if (rect.component.startsWith('convery')) {
		config.deviceNo = getMaxDeviceNo();
	}
	const node = {
		id: nodeId,
		component: rect.component,
		config: config,
	};
	// 右侧视图内容数组
	state.componentData.push(node);

	nextTick(() => {
		var st = stage.value.getStage();
		var device = st.findOne('#' + nodeId);
		state.selected = [device];

		transformer.value.getNode().nodes(state.selected);
	});
};

const onToolTopCopy = () => {
	if (state.selected.length !== 1) return;

	// 查询选中的id
	let id = state.selected[0].id() === '' ? state.selected[0].getParent().id() : state.selected[0].id();

	const rect = state.componentData.find((r) => r.config.id === id);

	if (rect === undefined) return;

	const nodeId = Math.random().toString(36).substr(2, 12) + 'object';
	// 处理节点数据

	let config: any;
	config = { ...rect.config };
	config.x = rect.config.x;
	config.y = rect.config.y - rect.config.height;
	config.name = 'object';
	config.id = nodeId;
	if (rect.component.startsWith('convery')) {
		config.deviceNo = getMaxDeviceNo();
	}
	const node = {
		id: nodeId,
		component: rect.component,
		config: config,
	};
	// 右侧视图内容数组
	state.componentData.push(node);

	nextTick(() => {
		var st = stage.value.getStage();
		var device = st.findOne('#' + nodeId);
		state.selected = [device];

		transformer.value.getNode().nodes(state.selected);
	});
};

const onToolBottomCopy = () => {
	if (state.selected.length !== 1) return;

	// 查询选中的id
	let id = state.selected[0].id() === '' ? state.selected[0].getParent().id() : state.selected[0].id();

	const rect = state.componentData.find((r) => r.config.id === id);

	if (rect === undefined) return;

	const nodeId = Math.random().toString(36).substr(2, 12) + 'object';
	// 处理节点数据

	let config: any;
	config = { ...rect.config };
	config.x = rect.config.x;
	config.y = rect.config.y + rect.config.height;
	config.name = 'object';
	config.id = nodeId;
	if (rect.component.startsWith('convery')) {
		config.deviceNo = getMaxDeviceNo();
	}
	const node = {
		id: nodeId,
		component: rect.component,
		config: config,
	};
	// 右侧视图内容数组
	state.componentData.push(node);

	nextTick(() => {
		var st = stage.value.getStage();
		var device = st.findOne('#' + nodeId);
		state.selected = [device];

		transformer.value.getNode().nodes(state.selected);
	});
};

// 顶部工具栏-删除
const onToolDel = () => {
	ElMessageBox.confirm('此操作将清空画布，是否继续？', '提示', {
		confirmButtonText: '清空',
		cancelButtonText: '取消',
	})
		.then(() => {
			state.componentData.forEach(() => {
				//	state.jsPlumb.removeAllEndpoints(v.nodeId);
			});
			nextTick(() => {
				state.componentData = [];
				// state.jsplumbData = {nodeList: [],	lineList: [],};
				ElMessage.success('清空画布成功');
			});
		})
		.catch(() => {});
};
// 顶部工具栏-全屏
const onToolFullscreen = () => {
	stores.setCurrenFullscreen(true);
};

// 页面加载时
onMounted(async () => {
	await initLeftNavList();
	initSortable();
	initKonva();
	setClientWidth();
	window.addEventListener('resize', setClientWidth);
});
// 页面卸载时
onUnmounted(() => {
	window.removeEventListener('resize', setClientWidth);
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
					user-select: none;
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
						user-select: none;
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
				overflow: auto;
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
