function Reel(index, vueObj) {
  var self = this;
  base(self, LSprite, []);

  //设置初始属性
  self.maxSpeed = 70;//滚动最大速度
  self.minSpeed = 10;//滚动最小速度
  self.speedUpStep = 2;//每次轮播上升速度增量
  self.speedDownStep = 2;//每次轮播下降速度增量
  self.currentSpeed = 0;//开始的速度

  self.maxNum = 9;//最大的数字 index === 0 ? 7 : 9
  self.currentNum = 1;//开始的数字
  self.stopNum = 0;//获奖区间序号

  self.startReel = false;//是否开启滚动，设置为true时则会加入定时事件进行滚动
  self.stopFlag = true;//是否停止滚动，设置为true时表示准备停止滚动

  self.index = index;
  self.vueObj = vueObj;

  //放入四张数字图片
  self.reels = [];
  self.indexs = [0, 0, 0, 0];
  self.reels.push(new LBitmap(self.getReel()));
  self.reels.push(new LBitmap(self.getReel()));
  self.reels.push(new LBitmap(self.getReel()));
  self.reels.push(new LBitmap(self.reels[0].bitmapData));

  //设置数字图片高度
  self.reels[0].height = 60;
  self.reels[0].bitmapData.height = self.reels[0].height;
  self.reels[0].bitmapData.setCoordinate(0, 80 - self.reels[0].height);
  self.reels[2].height = 60;
  self.reels[2].bitmapData.height = self.reels[2].height;
  self.reels[3].visible = false;

  //设置数字图片高度偏移
  var sy = 0;
  for (var i = 0; i < self.reels.length; i++) {
    self.reels[i].y = sy;
    sy += self.reels[i].height;
    self.addChild(self.reels[i]);
  }
}

//放入数字图片
Reel.prototype.getReel = function () {
  var self = this;
  if (self.currentNum > self.maxNum) self.currentNum = 1;

  //设置indexs数组的值
  self.indexs[0] = self.currentNum;
  self.indexs.pop();
  self.indexs.unshift(self.currentNum);

  return new LBitmapData(self.vueObj.imgList["item" + self.currentNum++]);
};

//定时事件
Reel.prototype.onFrame = function () {
  var self = this;
  if (self.startReel) self.wheel();
};
Reel.prototype.wheel = function () {
  var self = this;

  //调节旋转速度
  if (self.stopFlag) {//停止则速度下降
    if (self.currentSpeed > self.minSpeed) {
      self.currentSpeed -= self.speedDownStep;
    } else {
      self.currentSpeed = self.minSpeed;
    }
  } else {//开始则速度上升
    if (self.currentSpeed < self.maxSpeed) {
      self.currentSpeed += self.speedUpStep;
    } else {
      self.currentSpeed = self.maxSpeed;
    }
  }

  //到达预设的值则停止滚动
  if (self.stopFlag && self.currentSpeed <= self.minSpeed && self.indexs[2] === self.vueObj.combination[self.stopNum][self.index] && self.reels[1].y + self.currentSpeed > 60) {
    self.currentSpeed = 60 - self.reels[1].y;
    self.startReel = false;
  }

  //设置当前图片位置
  self.setY();

  //检查是否完成抽奖
  if (!self.startReel) self.vueObj.checkResult();
};

//设置图片位置
Reel.prototype.setY = function () {
  var self = this;

  self.reels[1].y += self.currentSpeed;
  if (self.reels[1].y + self.reels[1].height > 200) {
    self.reels[1].height = 200 - self.reels[1].y;
    self.reels[1].bitmapData.height = self.reels[1].height;

  }

  if (self.reels[1].y > 80) {
    self.reels[0].height = 80;
    self.reels[0].y = self.reels[1].y - 80;
  } else {
    self.reels[0].height = self.reels[1].y;
    self.reels[0].y = 0;
  }

  self.reels[0].bitmapData.height = self.reels[0].height;
  self.reels[0].bitmapData.setCoordinate(0, 80 - self.reels[0].height);

  self.reels[2].y = self.reels[1].y + self.reels[1].height;
  if (self.reels[2].y > 200) {
    self.reels[2].visible = false;
  } else if (self.reels[2].y + 80 > 200) {
    self.reels[2].height = 200 - self.reels[2].y;
    self.reels[2].bitmapData.height = self.reels[2].height;
  } else {
    self.reels[3].y = self.reels[2].y + self.reels[2].height;
    if (self.reels[3].y < 200) {
      self.reels[3].height = 200 - self.reels[3].y;
      self.reels[3].bitmapData.height = self.reels[3].height;
    }
  }

  if (self.reels[0].y > 0) {
    var child = self.reels.pop();
    child.bitmapData = self.getReel();
    child.visible = true;
    self.reels.unshift(child);
    child.y = 0;
    child.height = self.reels[1].y;
    child.bitmapData.height = child.height;
    child.bitmapData.setCoordinate(0, 80 - child.height);
  }

  if (self.reels[3].y >= 200) {
    self.reels[3].visible = false;
  }
};

export {
  Reel
}
