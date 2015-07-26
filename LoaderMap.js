require.config({
    paths: {
        jquery: "include/jQuery/jquery-1.9.1.min",
        avalon: "include/avalon/avalon.modern",

        jQjsonp:"include/jQuery/jquery.jsonp-2.4.0.min",
        jQmd5:"include/jQuery/jquery.md5",

        Layer:"include/Layer/layer",
        Wookman:'include/WookmanV1.4.8/jquery.wookmark.min.js',

        text:"include/require/text",
        css:"include/require/css",

        mmRouter:"include/avalon/mmRouter",
        mmHistory:"include/avalon/mmHistory",

        url:"mod/url",
        ex:"mod/ex"
    },

    priority:["text","css"],

    shim: {
        jquery: {exports: "jQuery"},
        avalon: {exports: "avalon"},

        jQjsonp:["jquery"],
        jQmd5:["jquery"],

        Wookman:["jquery"],

        iScroll:["jquery"],

        Plupload:["jquery"],
        Qiniu:["jquery","Plupload"]

    }
});

require(["jquery", "avalon"], function($, avalon) {
    require(["ex",
        "url",
        "css!./include/Layer/skin/layer.css",
        "css!./style.css"
    ]);
});