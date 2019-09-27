$(function () {
    //解决移动端点击延迟问题
    FastClick.attach(document.body);
    //1.获取其他界面传过来的歌曲信息
    let songArray = getSongs();
    let  index = 0;
    let songId = [];
    songArray.forEach(function (obj) {
        songId.push(obj.id);
    });

    //2.获取默认界面歌曲信息
    let mySwiper = null;
    MusicApis.getSongDetail(songId.join(","))
        .then(function (data) {
            for (let i=0 ;i<data.songs.length;i++){
                let song = data.songs[i];
                songArray[i].picUrl = song.al.picUrl;
                let $slide = $(`<div class="swiper-slide">
                            <div class="disc-pic">
                                <img src="${song.al.picUrl}" alt="">
                            </div>
                        </div>`);
                $(".swiper-wrapper").append($slide);
                mySwiper = new Swiper ('.swiper-container', {
                    loop: true, // 循环模式选项
                    observer:true,
                    observeSlideChildren:true,
                    observeParents:true,
                    on: {
                        slideChangeTransitionEnd: function(){
                            // console.log(this.realIndex);//切换结束时，告诉我现在是第几个slide
                            index = this.realIndex;
                            initDefaultInfo(this.realIndex,this.swipeDirection);
                        },
                    },
                });
            }
        })
        .catch(function (err) {
            console.log(err);
        });
    //根据索引初始化歌词信息
    function initDefaultInfo(index,swipeDirection) {
        //1.拿到对应的歌曲
        let song = songArray[index];
        //2.设置歌曲信息
        $(".header-title").text(song.name);
        $(".header-singer").text(song.singer);
        /*//3.获取歌曲URL
        MusicApis.getSongUrl(song.id)
            .then(function (data) {
                $("audio").html("");
                for (let i=0;i<data.data.length;i++){
                    let $src = $(`<source src="${data.data[i].url}" type="audio/${data.data[i].type}"/>`);
                    $("audio").append($src);
                }
                $("audio")[0].load();
            })
            .catch(function (e) {
                console.log(e);
            });*/
        //4.改变播放背景
        $(".bg").css({background: `url("${song.picUrl}") no-repeat center top`})
        //4.改变动画状态
        if (swipeDirection && !$(".play").hasClass("active")){
            $(".play").toggleClass("active");
            $('.default-top>img').css({transform:"rotate(0deg)"});
            $(".disc-pic").css({"animation-play-state": "running"});
        }
        //播放下一首
        if (swipeDirection){
            player.playMusic(index);
            getLyric(songArray[index].id);
        }
    }

    //3.创建播放器对象
    let player = new Player($("audio"),songArray);

   /*公共头部处理*/
  $(".go-back").click(function () {
      window.history.back();
  });
  /*公共底部处理*/
  $(".footer-bottom .list").click(function () {
      $(".modal-top>p>span").html(`列表循环(${songArray.length})`);
     songArray.forEach(function (obj) {
         let $li =$(`<li>
                    <p>${obj.name}-${obj.singer}</p>
                     <img src="images/player-it666-close.png" class="delete-song">
                 </li>`);
         $(".modal-middle").append($li);
     });
         $(".delete-song").click(function () {
             //1.删除sessionStorage里的数据
             let delIndex = $(this).parent().index();
             let len = deleteSongs(delIndex);
             //2.删除UI界面上的数据
             $(this).parent().remove();
             if (len===0){
                 $(".clear-all").click();
             }
             //3.从swiper中删除对应的数据
             mySwiper.removeSlide(delIndex);
             //4.删除数组中的数据
             songArray.splice(delIndex,1);
             //5.更新歌曲列表头部的信息
             $(".modal-top>p>span").html(`列表循环(${len})`);
     })
      $(".modal").css({display:"block"});
      modalScroll.refresh();
  });
  $(".footer-bottom .prev").click(function () {
      index--;
      mySwiper.slideToLoop(index);
      mySwiper.swipeDirection = "prev";
  });
  $(".footer-bottom .next").click(function () {
        index++;
        mySwiper.slideToLoop(index);
        mySwiper.swipeDirection = "next";
    });
    $(".footer-bottom .play-mode").click(function () {
        if(player.playMode === "loop"){
            // 切换为单曲循环
            player.playMode = "one";
            $(".play-mode>img").attr("src", "images/player-it666-one.png");
        }else if(player.playMode === "one"){
            // 切换为随机播放
            player.playMode = "random";
            $(".play-mode>img").attr("src", "images/player-it666-random.png");
        }else if(player.playMode === "random"){
            // 切换为顺序循环
            player.playMode = "loop";
            $(".play-mode>img").attr("src", "images/player-it666-loop.png");
        }
    });
  $(".modal-bottom").click(function () {
      $(".modal").css({display:"none"});
  });
  //歌曲列表清空列表
    $(".clear-all").click(function () {
        clearSongs();
        window.location.href="./../home/index.html";
    });

    /*内容*/
    //4.控制歌词和默认界面的切换
    $(".main-in").click(function () {
       $(".main-in").toggleClass("active");
       if ($(".main-in").hasClass("active")){
           getLyric(songArray[index].id);
       }
    });

    //5.监听播放按钮点击
    $(".play").click(function () {
        //控制动画
        if ($(this).attr("class").includes("active")){
            $('.default-top>img').css({transform:"rotate(-30deg)"});
            $(".disc-pic").css({"animation-play-state": "paused"});
        }
        else{
            $('.default-top>img').css({transform:"rotate(0deg)"});
            $(".disc-pic").css({"animation-play-state": "running"});
        }
        $(this).toggleClass("active");
        //控制播放
        player.playMusic(index);
    });

    //6.监听歌曲播放进度
    player.musicCanPlay(function (currentTime,duration,totalTimeStr) {
        $(".total-time").text(totalTimeStr);
    });
    //自动播放下一首
    player.musicEnded(function (index) {
        mySwiper.swipeDirection = "next";
        mySwiper.slideToLoop(index);
        // player.playMusic(index);
    });


    //7.设置播放进度条
    let musicProgress = new NJProgress($(".progress-bar"),$(".progress-line"),$(".progress-dot"));
    musicProgress.progressClick(function (value) {
        player.musicSeekTo(value);
    });
    musicProgress.progressMove(false,function (value) {
        player.musicSeekTo(value);
    });
    //监听歌曲时间的更新
    player.musicTimeUpdata(function (currentTime,duration,currentTimeStr) {
        //设置当前时间
        $(".cur-time").text(currentTimeStr);
        let value = currentTime/duration;
        //设置进度条
        musicProgress.setProgress(value*100);
        //设置歌词同步
        let lyricTime = parseInt(currentTime);
        if ($("#wj_"+lyricTime)[0]){
            $("#wj_"+lyricTime).addClass("active").siblings().removeClass("active");
            let offset = $("#wj_"+lyricTime)[0].lrc.offset;
            if ($(".lyric-list")[0].isDrag) {return}
            lyricScroll.scrollTo(0,offset);
        }
    });


    //8.设置进度条控制音量
    let voiceProgress = new NJProgress($(".voice-progress-bar"),$(".voice-progress-line"),$(".voice-progress-dot"));
    voiceProgress.progressClick(function (value) {
        player.musicSetVolume(value);
    });
    voiceProgress.progressMove(false,function (value) {
        player.musicSetVolume(value);
    });
    //静音的点击事件
    $(".lyric-top>img").click(function (event) {
        let volume = player.musicGetVolume();
        if (volume!==0){
            player.musicSetVolume(0);
            voiceProgress.setProgress(0);
        }
        else {
            player.musicSetVolume(player.defaultVolume);
            voiceProgress.setProgress(player.defaultVolume*100);
        }
        return false;
    });

    //9.监听歌词滚动
    let lyricScroll = new IScroll('.lyric-bottom', {
        mouseWheel: false,
        scrollbars: false,
        probeType: 3,
    });
    lyricScroll.on("scroll",function () {
        $(".lyric-time-line").css({display:"flex"});
        $(".lyric-list")[0].isDrag = true;
        let index = Math.abs(parseInt(this.y / $(".lyric-list>li").eq(0).height()));
        let cur$li = $(".lyric-list>li").eq(index);
        if (cur$li[0]){
            cur$li.addClass("hover").siblings().removeClass("hover");
            $(".lyric-time-line>span").text(cur$li[0].lrc.timeStr);
        }
    } );
    lyricScroll.on("scrollEnd",function () {
        $(".lyric-time-line").css({display:"none"});
        $(".lyric-list")[0].isDrag = false;
    })

    //处理歌词
    function parseLyric(lrc) {
        let lyrics = lrc.split("\n");
        let reg1 = /\[\d*:\d*\.\d*\]/g;
        let reg2 = /\[\d*/i;
        let reg3 = /\:\d*/i;
        let lyricObj ={};
        lyrics.forEach(function (lyric) {
            let timeStr = lyric.match(reg1);
            if (!timeStr){return}
            timeStr = timeStr[0];
            let min = timeStr.match(reg2)[0].substr(1);
            let sec = timeStr.match(reg3)[0].substr(1);
            let time = parseInt(min)*60 +parseInt(sec);
            let text = lyric.replace(reg1,"").trim();
            lyricObj[time] = text;
        })
        return lyricObj;
    }
    //获取歌词
    function getLyric(id) {
        //获取并处理歌词
        MusicApis.getSongLyric(id)
            .then(function (data) {
                let lyricObj = parseLyric(data.lrc.lyric);
                let index = 0;
                $(".lyric-list").html("");
                for (let key in lyricObj){
                    let $li = $(`<li id="wj_${key}">${lyricObj[key]}</li>`);
                    if (index===0){
                        $li.addClass("active");
                    }
                    $(".lyric-list").append($li);
                    let time = formartTime(key*1000);
                    $li[0].lrc={
                        offset: -index * $li.height(),
                        timeStr: time.minute+":"+time.second
                    }
                    index++;
                }
                lyricScroll.refresh();
                lyricScroll.maxScrollY -= $(".lyric-bottom").height();
            })
            .catch(function (e) {
                console.log(e);
            })
    }

    let modalScroll = new IScroll('.modal-list',{
        mouseWheel: false,
        scrollbars: false,
    })
});