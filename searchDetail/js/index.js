$(function () {
    //解决移动端点击延迟问题
    FastClick.attach(document.body);
    //0.创建类管理各界面
    class Views{
        constructor(params){
            params = params||{offset:0,limit:30};
            this.offset = params.offset;
            this.limit = params.limit;
        }
    }
    class Composite extends Views{
        constructor(params){
            super(params);
            this.name="Composite";
            this.type=1018;
        }
        initData (){
            //获取综合内容
            SearchApis.getSearch(keyword,this.offset,this.limit,this.type)
                .then(function (data) {
                    //创建所有分区
                    let html = template("compositeItem",data.result);
                    $(".composite").html(html);
                    searchScroll.refresh();
                    //填充所有分区内容
                    data.result.order.forEach(function (name) {
                        let currentData = data.result[name];
                        //分区数据处理
                        if (name ==="song"){
                            currentData.songs.forEach(function (obj) {
                                obj.artists = obj.ar;
                                obj.album = obj.al;
                            })
                        } else if (name === "playList"){
                            currentData.playlists = currentData.playLists;
                            currentData.playlists.forEach(function (obj) {
                                obj.playCount = formatNum(obj.playCount);
                            });
                        } else if (name === "user"){
                            currentData.userprofiles = currentData.users;
                        }
                        try {
                            let currentHtml = template(name+'Item',currentData);
                            $(".composite>."+name+">.list").html(currentHtml);
                        }
                        catch (e) {
                            console.log(e);
                        }
                        searchScroll.refresh();
                    });
                    //监听分区底部点击事件
                    $(".composite-bottom").click(function () {
                        $(".nav>ul>."+this.dataset.name).click();
                    })

                })
                .catch(function (e) {
                    console.log(e);
                });
        }
    }
    class Artist extends Views{
        constructor(params){
            super(params);
            this.name="artist";
            this.type=100;
        }
        initData (){
            //获取综合内容
            SearchApis.getSearch(keyword,this.offset,this.limit,this.type)
                .then(function (data) {
                    if (isEmptyObj(data.result)){return}
                    if (data.result.artistCount<10){
                        $(".pull-up").hide();
                    }
                    let html = template("artistItem",data.result);
                    $(".artist>.list").html(html);
                    searchScroll.refresh();
                })
                .catch(function (e) {
                    console.log(e);
                });
        }
    }
    class Song extends Views{
        constructor(searchScroll,params){
            super(params);
            this.searchScroll = searchScroll;
            this.name="song";
            this.type=1;
        }
        initData (){
            let that =this;
            //全选的点击事件
            $(".multiple-select").click(function () {
                $(".song-top").toggleClass("actived");
                $(".list").toggleClass("actived");
            });
            $(".complete-select").click(function () {
                $(".song-top").toggleClass("actived");
                $(".list").toggleClass("actived");
            });
            $(".check-all").click(function () {
                $(".check-all").toggleClass("actived");
                $(".list>li").toggleClass("actived");
            });
            //获取单曲内容
            SearchApis.getSearch(keyword,this.offset,this.limit,this.type)
                .then(function (data) {
                    if (isEmptyObj(data.result)){return}
                    let html = template("songItem",data.result);
                    $(".song>.list").html(html);
                    searchScroll.refresh();
                    //监听单曲的点击事件
                    $(".song>.list>li").click(function () {
                        let musicId = this.dataset.musicId;
                        let musicName = $(this).find(".song-name").text();
                        let musicSinger = $(this).find(".song-singer").text();
                        setSongs(musicId,musicName,musicSinger);
                        window.location.href = "./../player/index.html";
                    });

                    //监听每一首歌曲单选框的点击
                    $(".song>.list>li i").click(function (event) {
                        $(this).parents("li").toggleClass("actived");
                        event.stopPropagation();
                        if ($(".main-in>.song>.list>li.actived").length ===
                            $(".main-in>.song>.list>li").length){
                            if ($(".check-all").hasClass("actived")){}
                            else{
                                $(".check-all").addClass("actived");
                            }
                        }
                        else{
                            if ($(".check-all").hasClass("actived")){
                                $(".check-all").removeClass("actived");
                            }
                        }
                    });

                    //监听播放全部的点击
                    $(".play-all").click(function () {
                        let lis = null;
                       if ($(".main-in>.song>.list>li.actived").length === 0){
                           lis = $(".main-in>.song>.list>li");
                       } else{
                           lis = $(".main-in>.song>.list>li.actived");
                       }
                       lis.forEach(function (li) {
                           let musicId = li.dataset.musicId;
                           let musicName = $(li).find(".song-name").text();
                           let musicSinger = $(li).find(".song-singer").text();
                           setSongs(musicId,musicName,musicSinger);
                       });
                        window.location.href = "./../player/index.html";
                    });
                })
                .catch(function (e) {
                    console.log(e);
                });
            //控制导航条的吸顶效果
            this.searchScroll.on("scroll",function () {
                if (this.y<0){
                    $(".song-top").css({top:-this.y});
                }
                else{
                    $(".song-top").css({top:0});
                }
            });
        }
    }
    class Video extends Views{
        constructor(params){
            super(params);
            this.name="video";
            this.type=1014;
        }
        initData (){
            //获取综合内容
            SearchApis.getSearch(keyword,this.offset,this.limit,this.type)
                .then(function (data) {
                    if (isEmptyObj(data.result)){return}
                    data.result.videos.forEach(function (obj) {
                        obj.playCount = formatNum(obj.playTime);
                        let res = formartTime(obj.durationms);
                        obj.time = res.minute +":" + res.second;
                    })
                    let html = template("videoItem",data.result);
                    $(".video>.list").html(html);
                    searchScroll.refresh();
                })
                .catch(function (e) {
                    console.log(e);
                });
        }
    }
    class User extends Views{
        constructor(params){
            super(params);
            this.name="user";
            this.type=1002;
        }
        initData (){
            //获取综合内容
            SearchApis.getSearch(keyword,this.offset,this.limit,this.type)
                .then(function (data) {
                    if (isEmptyObj(data.result)){return}
                    let html = template("userItem",data.result);
                    $(".user>.list").html(html);
                    searchScroll.refresh();
                })
                .catch(function (e) {
                    console.log(e);
                });
        }
    }
    class Album extends Views{
        constructor(params){
            super(params);
            this.name="album";
            this.type=10;
        }
        initData (){
            //获取综合内容
            SearchApis.getSearch(keyword,this.offset,this.limit,this.type)
                .then(function (data) {
                    if (isEmptyObj(data.result)){return}
                    let html = template("albumItem",data.result);
                    $(".album>.list").html(html);
                    searchScroll.refresh();
                })
                .catch(function (e) {
                    console.log(e);
                });
        }
    }
    class DjRadio extends Views{
        constructor(params){
            super(params);
            this.name="djRadio";
            this.type=1009;
        }
        initData (){
            //获取综合内容
            SearchApis.getSearch(keyword,this.offset,this.limit,this.type)
                .then(function (data) {
                    if (isEmptyObj(data.result)){return}
                    let html = template("djRadioItem",data.result);
                    $(".djRadio>.list").html(html);
                    //监听电台的的点击事件
                    $(".main-in>.djRadio>.list>li").click(function () {
                        let djId = this.dataset.djId;
                        window.location.href = "./../djDetail/index.html?id=" + djId;
                    });
                    searchScroll.refresh();
                })
                .catch(function (e) {
                    console.log(e);
                });
        }
    }
    class PlayList extends Views{
        constructor(params){
            super(params);
            this.name="playList";
            this.type=1000;
        }
        initData (){
            //获取综合内容
            SearchApis.getSearch(keyword,this.offset,this.limit,this.type)
                .then(function (data) {
                    if (isEmptyObj(data.result)){return}
                    let html = template("playListItem",data.result);
                    $(".playList>.list").html(html);
                    searchScroll.refresh();
                })
                .catch(function (e) {
                    console.log(e);
                });
        }
    }
    //1.初始化头部
    let keyword = initHeader();
    function initHeader(){
        let keyword = window.location.href.substr(window.location.href.lastIndexOf("keyword=")+"keyword=".length);
        keyword = decodeURIComponent(keyword).trim();
        //给搜索框设置内容
        $(".header input").attr("value",keyword);
        //监听返回的点击
        $(".go-back").click(function () {
            window.history.back();
        });
        $(".clear-text").click(function () {
            window.history.back();
        });
        return keyword;
    }

    //2.初识化上拉加载更多
    let isRefresh = true;
    let isPullUp = false;
    let index = 0;
    let searchScroll = initScroll();
     function initScroll(){
         let searchScroll = new IScroll('.main',{
             mouseWheel: false,
             scrollbars: false,
             /*
             需要使用iscroll-probe.js才能生效probeType：
             1  滚动不繁忙的时候触发
             2  滚动时每隔一定时间触发
             3  每滚动一像素触发一次
             * */
             probeType: 3,
         });
         //下拉刷新
         searchScroll.on("scroll",function () {
             if (this.y <= searchScroll.maxScrollY) {
                 isPullUp = true;
                 $(".pull-up span").text("松手加载更多");
             }
         });
         searchScroll.on("scrollEnd",function () {
             if (isPullUp && !isRefresh) {
                 isRefresh =true ;
                 $(".pull-up span").text("加载中...");
                 refreshUp();
             }
         });
         function refreshUp() {
             let curViewObj = views[index];
             curViewObj.offset+=curViewObj.limit;
             SearchApis.getSearch(keyword,curViewObj.offset,curViewObj.limit,curViewObj.type)
                 .then(function (data) {
                     let name = undefined;
                     if (curViewObj.name==="user"){
                         name = "userprofileCount";
                     } else{
                         name = curViewObj.name.toLowerCase() + "Count";
                     }
                     let count = data.result[name];
                     if (count!== undefined && count>30){
                         let html = template(curViewObj.name+"Item",data.result);
                         $(".main-in>."+curViewObj.name+">.list").append(html);
                         isRefresh = false;
                         searchScroll.refresh();
                     }else{
                         $(".pull-up").hide();
                         isRefresh = true;
                     }
                     isPullUp = false;
                 })
                 .catch(function (e) {
                     console.log(e);
                 });
         }
         return searchScroll;
     }

     //初始化NAV
    let views = [new Composite(), new Song(searchScroll), new Video(), new Artist(), new Album(), new PlayList(), new DjRadio(), new User()];
    initNav();

    function initNav(){
        //获取ul的宽度
        let ulWidth = 0;
        $(".nav>ul>li").forEach(function (oLi) {
            ulWidth += oLi.offsetWidth;
        });
        let ulPadding = parseInt(getComputedStyle($(".nav")[0]).paddingRight);
        $(".nav>ul").css({width:ulWidth+ulPadding});
        //监听导航点击事件
        $(".nav ul li").click(function () {
            //获取偏移位
            let offsetX = $(".nav")[0].offsetWidth/2 - $(this)[0].offsetWidth/2 - this.offsetLeft;
            if (offsetX>0){
                offsetX=0;
            }
            else if (offsetX<navScroll.maxScrollX){
                offsetX = navScroll.maxScrollX;
            }
            //控制导航条nav移动
            navScroll.scrollTo(offsetX,0,500);
            //导航条选中和控制显示内容
            $(this).addClass("active").siblings().removeClass("active");
            $(".main-in>div").removeClass("active").eq($(this).index()).addClass("active");
            searchScroll.refresh();
            index = $(this).index();
            if (index===0){
                $(".pull-up").hide();
                isRefresh = true;
            }else{
                $(".pull-up").show();
                isRefresh = false;
                let curViewObj = views[index];
                if (curViewObj.initData){
                    curViewObj.initData(keyword);
                    delete curViewObj.init;
                }
            }
        });
        //创建nav的IScroll
        let navScroll = new IScroll(".nav",{
            mouseWheel: false,
            scrollbars: false,
            scrollX: true
        });
        //监听导航项目的点击事件并控制指示条的移动
        $(".nav>ul>span").css({width: $(".nav li")[0].offsetWidth})
        $(".nav>ul>li").click(function () {
            $(".nav>ul span").animate({left: this.offsetLeft ,width:this.offsetWidth},500)
        });
    }
    /*公共底部处理*/
    $(".footer").load("./../common/footer.html",function () {
        let script = document.createElement("script");
        script.src = "./../common/js/footer.js";
        document.body.appendChild(script);
    });


    let obj = new Composite(keyword);
    obj.initData();


});

