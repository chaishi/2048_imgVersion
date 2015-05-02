var eventHandle = {};

//再玩儿一次
eventHandle.playAgain = function(){
	document.getElementById("moreTime").onclick = function(){
		handle.initMap();
		eventHandle.addAllEvent();
	};
};

//给PC端添加事件处理程序
eventHandle.addPc = function(){
	document.onkeydown = function(event){
		var e = event || window.event;
		handle.derection(e.keyCode);
	};
};

//给移动端添加事件处理程序，判断滑动方向
eventHandle.addPhone = function(){
	var startPos = {x:null,y:null},
		endPos = {x:null,y:null};
	var touchCtn = 0;
	eventHandle.touchstart = function(event){
		var touch = event.touches[0];
		startPos.x = touch.pageX;
		startPos.y = touch.pageY;
	};
	eventHandle.touchmove = function(event){
		touchCtn++; 
		if(touchCtn >= 5){
			touchCtn = 0;
			var touch = event.touches[0];
			endPos.x = touch.pageX;
			endPos.y = touch.pageY;
			handle.derection(computeDirection());
		}
	};
	
	eventHandle.again = function(){
		touchCtn++;
		if(touchCtn >= 5){
			touchCtn = 0;
			handle.initMap();
			eventHandle.addAllEvent();
		}
	}
	
	function computeDirection(){
		var x0 = endPos.x - startPos.x,
			y0 = endPos.y - startPos.y;
		var der = 0;
		if(x0 > 0 && Math.abs(x0) > Math.abs(y0) 
		|| x0 > 0 && Math.abs(x0) > Math.abs(y0)){
			//alert("right");
			der = 39;
		}else if(y0 < 0 && Math.abs(x0) < Math.abs(y0) 
			  || y0 < 0 && Math.abs(x0) < Math.abs(y0)){
			//alert("top");
			der = 38;
		}else if(x0 < 0 && Math.abs(x0) > Math.abs(y0) 
			  || x0 < 0 && Math.abs(x0) > Math.abs(y0)){
			//alert("left");
			der = 37;
		}else if(y0 > 0 && Math.abs(x0) < Math.abs(y0) 
				|| y0 > 0 && Math.abs(x0) < Math.abs(y0)){
			//alert("down");
			der = 40;
		}
		return der;
	} 
	
	var again = document.getElementById("moreTime");
	again.addEventListener("touchstart",eventHandle.again,false);
	document.addEventListener("touchstart",eventHandle.touchstart,false);
	document.addEventListener("touchmove",eventHandle.touchmove,false);
};

eventHandle.removePc = function(){
	document.onkeydown = null;
};

eventHandle.removePhone = function(){
	document.removeEventListener("touchstart",eventHandle.touchstart,false);
	document.removeEventListener("touchmove",eventHandle.touchmove,false);
};

eventHandle.addAllEvent = function(){
	eventHandle.addPc();
	eventHandle.addPhone();
	eventHandle.playAgain();
};

eventHandle.removeAllEvent = function(){
	eventHandle.removePc();
	eventHandle.removePhone();
};

