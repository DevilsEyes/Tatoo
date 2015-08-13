define(["jQjsonp"], function () {

    window.g$WX = {
        title: '',
        desc: '纹身大咖',
        link:'',
        imgUrl: 'http://m.meizhanggui.cc/test2/imgs.Logo.png',
        trigger: function (res) {
        },
        success: function (res) {
        },
        cancel: function (res) {
        },
        fail: function (res) {
        },
        set:function(obj){
            g$params.code=null;
            if(obj.title){
                g$WX.title = obj.title;
            }
            if(obj.desc){
                g$WX.desc = obj.desc;
            }
            if(obj.hash){
                g$WX.link = location.origin + location.pathname + '?' + g$params.toStr() + obj.hash;
            }else{
                g$WX.link = location.origin + location.pathname + '?' + g$params.toStr() + location.hash;
            }
            if(obj.imgUrl){
                g$WX.imgUrl = obj.imgUrl;
            }

            wx.ready(function () {
                wx.onMenuShareAppMessage(g$WX);
                wx.onMenuShareTimeline(g$WX);
                wx.onMenuShareQQ(g$WX);
                wx.onMenuShareWeibo(g$WX);
            });
        }
    };

    // 获取微信sign
    var getWxSign = function () {
        var wxUrl = encodeURIComponent(location.href.split('#')[0]);

        $.jsonp({
            url: "http://api.mzg.so/V1.0.0/Weixin/Public/token/?url=" + wxUrl,
            callbackParameter:'callback',
            success:function(obj){
                obj = $.parseJSON(obj);

                var appId = obj.data.app_id,
                    timestamp = obj.data.timestamp,
                    nonceStr = obj.data.noncestr,
                    signature = obj.data.signature;

                wx.config({
                    debug: false,
                    appId: appId,
                    timestamp: timestamp,
                    nonceStr: nonceStr,
                    signature: signature,
                    jsApiList: [
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ',
                        'onMenuShareWeibo'
                    ]
                });
                wxready();
                check.wx = true;
            },
            error:function(){
                check.wx = true;
            }
        });
    };

    function wxready() {
        wx.ready(function () {
            // 1 判断当前版本是否支持指定 JS 接口，支持批量判断
            wx.checkJsApi({
                jsApiList: [
                    'getNetworkType',
                    'previewImage'
                ],
                success: function (res) {
                }
            });

            // 2. 分享接口
            // 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
            wx.onMenuShareAppMessage(g$WX);

            // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
            wx.onMenuShareTimeline(g$WX);

            // 2.3 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
            wx.onMenuShareQQ(g$WX);

            // 2.4 监听“分享到微博”按钮点击、自定义分享内容及分享结果接口
            wx.onMenuShareWeibo(g$WX);
            check.wx = true;
        })
    }

    if (g$isWX) {
        getWxSign();
        //check.wx = true;
    }
    else {
        //getWxSign();
        check.wx = true;
    }

});