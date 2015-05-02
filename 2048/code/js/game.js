//全局变量
var gl = {
	cvs:null,
	ctx:null,
	stdWidth:0,//方块儿宽度
	stdHeight:0,
	bgImg:null,
	gameScore:0,//游戏总分
	gameWin:false,//是否通关
	map:[],//地图
	queue:[]//动画队列
};

/**
 * redefine requestAnimationFrame
 * @return requestAnimationFrame function 
 */
window.requestAnimationFrame = (function(){
	return window.requestAnimationFrame      ||
		   window.webkitRequestAnimationFrame||
		   window.mozRequestAnimationFrame   ||
		   function(callback){
				window.setTimeout(callback,1000/60);
		   };
})();

var game = {
	resources:[],
	images:[],
	load:function(){
		var me = this;
		me.resources.length = 0;
		for(var j = 1; j < 12; j += 1){
			var src = "images/" + j + ".png";
			me.resources.push(src);
		}
		var imgs = me.resources;
		var loadCnt = imgs.length;
		var loaded = 0;
		me.images.length = 0;
		for(var i = 0; i < loadCnt; i += 1){
			var img = new Image();
			img.src = imgs[i];
			me.images.push(img); 
			img.onload = function(){
				if(++loaded === loadCnt){
					me.run();
				}
			};
		}
	},
	run:function(){
		game.setCanvasSize();
		handle.initMap();
		eventHandle.addAllEvent();
	},
	setCanvasSize:function(){
		gl.cvs = document.getElementById('canvas');
		gl.ctx = gl.cvs.getContext('2d');
		if(window.innerWidth < window.innerHeight){
			gl.cvs.width = window.innerWidth * 0.8;
			gl.cvs.height = gl.cvs.width;
		}else{
			gl.cvs.height = window.innerHeight * 0.8;
			gl.cvs.width = gl.cvs.height;
		}
		if(gl.cvs.width < 250){
			gl.cvs.width = 250;
			gl.cvs.height = 250;
		}else if(gl.cvs.width > 400){
			gl.cvs.width = 400;
			gl.cvs.height = 400;
		}
	}
};

game.load();
