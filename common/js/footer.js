$(function () {
    //底部切换
    let headerName = ["home","video","me","friend","account"];
    $(".footer-in>ul>li").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
        let src = $(".active img").attr("src");
        src = src.replace('normal',"selected");
        $(".active img").attr("src",src);
        $(".active").siblings().find("img").forEach(function (oImg) {
            oImg.src = oImg.src.replace("selected", "normal");
        });
        //关联头部切换样式
        let currentName = headerName[$(this).index()];
        $(".header-in").removeClass().addClass("header-in "+currentName);
        //界面跳转
        // window.location.href = "./../"+currentName+"/index.html#"+currentName;
    });
    let hashStr = window.location.hash.substr(1);
    if (hashStr.length===0){
        $(".home").click();
    }
    else {
        $("."+hashStr).click();
    }
});