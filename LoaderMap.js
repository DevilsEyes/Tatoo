require.config({
    paths: {
        jquery: "include/jQuery/jquery-1.9.1.min",
        avalon: "include/avalon/avalon.modern",

        jQjsonp:"include/jQuery/jquery.jsonp-2.4.0.min",
        jQmd5:"include/jQuery/jquery.md5",

        Layer:"include/Layer/layer",

        text:"include/require/text",
        css:"include/require/css",

        mmRouter:"include/avalon/mmRouter",
        mmHistory:"include/avalon/mmHistory",

        url:"mod/url"
    },

    priority:["text","css"],

    shim: {
        jquery: {exports: "jQuery"},
        avalon: {exports: "avalon"},

        jQjsonp:["jquery"],
        jQmd5:["jquery"],

        iScroll:["jquery"],

        Plupload:["jquery"],
        Qiniu:["jquery","Plupload"]

    }
});

require(["jquery", "avalon"], function($, avalon) {
    require(["url",
        "css!./include/Layer/skin/layer.css",
        "css!./style.css"
    ]);
});