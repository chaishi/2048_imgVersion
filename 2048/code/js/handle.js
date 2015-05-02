var handle = {};

/**
 * @func 初始化地图
 */
handle.initMap = function(){
	gl.map = [];
	gl.gameScore = 0;
	gl.gameover = false;
	gl.gameWin = false;
	document.getElementById("score").innerHTML = gl.gameScore;
	for(var i = 0; i < 4; i++){
		gl.map[i] = new Array();
		for(var j = 0; j < 4; j++){
			gl.map[i][j] = {};
			gl.map[i][j].value = 0;
			gl.map[i][j].flag = false;//标记是否合并过
		}
	}
	gl.stdWidth = (gl.cvs.width / 4 - 5 ) | 0;
	gl.stdHeight = gl.stdWidth;
	gl.bgImg = Background.getInstance();
	gl.bgImg.draw(gl.ctx,gl.cvs);
	handle.getNewData(1);
	handle.getNewData(1);
};

/**
 * @func 当移动事件触发时，执行该函数，根据移动方向开始移动
 */
handle.derection = function(der){
	if(!handle.checkQueue()) //一次滑动完成之前不能继续滑动
		return;
	var flagMove = false;
	switch(der){
		case 37:flagMove = handle.searchMapLeft(1);break;
		case 38:flagMove = handle.searchMapUp(1);break;
		case 39:flagMove = handle.searchMapRight(1);break;
		case 40:flagMove = handle.searchMapDown(1);break;
		default:break;
	}
	if(flagMove){
		handle.slide(der);
	}
	return flagMove;
};

/**
 * @func 移动效果
 */
handle.slide = function(der){
	gl.ctx.clearRect(0,0,gl.cvs.width,gl.cvs.height);
	gl.bgImg.draw();
	handle.searchRect(der);		
	if(!handle.checkQueue()){	
		window.requestAnimationFrame(function(){handle.slide(der);});
	}else{
		handle.obser.pubGoal();
	}
};

/**
 * @func 更新地图（移动完成后）
 */
handle.reDrawMap = function(){
	gl.ctx.clearRect(0,0,gl.cvs.width,gl.cvs.height);
	gl.bgImg.draw();
	for(var m = 0; m < 4; m++){
		for(var p = 0; p < 4; p++){	
			var _map = gl.map[m][p];
			_map.flag = false;		
			if(_map.value > 0){			
				_map.Img = new Img({x:m,y:p},_map.value,game.images[_map.value - 1]);
				_map.Img.drawByPos();
			}else{
				if(_map.Img){
					delete _map.Img;
				}
			} 
		}
	}
};

//更改分数
handle.changeScore = function(){
	document.getElementById("score").innerHTML = gl.gameScore;	
};

/**
 * @func 创建新图片，如：“2方块儿”， （能够成功移动之后，或者游戏刚开始）
 * @param value: 用于生成名为value的 png图片
 */
handle.getNewData = function(value){
	var xx = (Math.random() * 40 | 0 ) % 4;
	var yy = (Math.random() * 40 | 0 ) % 4;
	var _map = gl.map[xx][yy];
	if(!_map.Img){
		_map.value = value;
		_map.Img = new Img({x:xx,y:yy},value,game.images[value - 1]);	
		_map.Img.drawByPos();
	}else{
		handle.getNewData(value);
	}
};

handle.gameWin = function(){
	if(gl.gameWin){
		document.getElementById("gameResult").innerHTML = "恭喜你，通关成功！！！";
		eventHandle.removeAllEvent();
		return true;
	}				
	return false;
};

handle.gameOver = function(){
	var f1 = handle.searchMapLeft(0),
		f2 = handle.searchMapUp(0),
		f3 = handle.searchMapRight(0),
		f4 = handle.searchMapDown(0);
	if( f1 || f2 || f3 || f4){			
		return false;
	}else{
		document.getElementById("gameResult").innerHTML = "很遗憾，通关失败！！！";
		eventHandle.removeAllEvent();
		return true;
	}	
};

/**
 * @func 设定一个目标：即方块儿移动。当方块儿移动完成时，可通知观察者们完成自己的工作
 * 观察者如下 ： 创建新方块儿，重绘地图，判断游戏结束与否，更改游戏分数
 */
handle.observerMove = (function(){
	function obj(){
		this.fns = [];
	}
	obj.prototype = {
		constructor:obj,
		addObserver:function(fn,data){
			this.fns.push({fn:fn,data:data});
		},
		pubGoal:function(){
			for(var i = 0, len = this.fns.length; i < len; i += 1){
				var func = this.fns[i];
	       		if(typeof func.fn === "function"){
	       			if(func.data)
	       				func.fn( func.data );
	       			else
	       				func.fn();
	       		}
	       }
		}
	};
	return obj;
})();

handle.obser = new handle.observerMove();
handle.obser.addObserver(handle.reDrawMap);
handle.obser.addObserver(handle.changeScore);
handle.obser.addObserver(handle.getNewData,1);
handle.obser.addObserver(handle.gameWin);
handle.obser.addObserver(handle.gameOver);
handle.obser.addObserver(handle.reDrawMap);

/**
 * @func 寻找待移动方块儿，加入移动队列
 * @param {number} der 移动方向 
 */
handle.searchRect = function(der){
	gl.queue.length = 0;
	for(var i = 0; i < 4; i++){
		for(var j = 0; j < 4; j++){
			if(gl.map[i][j].Img){
				gl.map[i][j].Img.move(der);
				gl.queue.push(gl.map[i][j].Img);
			}
		}
	}
};

/**
 * @func 检查方块儿移动队列里的方块儿是否移动完成
 * @return {Boolean} 移动完成后返回true，否则返回false
 */
handle.checkQueue = function(){
	for(var i = 0, len = gl.queue.length; i < len; i++){
		if(!gl.queue[i].arrived){
			return false; //队列里还有未完成的方块儿
		}
	}
	return true;
};




handle.setOldPos = function(i,j,ki,kj){
	gl.map[i][j].value = 0;
	gl.map[i][j].Img.ePosition.x = ki;
	gl.map[i][j].Img.ePosition.y = kj;	
};


handle.searchMapUp = function(test){
	var flagMove = false;
	for(var i = 0; i < 4; i++){
		for(var j = 0; j < 4; j++){
			if(gl.map[i][j].value > 0 ){//方块儿有值时				
				var t = gl.map[i][j].value;
				if(j == 0){
					handle.setOldPos(i,j,i,j);
					gl.map[i][j].value = t;
				}
				for(var k = j - 1; k >= 0; k--){				
					if(gl.map[i][k].value > 0){//当上一个方块儿有值时
						//当方块儿的值与上一个方块儿的值相等时,合并
						if(gl.map[i][k].value == t && !gl.map[i][k].flag){
							if(test == 1){ //若只是检测能否移动，不改变终点目标
								handle.setOldPos(i,j,i,k);
								gl.gameScore += Math.pow(2,gl.map[i][k].value);
								gl.map[i][k].value++;	
								gl.map[i][k].flag = true;		
								if(gl.map[i][k].value == 11)//出现2048游戏通关
									gl.gameWin = true;		
							}
							flagMove = true;						
						}else{//上方有方块儿，但2个方块儿的值不相同
							if(test == 1){
								handle.setOldPos(i,j,i,k+1);
								gl.map[i][k+1].value = t;
							}								
							if(j != k + 1)
								flagMove = true;
						}
						break;
					}
					if(k == 0){
						if(test == 1){
							handle.setOldPos(i,j,i,k);
							gl.map[i][k].value = t;
						}
						flagMove = true;
					}					
				}
			}
		}
	}
	return flagMove;
};
handle.searchMapDown = function(test){
	var flagMove = false;
	for(var i = 0; i < 4; i++){
		for(var j = 3; j >= 0; j--){
			if(gl.map[i][j].value > 0){				
				var t = gl.map[i][j].value;
				if(j == 3){
					handle.setOldPos(i,j,i,j);gl.map[i][j].value = t;
				}
				for(var k = j + 1; k < 4; k++){					
					if(gl.map[i][k].value > 0){
						if(gl.map[i][k].value == t && !gl.map[i][k].flag){
							if(test == 1){
								handle.setOldPos(i,j,i,k);
								gl.gameScore += Math.pow(2,gl.map[i][k].value);
								gl.map[i][k].value++;	
								gl.map[i][k].flag = true;	
								if(gl.map[i][k].value == 11)//出现2048游戏通关
									gl.gameWin = true;	
							}	
							flagMove = true;								
						}else{
							if(test == 1){
								handle.setOldPos(i,j,i,k-1);
								gl.map[i][k-1].value = t;	
							}
							if(j != k - 1)
								flagMove = true;	
						}
						break;
					}
					if(k == 3){
						if(test == 1){
							handle.setOldPos(i,j,i,k);
							gl.map[i][k].value = t;
						}
						flagMove = true;
					}					
				}
			}
		}
	}
	return flagMove;
};

handle.searchMapLeft = function(test){
	var flagMove = false;
	for(var j = 0; j < 4; j++){
		for(var i = 0; i < 4; i++){
			if(gl.map[i][j].value > 0){				
				var t = gl.map[i][j].value;
				if(i == 0){
					handle.setOldPos(i,j,i,j);
					gl.map[i][j].value = t;
				}
				for(var k = i - 1; k >= 0; k--){					
					if(gl.map[k][j].value > 0){
						if(gl.map[k][j].value == t && !gl.map[k][j].flag){
							if(test == 1){
								handle.setOldPos(i,j,k,j);
								gl.gameScore += Math.pow(2,gl.map[k][j].value);
								gl.map[k][j].value++;	
								gl.map[k][j].flag = true;
								if(gl.map[k][j].value == 11)//出现2048游戏通关
									gl.gameWin = true;
							}
							flagMove = true;
						}else{
							if(test == 1){
								handle.setOldPos(i,j,k+1,j);
								gl.map[k+1][j].value = t;	
							}
							if(i != k + 1)
								flagMove = true;
						}
						break;
					}
					if(k == 0){
						if(test == 1){
							handle.setOldPos(i,j,k,j);
							gl.map[k][j].value = t;
						}
						flagMove = true;
					}					
				}
			}
		}
	}
	return flagMove;
};


handle.searchMapRight = function(test){
	var flagMove = false;
	for(var j = 0; j < 4; j++){
		for(var i = 3; i >= 0; i--){
			if(gl.map[i][j].value > 0){	
				var t = gl.map[i][j].value;		
				if(i == 3){
					handle.setOldPos(i,j,i,j);
					gl.map[i][j].value = t;
				}
				for(var k = i + 1; k < 4; k++){					
					if(gl.map[k][j].value > 0){
						if(gl.map[k][j].value == t && !gl.map[k][j].flag){
							if(test == 1){
								handle.setOldPos(i,j,k,j);
								gl.gameScore += Math.pow(2,gl.map[k][j].value);
								gl.map[k][j].value++;
								gl.map[k][j].flag = true;			
								if(gl.map[k][j].value == 11)//出现2048游戏通关
									gl.gameWin = true;
							}	
							flagMove = true;									
						}else{
							if(test == 1){
								handle.setOldPos(i,j,k-1,j);
								gl.map[k-1][j].value = t;	
							}
							if(i != k - 1)
								flagMove = true;	
						}
						break;
					}
					if(k == 3){
						if(test == 1){
							handle.setOldPos(i,j,k,j);
							gl.map[k][j].value = t;
						}
						flagMove = true;
					}					
				}
			}
		}
	}
	return flagMove;
};


