$(function () {
    //输入框焦点事件
    $(".header-center-in>input").focus(function () {
        $(".header-in").addClass("active");
        $(".header-container").show();
        $(".history-bottom>li").remove();
        let historyArray = getHistory();
        if (historyArray.length ===0){
            $(".search-history").hide();
        }
        else{
            $(".search-history").show();
            historyArray.forEach(function (item) {
                let $li = $("<li>"+item+"</li>");
                $(".history-bottom").append($li);
            })
            $(".history-bottom>li").click(function () {
                window.location.href="./../searchDetail/index.html?keyword="+$(this).text();
            })
        }
        searchScroll.refresh();
    });
    //取消点击事件
    $(".header-cancle>a").click(function () {
        $(".header-in").removeClass("active");
        $(".header-container").hide();
        $(".header-center-in>input")[0].oninput();
    });
    //friend界面头部切换
    $(".header-switch>span").click(function () {
        $(".header-switch>i").animate({
            left:this.offsetLeft
        },100);
        $(this).addClass("active").siblings().removeClass("active");
    });
    /*搜索界面*/
    //关闭广告点击事件
    $(".search-ad>span").click(function () {
        $(".search-ad").remove();
    });
    //输入框取消焦点事件
    $(".header-center-in>input").blur(function () {
        if (this.value.length === 0 ){
            return;
        }
        setHistory(this.value);
        this.value = "";
    });
    //监听搜索历史删除事件
    $(".history-top>img").click(function () {
        localStorage.removeItem("history");
        $(".search-history").hide();
    });

    //热榜数据获取
    HomeApis.getHomeHotDetail()
        .then(function (data) {
            let html = template('hotItem',data);
            $(".hot-bottom").html(html);
            searchScroll.refresh();
        })
        .catch(function (e) {
            console.log(e);
        });
    //创建searchScroll
    let searchScroll = new IScroll(".header-container",{
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
    //搜索建议处理
    $(".header-center-in>input")[0].oninput = throttle(function () {
        if (this.value.length ===0){
            $(".search-ad").show();
            // $(".search-history").show();
            $(".search-hot").show();
            $(".search-current").hide();
        }
        else{
            $(".search-ad").hide();
            $(".search-history").hide();
            $(".search-hot").hide();
            $("search-current").show();
            $(".current-bottom>li").remove();
            HomeApis.getHomeSearchSuggest(this.value)
                .then(function (data) {
                    data.result.allMatch.forEach(function (obj) {
                        let oLi =$(`<li>
                        <img src="./../common/images/topbar-it666-search.png" alt="">
                        <p>${obj.keyword}</p>
                    </li>`)
                        $(".current-bottom").append(oLi)
                    });
                    $(".current-bottom>li").click(function () {
                        setHistory($(this).text().trim());
                        window.location.href="./../searchDetail/index.html?keyword="+$(this).text();
                    });
                    searchScroll.refresh();
                })
                .catch(function (e) {
                    console.log(e);
                });
        }
        $(".current-top").html(`搜索"<span>${this.value}</span>"`);
        searchScroll.refresh();
    },1000);
    $(".current-top").click(function () {
        let text = $(this).find("span").text();
        window.location.href="./../searchDetail/index.html?keyword="+text;
        setHistory(text);
    });
    function getHistory() {
        let historyArray = localStorage.getItem("history");
        if (!historyArray){
            historyArray = [];
        }
        else {
            historyArray = JSON.parse(historyArray);
        }
        return historyArray;
    }
    function setHistory(value) {
        let historyArray = getHistory();
        if (!historyArray.includes(value)){
            historyArray.unshift(value);
            localStorage.setItem("history",JSON.stringify(historyArray));
        }
    }
});