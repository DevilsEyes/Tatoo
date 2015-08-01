define(["jQjsonp"],function(){

    window.g$WX = {
        title: '',
        desc: '纹身大咖',
        imgUrl: 'http://m.meizhanggui.cc/test2/imgs.Logo.png',
        trigger: function (res) {
        },
        success: function (res) {
        },
        cancel: function (res) {
        },
        fail: function (res) {
        }
    };

    window.wxInit = function(){
        wx.config(wxConfig);

        g$WX.title=setVar(g$storeInfo.userInfo.nickname, 'string') + '的微名片';
        wx.ready(function () {
            wx.onMenuShareAppMessage({
                title: '',
                desc: '',
                link: '',
                imgUrl: '',
                trigger: function(res) {
                },
                success: function(res) {
                },
                cancel: function(res) {
                },
                fail: function(res) {
                }
            });


            // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
            wx.onMenuShareTimeline({
                title: '',
                link: '',
                imgUrl: '',
                trigger: function(res) {
                },
                success: function(res) {
                },
                cancel: function(res) {
                },
                fail: function(res) {
                }
            });


            // 2.3 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
            wx.onMenuShareQQ({
                title: '',
                desc: '',
                link: '',
                imgUrl: '',
                trigger: function(res) {
                },
                complete: function(res) {
                },
                success: function(res) {
                },
                cancel: function(res) {
                },
                fail: function(res) {
                }
            });


            // 2.4 监听“分享到微博”按钮点击、自定义分享内容及分享结果接口
            wx.onMenuShareWeibo({
                title: '',
                desc: '',
                link: '',
                imgUrl: '',
                trigger: function(res) {
                },
                complete: function(res) {
                },
                success: function(res) {
                },
                cancel: function(res) {
                },
                fail: function(res) {
                }
            });
        })
    };

    // 获取微信sign
    var getWxSign = function () {
        var wxUrl = encodeURIComponent(location.host);

        $.jsonp({
            url: g$baseUrl + "/Weixin/Public/token/?_method=GET",
            data:{
                url:wxUrl
            },
            callbackParameter:"callback",
            success: function (obj) {
                obj = $.parseJSON(obj);
                console.dir(obj);
                var appId = obj.data.app_id,
                    timestamp = obj.data.timestamp,
                    nonceStr = obj.data.noncestr,
                    signature = obj.data.signature;
                window.wxConfig = {
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
                };
                check.wx = true;
            },
            error:function(){
            }
        });
    };

    if(g$isWX){
        getWxSign();
    }
    else{
        check.wx = true;
    }

});