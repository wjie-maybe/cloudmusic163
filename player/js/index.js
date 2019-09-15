$(function () {
   /*公共头部处理*/

  /*公共底部处理*/

    /*内容*/
    let oAudio = $("audio")[0];
    //控制歌词和默认界面的切换
    $(".main-in").click(function () {
       $(".main-in").toggleClass("active");
    });
    let mySwiper = new Swiper ('.swiper-container', {
        loop: true, // 循环模式选项
    });
    let lyricScroll = new IScroll('.lyric-bottom');


    //监听歌曲是否加载完成
    let flag = true;
    $("audio").on("canplay",function () {
        //获取歌曲时长
        let songTime = formartTime(oAudio.duration*1000);
        $(".total-time").text(songTime.minute+":"+songTime.second);
        //播放按钮点击状态动画
        if (flag){
            flag=false;
        }
        else {
            return;
        }
        $(".play").click(function () {
            if ($(this).attr("class").includes("active")){
                $('.default-top>img').css({transform:"rotate(-30deg)"});
                $(".disc-pic").css({"animation-play-state": "paused"})
            $("audio")[0].pause();
            }
            else{
                $('.default-top>img').css({transform:"rotate(0deg)"});
                $(".disc-pic").css({"animation-play-state": "running"})
                $("audio")[0].play();
            }
            $(this).toggleClass("active");
        });
    });


    //获取默认界面歌曲信息
    MusicApis.getSongDetail("108913,108914")
        .then(function (data) {
            for (let i=0 ;i<data.songs.length;i++){
                let song = data.songs[i];
                let name = "";
                if (i===0){
                    $(".header-title").text(song.name);
                    for (let j=0;j<song.ar.length;j++){
                       if (j===0){
                           name +=song.ar[j].name;
                       }
                       else{
                           name += "/"+song.ar[j].name;
                       }
                    }
                    $(".header-singer").text(name)
                    $(".disc-pic>img").attr("src",song.al.picUrl);
                }
            }
        })
        .catch(function (err) {
            console.log(err);
        });

    //获取歌曲URL
    MusicApis.getSongUrl(108914)
        .then(function (data) {
            for (let i=0;i<data.data.length;i++){
                let $src = `<source src="${data.data[i].url}" type="audio/${data.data[i].type}">`;
                $("audio").append($src);
            }
        })
        .catch(function (e) {
            console.log(e);
        });

    //设置播放进度条
    let musicProgress = new NJProgress($(".progress-bar"),$(".progress-line"),$(".progress-dot"));
    musicProgress.progressClick(function (value) {
        oAudio.currentTime = oAudio.duration*value;
    });
    musicProgress.progressMove(false,function (value) {
        oAudio.currentTime = oAudio.duration*value;
    });
    $("audio").on("timeupdate",function () {
        let value = oAudio.currentTime/oAudio.duration;
        musicProgress.setProgress(value*100);
        let curTime = formartTime(oAudio.currentTime*1000);
        $(".cur-time").text(curTime.minute+":"+curTime.second);
    });


    //设置进度条控制音量
    let voiceValue = 0.5;
    oAudio.volume = voiceValue;
    let voiceProgress = new NJProgress($(".voice-progress-bar"),$(".voice-progress-line"),$(".voice-progress-dot"));
    voiceProgress.progressClick(function (value) {
        oAudio.volume = value;
        voiceValue=value;
    });
    voiceProgress.progressMove(false,function (value) {
        oAudio.volume = value;
        voiceValue=value;
    });
    $(".lyric-top>img").click(function (event) {
        if (oAudio.volume!==0){
            oAudio.volume = 0;
            voiceProgress.setProgress(0);
        }
        else {
            oAudio.volume = voiceValue;
            voiceProgress.setProgress(voiceValue*100);
        }
        return false;
    })
});