<template>
  <div id="myCanvas">loading……</div>
</template>

<script>
 export default {
   name: "Canvas",
   data() {
     return {
       //各个模块
       loadingLayer: null, boxLayer: null, drawLayer: null, startLayer: null, okLayer: null, resultTextField: null,

       //元件列表
       reelList: [], drawBgList: [], stopBtnList: [],

       //图片
       imgSrc: "./static/images/",
       imgData: [
         {name: "slot_bg", path: "slot_bg.png"},
         {name: "draw_bg", path: "slot_draw_bg.png"},
         {name: "start", path: "slot_start.jpg"},
         {name: "stop_up", path: "slot_stop_up.png"},
         {name: "stop_down", path: "slot_stop_down.png"},
         {name: "stop_over", path: "slot_stop_over.png"},
         {name: "slot_ok", path: "slot_ok.png"},
         {name: "close", path: "slot_close.png"},
         {name: "item0", path: "0.png"},
         {name: "item1", path: "1.png"},
         {name: "item2", path: "2.png"},
         {name: "item3", path: "3.png"},
         {name: "item4", path: "4.png"},
         {name: "item5", path: "5.png"},
         {name: "item6", path: "6.png"},
         {name: "item7", path: "7.png"},
         {name: "item8", path: "8.png"},
         {name: "item9", path: "9.png"}
       ],
       imgList: null,

       //获奖数组
       stopNum: 0,
       combination: [[0, 0, 1], [0, 2, 4], [0, 5, 1], [0, 1, 4], [0, 3, 3], [0, 4, 1]]
     }
   },
   methods: {
     init() {
       LInit(5, "myCanvas", 750, 750, this.main);
       LSystem.screen(LStage.FULL_SCREEN);
     },
     main() {
       var self = this;

       //加载进度条
       self.loadingLayer = new LoadingSample1();
       addChild(self.loadingLayer);

       //加入图片路径
       for (var i in self.imgData) {
         self.imgData[i]['path'] = self.imgSrc + self.imgData[i]['path'];
       }

       //加载图片并对游戏进行初始化
       LLoadManage.load(
         self.imgData,
         function (progress) {
           self.loadingLayer.setProgress(progress);
         },
         function (result) {
           self.imgList = result;
           removeChild(self.loadingLayer);
           self.loadingLayer = null;
           self.gameInit();
         }
       );
     },
     gameInit(event) {//游戏初始化
       var self = this;

       self.boxLayer = new LSprite();
       addChild(self.boxLayer);

       //放入背景
       var bgBitmap = new LBitmap(new LBitmapData(self.imgList["slot_bg"]));
       self.boxLayer.addChild(bgBitmap);

       //放入其他元素
       self.drawLayer = new LSprite();
       addChild(self.drawLayer);
       for (var i = 0; i < 3; i++) {
         //放入抽奖背景
         var drawBgBitmap = new LBitmap(new LBitmapData(self.imgList["draw_bg"]));
         drawBgBitmap.x = 150 * i + 156;
         drawBgBitmap.y = 300;
         self.drawLayer.addChild(drawBgBitmap);
         self.drawBgList.push(drawBgBitmap);

         //放入数字
         var reel = new self.$Reel(i, self);
         reel.x = 150 * i + 156;
         reel.y = 300;
         self.drawLayer.addChild(reel);
         self.reelList.push(reel);

         //放入停止按钮，默认隐藏且禁止点击
         var stopButton = new LButton(new LBitmap(new LBitmapData(self.imgList["stop_up"])), new LBitmap(new LBitmapData(self.imgList["stop_down"])), new LBitmap(new LBitmapData(self.imgList["stop_down"])), new LBitmap(new LBitmapData(self.imgList["stop_over"])));
         stopButton.x = 150 * i + 149;
         stopButton.y = 565;
         stopButton.index = i;
         stopButton.visible = false;
         stopButton.setState(LButton.STATE_DISABLE);
         stopButton.addEventListener(LMouseEvent.MOUSE_UP, self.stopEvent);
         self.drawLayer.addChild(stopButton);
         self.stopBtnList.push(stopButton);
       }

       //放入开始按钮
       self.startLayer = new LSprite();
       addChild(self.startLayer);
       var startButton = new LButton(new LBitmap(new LBitmapData(self.imgList["start"])));
       startButton.x = 122;
       startButton.y = 525;
       startButton.addEventListener(LMouseEvent.MOUSE_UP, self.startEvent);
       self.startLayer.addChild(startButton);

       //加入结果页，默认隐藏
       self.okLayer = new LSprite();
       self.okLayer.visible = false;
       addChild(self.okLayer);

       //加入结果页背景
       var resultBitmap = new LBitmap(new LBitmapData(self.imgList["slot_ok"]));
       resultBitmap.x = 117;
       resultBitmap.y = 137;
       self.okLayer.addChild(resultBitmap);

       //加入结果页关闭按钮
       var closeButton = new LButton(new LBitmap(new LBitmapData(self.imgList["close"])));
       closeButton.x = 320;
       closeButton.y = 480;
       closeButton.addEventListener(LMouseEvent.MOUSE_UP, self.closeResult);
       self.okLayer.addChild(closeButton);

       //加入文字
       self.resultTextField = new LTextField();
       self.resultTextField.x = 367;
       self.resultTextField.y = 310;
       self.resultTextField.font = "微软雅黑";
       self.resultTextField.color = "#FADB43";
       self.resultTextField.size = 78;
       self.resultTextField.weight = "bolder";
       self.resultTextField.textAlign = 'center';
       self.okLayer.addChild(self.resultTextField);

       self.boxLayer.addEventListener(LEvent.ENTER_FRAME, self.onFrame);
     },
     stopEvent(event, currentTarget) {//停止按钮事件
       //设置准备关闭滚动
       this.reelList[currentTarget.index].stopFlag = true;

       //设置为禁止状态
       currentTarget.setState(LButton.STATE_DISABLE);
     },
     startEvent(event) {//开始按钮事件
       //隐藏开始按钮
       this.startLayer.visible = false;

       this.stopNum = Math.floor(Math.random() * (this.combination.length / 3));
       for (var i = 1; i < 3; i++) {//第一位不转
         //显示关闭按钮
         this.stopBtnList[i].setState(LButton.STATE_ENABLE);
         this.stopBtnList[i].visible = true;

         this.reelList[i].startReel = true;
         this.reelList[i].stopFlag = false;
         this.reelList[i].stopNum = this.stopNum;
       }
     },
     onFrame() {//定时事件
       for (var i = 0; i < 3; i++) {
         this.reelList[i].onFrame();
       }
     },
     checkResult() {//检查结果
       var allStop = 0;

       //检查每个按钮是否都完成
       for (var i = 0; i < 3; i++) {
         if (!this.reelList[i].startReel) allStop++;
       }

       //都完成
       if (allStop >= 3) {
         for (i = 0; i < 3; i++) {//隐藏停止按钮
           this.stopBtnList[i].visible = false;
         }

         var self = this;
         window.setTimeout(function () {
           //显示结果页面
           self.okLayer.visible = true;

           //获取后两位获奖号码并显示
           var drawNumList = [].concat(self.combination[self.stopNum]);
           drawNumList.shift();
           self.resultTextField.text = drawNumList.join('');
           self.resultTextField.speed = 20;
           self.resultTextField.wind();
         }, 500);
       }
     },
     closeResult() {//关闭结果页并显示开始按钮
       this.okLayer.visible = false;
       this.startLayer.visible = true;
     },
   },
   mounted() {
     this.init();
   }
 }
</script>

<style scoped>

</style>
