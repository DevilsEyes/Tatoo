require.config({
    paths: {
        jquery: "include/jQuery/jquery-1.9.1.min.js",
        avalon: "include/avalon/avalon.modern.js",

        jQjsonp:"include/jQuery/jquery.jsonp-2.4.0.min.js",
        jQmd5:"include/jQuery/jquery.md5.js",

        Layer:"include/Layer/layer.js",
        Wookman:'include/WookmanV1.4.8/jquery.wookmark.min.js',
        fastclick:'include/fastClick/fastclick.js',
        icheck:'include/icheck/icheck.min.js',
        iScroll:'include/iScroll/iscroll.js',
        pingpp:'include/pingpp/pingpp_pay.js',

        text:"include/require/text",
        css:"include/require/css",

        mmRouter:"include/avalon/mmRouter",
        mmHistory:"include/avalon/mmHistory",

        init:"mod/init.js",
        router:'mod/router.js',

        page_card:"pages/card/main.js",
        page_address:"pages/address/main.js",
        page_pdetail:"pages/pdetail/main.js",
        page_bill:"pages/bill/main.js",
        page_comment:"pages/comment/main.js",
        page_appoint:"pages/appoint/main.js",
        page_invite:"pages/invite/main.js",
        page_nf404:"pages/nf404/main.js"
    },

    priority:["text","css"],

    shim: {
        jquery: {exports: "jQuery"},
        avalon: {exports: "avalon"},

        jQjsonp:["jquery"],
        jQmd5:["jquery"],

        Wookman:["jquery"],
        iScroll:["jquery"],
        icheck:["jquery"],

        init:["router"]
    }
});

require(["jquery", "avalon","Layer",'jQjsonp'], function($, avalon) {
    require([
        "router?v=20150827-1029",
        "init?v=20150826-1132",
        "css!./include/Layer/skin/layer.css",
        "css!./include/Layer/skin/layer.ex.css",
        "css!./include/icheck/red.css",
        "css!./style.css",
        "pingpp",
        "fastclick"
    ]);
});