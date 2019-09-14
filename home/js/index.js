$(function () {
   /*公共头部处理*/
    $(".header").load("./../common/header.html",function () {
        let script = document.createElement("script");
        script.src = "./../common/js/header.js";
        document.body.appendChild(script);
    });
  /*公共底部处理*/
    $(".footer").load("./../common/footer.html",function () {
        let script = document.createElement("script");
        script.src = "./../common/js/footer.js";
        document.body.appendChild(script);
    });
    /*内容*/
    //1.获取svg的长度
    let length = $("#refreshLogo")[0].getTotalLength();
    //2.默认隐藏路径
    $("#refreshLogo").css({"stroke-dasharray": length})
    $("#refreshLogo").css({"stroke-dashoffset": length})
    //3.创建IScroll
    let myScroll = new IScroll(".main",{
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
    //4.监听滚动
    let logoHeight = $(".pull-down").height();
    let isPullDown = false;
    let isPullUp = false;
    let isRefresh = false;
    let bottomHeight = $(".pull-up").height();
    let maxOffsetY = myScroll.maxScrollY - bottomHeight;
    myScroll.on("scroll",function () {
        if (this.y >= logoHeight){
            if ((this.y-logoHeight)*3<=length){
                $("#refreshLogo").css({"stroke-dashoffset": length-(this.y-logoHeight)*3});
            }
            else{
                this.minScrollY=170;
                isPullDown = true;
            }
        }
        /*else if (this.y<maxOffsetY){
            $(".pull-up>p>span").html("松手加载更多");
            this.maxScrollY = maxOffsetY;
            isPullUp = true;
        }*/
    });
    myScroll.on("scrollEnd",function () {
        if (isPullDown&&!isRefresh){
            isRefresh = true;
            //网上刷新数据
            refreshDown();
        }
       /* else if (isPullUp&&!isRefresh){
            isRefresh  = true;
            $(".pull-up>p>span").html("加载中...");
            refreshUp();
        }*/
    });
    function refreshDown() {
        setTimeout(function () {
            console.log("数据刷新了");
            isPullDown = false;
            isRefresh = false;
            myScroll.minScrollY = 0;
            myScroll.scrollTo(0,0);
            $("#refreshLogo").css({"stroke-dashoffset": length})
        },2000);
    }
    function refreshUp() {
        setTimeout(function () {
            console.log("数据刷新了");
            isPullUp = false;
            isRefresh = false;
            myScroll.maxScrollY = maxOffsetY + bottomHeight;
            myScroll.scrollTo(0,myScroll.maxScrollY);
        },2000);
    }
   /*banner开始*/
    HomeApis.getHomeBanner()
        .then(function (data) {
            let html = template('bannerSlide', data);
            $(".swiper-wrapper").html(html);
            myScroll.refresh();
            let mySwiper = new Swiper ('.swiper-container', {
                autoplay: {
                    delay:1000,
                    disableOnInteraction: false,
                },
                loop: true, // 循环模式选项
                // 如果需要分页器
                pagination: {
                    el: '.swiper-pagination',
                    bulletClass : 'my-bullet',
                    bulletActiveClass: 'my-bullet-active',
                },
                observer:true,
                observeSlideChildren:true,
                observeParents:true,
            });
        })
        .catch(function (error) {
            console.log(error);
        })
    /*nav导航*/
    $(".nav i").html(new Date().getDate());
    /*推荐歌单部分*/
     HomeApis.getHomeRecommend()
         .then(function (data) {
             data.title = "推荐歌单";
             data.subTitle = "歌单广场";
             data.result.forEach(function (obj) {
                 obj.width = 216/100;
                 obj.playCount = formatNum(obj.playCount);
             });
             let html = template('category', data);
             $(".recommend").html(html);
             $(".category-tittle").forEach(function (ele) {
                 $clamp(ele,{clamp:2})
             });
             myScroll.refresh();
         })
         .catch(function (error) {
             console.log(error);
         });
    HomeApis.getHomeExclusive()
        .then(function (data) {
            data.title = "独家推送";
            data.subTitle = "网易出品";
            data.result.forEach(function (obj,index) {
                obj.width = 334/100;
                if (index===2){
                    obj.width = 690/100;
                }
            });
            let html = template('category', data);
            $(".exclusive").html(html);
            $(".exclusive .category-tittle").forEach(function (ele) {
                $clamp(ele,{clamp:2})
            });
            myScroll.refresh();
        })
        .catch(function (error) {
            console.log(error);
        });
    HomeApis.getHomeAlbum()
        .then(function (data) {
            data.title = "新碟新歌";
            data.subTitle = "更多新碟";
            data.result = data["albums"];
            data["result"].forEach(function (obj) {
                obj.artistName= obj.artists[0].name;
                obj.width = 216/100;
            });
            let html = template('category', data);
            $(".album").html(html);
            $(".album .category-tittle").forEach(function (ele) {
                $clamp(ele,{clamp:1})
            });
            $(".album .category-singer").forEach(function (ele) {
                $clamp(ele,{clamp:1})
            });
            myScroll.refresh();
        })
        .catch(function (error) {
            console.log(error);
        });
    HomeApis.getHomeMV()
        .then(function (data) {
            data.title = "推荐MV";
            data.subTitle = "更多MV";
            data.result.forEach(function (obj) {
                obj.width = 334/100;
            });
            let html = template('category', data);
            $(".mv").html(html);
            $(".mv .category-tittle").forEach(function (ele) {
                $clamp(ele,{clamp:1})
            });
            $(".mv .category-singer").forEach(function (ele) {
                $clamp(ele,{clamp:1})
            });
            myScroll.refresh();
        })
        .catch(function (error) {
            console.log(error);
        });
    HomeApis.getHomeDJ()
        .then(function (data) {
            data.title = "主播电台";
            data.subTitle = "更多主播";
            data.result.forEach(function (obj) {
                obj.width = 216/100;
            });
            let html = template('category', data);
            $(".dj").html(html);
            $(".dj .category-tittle").forEach(function (ele) {
                $clamp(ele,{clamp:2})
            });
            myScroll.refresh();
        })
        .catch(function (error) {
            console.log(error);
        });
    //处理数据
    function formatNum(num) {
        let res = 0;
        if (num/100000000>=1){
            let numStr = num/100000000 +"";
            if(numStr.indexOf(".") === -1){
                res = num/100000000 + "亿";
            }else{
                res = (num/100000000).toFixed(1) +"亿";
            }
        }
        else if (num/10000>=1){
            let numStr = num/10000 +"";
            if(numStr.indexOf(".") === -1){
                res = num/10000 + "万";
            }else{
                res = (num/10000).toFixed(1) +"万";
            }
        }
        else{
            res = num;
        }
        return res;
    }
    /*setTimeout(function () {
        console.log(myScroll.maxScrollY);
        myScroll.refresh();
        console.log(myScroll.maxScrollY);
    },5000);*/
})