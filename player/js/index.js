$(function () {
   /*公共头部处理*/

  /*公共底部处理*/

    /*内容*/
    //控制歌词和默认界面的切换
    $(".main-in").click(function () {
       $(".main-in").toggleClass("active");
    });
    let mySwiper = new Swiper ('.swiper-container', {
        loop: true, // 循环模式选项
    });
    let lyricScroll = new IScroll('.lyric-bottom');
    //播放状态动画
    $(".play").click(function () {
        if ($(this).attr("class").includes("active")){
            $('.default-top>img').css({transform:"rotate(-30deg)"});
            $(".disc-pic").css({"animation-play-state": "paused"})
        }
        else{
            $('.default-top>img').css({transform:"rotate(0deg)"});
            $(".disc-pic").css({"animation-play-state": "running"})
        }
        $(this).toggleClass("active");
    })
});