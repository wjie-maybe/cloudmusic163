;(function (window) {
    class Player {
        constructor($audio, musicList) {
            this.$audio = $audio;
            this.audio = $audio[0];
            this.musicList = musicList;
            this.defaultVolume = 0.5;
            this.audio.volume =this.defaultVolume;
            this.currentIndex = -1;
            this.playMode = "loop";
        }
        musicTimeUpdata(callBack){
            let that =this;
            this.$audio.on("timeupdate",function () {
                let currentTime = that.audio.currentTime;
                let duration = that.audio.duration;
                let timeObj = formartTime(currentTime*1000);
                let currentTimeStr = timeObj.minute+':'+timeObj.second;
                callBack(currentTime,duration,currentTimeStr);
            });
        }
        musicCanPlay(callBack){
            let that =this;
            this.$audio.on("canplay",function () {
                let currentTime = that.audio.currentTime;
                let duration = that.audio.duration;
                let timeObj = formartTime(duration*1000);
                let totalTimeStr = timeObj.minute+':'+timeObj.second;
                callBack(currentTime,duration,totalTimeStr);
            })
        }
        musicEnded(callBack){
            let that = this;
            let index =-1;
            this.$audio.on("ended",function () {
                if(that.playMode === "loop"){
                    index = that.currentIndex;
                    index++;
                    if(index > that.musicList.length - 1){
                        index = 0;
                    }
                }else if(that.playMode === "one"){
                    index = that.currentIndex;
                }else if(that.playMode === "random"){
                    for (;;){
                        index = getRandomIntInclusive(0,that.musicList.length-1);
                        if (index !==that.currentIndex){
                            break;
                        }
                    } 
                }
                callBack(index);
            })
        }
        musicSeekTo(value){
            value = this.audio.duration*value;
            if (!value) return;
            this.audio.currentTime = value;
        }
        musicGetVolume(){
            return this.audio.volume;
        }
        musicSetVolume(value){
            if (value<0){
                value =0;
            }
            if (value>1){
                value =1;
            }
            this.audio.volume= value;
            if (value!==0){
                this.defaultVolume = value;
            }
        }
        playMusic(index){
            if (index  === this.currentIndex){
                //是同一首歌
                if (this.audio.paused){
                   this.audio.play();
                }else{
                    this.audio.pause();
                }
            }else {
                //不是同一首歌
                let song = this.musicList[index];
                let that =this;
                //3.获取歌曲URL
                MusicApis.getSongUrl(song.id)
                    .then(function (data) {
                        that.$audio.html("");
                        for (let i=0;i<data.data.length;i++){
                            let $src = $(`<source src="${data.data[i].url}" type="audio/${data.data[i].type}"/>`);
                            $("audio").append($src);
                        }
                        //歌曲更换地址之后需要重新加载
                        that.audio.load();
                        //播放歌曲
                        that.audio.play();
                    })
                    .catch(function (e) {
                        console.log(e);
                    });
                this.currentIndex = index;
            }
        }
    }
    window.Player = Player;
})(window);