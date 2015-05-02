//图片
var Img = (function(){
	function obj(position,value){
		var me = this;
		me.sPosition = position; //图片开始的位置
		if(position.x < 0 || position.x > 3)
			me.sPosition.x  = 0;
		if(position.y < 0 || position.y > 3)
			me.sPosition.y  = 0;
		me.ePosition = {x:null,y:null};//图片移动的目标位置
		me.step = 0;
		me.arrived = false;//false表示需要移动，true表示不需要再移动
		me.value = value;
		if(value < 1)
			me.value = 1;
		else if(value > 11)
			me.value = 11;
		me.img = game.images[value - 1];
	}
	//按坐标绘制图片
	obj.prototype.drawByPos = function(){
		var me = this,
			ctx = gl.ctx,
			width = gl.stdWidth,
			height = gl.stdHeight;
		var x = me.sPosition.x * width + 15, 
			y = me.sPosition.y * height + 15;
		ctx.drawImage(me.img, x, y, width - 10 ,height - 10);
	};

	//改变图片位置
	obj.prototype.move = function(der){
		var me = this,
			ctx = gl.ctx,
			width = gl.stdWidth,
			height = gl.stdHeight,
			x = me.sPosition.x * width + 15,
			y = me.sPosition.y * height + 15;	
		me.step += 20;
		switch(der){
		case 37:{//向左,x减小		
			x = x - me.step;
			if(x <= me.ePosition.x * width + 15 && me.ePosition.x != null){
				x = me.ePosition.x * width + 15;
				me.sPosition.x = 0;
				me.step = 0;
				me.arrived = true;
			}	
		}break;
		case 38:{//向上,y减小		
			y = y - me.step;
			if(y <= me.ePosition.y * height + 15 && me.ePosition.x != null){
				y = me.ePosition.y * height + 15;
				me.sPosition.y = 0;
				me.step = 0;
				me.arrived = true;
			}	
		}break;
		case 39:{//向右,x增加		
			x = x + me.step;
			if(x >= me.ePosition.x * width + 15 && me.ePosition.x != null){
				x = me.ePosition.x * width + 15;
				me.sPosition.x = me.ePosition.x;
				me.step = 0;
				me.arrived = true;
			}	
		}break;
		case 40:{//向下,y增加		
			y = y + me.step;
			if(y >= me.ePosition.y * height + 15 && me.ePosition.x != null){
				y = me.ePosition.y * height + 15;
				me.sPosition.y = me.ePosition.y;
				me.step = 0;
				me.arrived = true;
			}				
		}break;
		}
		ctx.drawImage(me.img,x, y , width - 10 ,height - 10);
		return {posX:x,posY:y};
	};
	return obj;
})();


//背景
var Background = (function(){
	function obj(){
	}
	obj.prototype.draw = function(){
		var ctx = gl.ctx,
			cvs = gl.cvs;
		var width = gl.stdWidth,
			height = gl.stdHeight;
		ctx.fillStyle = "#BCAD9D";
		ctx.fillRect(0,0,cvs.width,cvs.height);
		for(var i = 0; i < 4; i++){
			for(var j = 0; j < 4; j++){
				ctx.fillStyle = "#CDBFB5";
				ctx.fillRect(i * width + 15,j * height + 15,width-10,height-10);
			}
		}		
	};
	var instance;
	var _static = {
		getInstance:function(){
			if(instance === undefined){
				instance = new obj();
			}
			return instance;
		}
	};
	return _static;
})();
