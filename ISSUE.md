  
* [x] 断线重连，同步与绘制的问题   
    观看者： 1. canvas.toDataURL png/webp 传递， 大小限制，分批传。（验证通过）   2. lineWidth, color, width传递  
    绘画者： 绘画者断开，需要定时备份。(计时器 + localStorage/indexDB)

* [x] 橡皮檫问题    
  1. globalCompositeOperation:destination-out (采用)   
  2. 几何计算
   

* [x] 画笔大小和画布大小？ resize的问题 ？ 
    1. sizeRate 绘画者 / 观看者 比例 进行统一调制 （采用）
    2. 统一的px, 通过css3 scale来调整？


* [x] 线条不清楚问题（锯齿，毛边）   
   1. **devicePixelRatio + context.scale (采用生效)**   
   2. 绘制时计算px   
   3. 画线时将坐标取整后加上0.5。原因是canvas在绘制的时候，整数点坐标在屏幕像素的中间点，绘制的时候，线条会俩边都占一半，在视觉上看起来是俩个像素的效果。（写基础方法的时候做下处理）
   4. 设置canvas的宽高后，绘制完图形后再scale缩小。

// reset current transformation matrix to the identity matrix
ctx.setTransform(1, 0, 0, 1, 0, 0);  

canvas中的点用贝斯曲线连接成光滑曲线（解决移动端画布模糊问题）
https://blog.csdn.net/qq_39635302/article/details/79477553   
https://blog.csdn.net/weixin_40346046/article/details/78766141   
https://www.jb51.net/html5/641000.html   
https://www.lizhiqianduan.com/blog/index.php/2019/02/26/javascript-how-to-smooth-line/   
https://stackoverflow.com/questions/7054272/how-to-draw-smooth-curve-through-n-points-using-javascript-html5-canvas