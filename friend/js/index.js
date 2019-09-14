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

});