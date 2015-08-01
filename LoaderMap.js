require.config({
    paths: {
        jquery: "include/jQuery/jquery-1.9.1.min",
        avalon: "include/avalon/avalon.modern",

        jQjsonp:"include/jQuery/jquery.jsonp-2.4.0.min",
        jQmd5:"include/jQuery/jquery.md5",

        Layer:"include/Layer/layer",
        Wookman:'include/WookmanV1.4.8/jquery.wookmark.min.js',
        fastclick:'include/fastClick/fastclick.js',
        icheck:'include/icheck/icheck.min.js',
        iScroll:'include/iScroll/iscroll.js',
        pingpp:'include/pingpp/pingpp_pay.js',

        //wxsdk:'include/wxsdk/wxsdk.js',

        text:"include/require/text",
        css:"include/require/css",

        mmRouter:"include/avalon/mmRouter",
        mmHistory:"include/avalon/mmHistory",

        url:"mod/url",
        ex:"mod/ex",
        wx:'mod/wx'
    },

    priority:["text","css"],

    shim: {
        jquery: {exports: "jQuery"},
        avalon: {exports: "avalon"},

        jQjsonp:["jquery"],
        jQmd5:["jquery"],

        Wookman:["jquery"],
        iScroll:["jquery"],
        icheck:["jquery"]
    }
});

require(["jquery", "avalon"], function($, avalon) {
    require(["ex",
        "url",
        "css!./include/Layer/skin/layer.css",
        "css!./include/Layer/skin/layer.ex.css",
        "css!./include/icheck/red.css",
        "css!./style.css",
        "pingpp",
        "wx",
        "fastclick"
        //"mod/test.js"
    ]);


});