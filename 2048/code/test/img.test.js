module("Img对象测试模块儿");
test("创建Img对象1:最小位置，value保持在正确范围内",function(){
	var sPos = {x:0,y:0},
		value = 1;
	var image = new Img(sPos,value);
	deepEqual(image.sPosition,{x:0,y:0},"检测起始位置{0,0}");
	deepEqual(image.ePosition,{x:null,y:null},"检测默认终点位置");
	strictEqual(image.step,0,"检测默认移动长度");
	ok(image.arrived === false,"检测方块儿是否可移动");
	strictEqual(image.value,1,"检测方块儿值是否正确");
	strictEqual(image.img,game.images[value - 1],"检测方块儿图片是否正确");
});

test("创建Img对象2:最大位置，value保持在正确范围内",function(){
	var sPos = {x:3,y:3},
		value = 11;
	var image = new Img(sPos,value);
	deepEqual(image.sPosition,{x:3,y:3},"检测起始位置{3,3}");
	strictEqual(image.value,11,"检测方块儿值是否正确");
	strictEqual(image.img,game.images[value - 1],"检测方块儿图片是否正确");
});

test("创建Img对象3:超出最小位置，value保持在正确范围内",function(){
	var sPos = {x:-2,y:-1},
		value = 2;
	var image = new Img(sPos,value);
	deepEqual(image.sPosition,{x:0,y:0},"传入参数小于0时，起始位置设为{0,0}");
	strictEqual(image.value,2,"检测方块儿值是否正确");
	strictEqual(image.img,game.images[value - 1],"检测方块儿图片是否正确");
});

test("创建Img对象4:超出最大位置，value保持在正确范围内",function(){
	var sPos = {x:4,y:4},
		value = 9;
	var image = new Img(sPos,value);
	deepEqual(image.sPosition,{x:0,y:0},"传入参数大于时，起始位置设为{0,0}");
	strictEqual(image.value,9,"检测方块儿值是否正确");
	strictEqual(image.img,game.images[value - 1],"检测方块儿图片是否正确");
});

test("创建Img对象5:中间位置，value保持在正确范围内",function(){
	var sPos = {x:4,y:4},
		value = 10;
	var image = new Img(sPos,value);
	deepEqual(image.sPosition,{x:0,y:0},"检测起始位置{0,0}");
	strictEqual(image.value,10,"检测方块儿值是否正确");
	strictEqual(image.img,game.images[value - 1],"检测方块儿图片是否正确");
});

test("创建Img对象6:value为最小值时，位置保持在正确范围内",function(){
	var sPos = {x:2,y:2},
		value = 1;
	var image = new Img(sPos,value);
	deepEqual(image.sPosition,{x:2,y:2},"检测起始位置{2,2}");
	strictEqual(image.value,1,"检测方块儿值是否正确");
	strictEqual(image.img,game.images[value - 1],"检测方块儿图片是否正确");
});

test("创建Img对象7:value为最大值时，位置保持在正确范围内",function(){
	var sPos = {x:2,y:2},
		value = 11;
	var image = new Img(sPos,value);
	deepEqual(image.sPosition,{x:2,y:2},"检测起始位置{2,2}");
	strictEqual(image.value,11,"检测方块儿值是否正确");
	strictEqual(image.img,game.images[value - 1],"检测方块儿图片是否正确");
});

test("创建Img对象8:value小于最小值时，位置保持在正确范围内",function(){
	var sPos = {x:2,y:2},
		value = 0;
	var image = new Img(sPos,value);
	deepEqual(image.sPosition,{x:2,y:2},"检测起始位置{2,2}");
	strictEqual(image.value,1,"检测方块儿值是否正确");
	strictEqual(image.img,game.images[value - 1],"检测方块儿图片是否正确");
});

test("创建Img对象9:value大于最大值时，位置保持在正确范围内",function(){
	var sPos = {x:2,y:2},
		value = 12;
	var image = new Img(sPos,value);
	deepEqual(image.sPosition,{x:2,y:2},"检测起始位置{2,2}");
	strictEqual(image.value,11,"检测方块儿值是否正确");
	strictEqual(image.img,game.images[value - 1],"检测方块儿图片是否正确");
});


module("背景对象测试模块儿");

test("创建背景对象之单例测试",function(){
	var back1 = Background.getInstance();
	back1.draw = function(){
		console.log(1);
	}
	var back2 = Background.getInstance();
	back2.draw = function(){
		console.log(2);
	}
	var back3 = Background.getInstance();
	ok(back1 === back2,"back1 === back2,背景单例测试");
	ok(back2 === back3,"back2 === back3,背景单例测试");
});

