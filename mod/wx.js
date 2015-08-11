define(["jQjsonp"], function () {

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
    //g$WX.title=setVar(g$storeInfo.userInfo.nickname, 'string') + '的微名片';

    window.wxInit = function () {
        //alert('wxconfig');
        wx.config(wxConfig);
    };

    // 获取微信sign
    var getWxSign = function () {
        var wxUrl = encodeURIComponent(location.href.split('#')[0]);

        t$.alert('wxUrl');

        $.jsonp({
            url: g$baseUrl + "/Weixin/Public/token/?_method=GET",
            data: {
                url: wxUrl
            },
            callbackParameter: "callback",
            success: function (obj) {
                obj = $.parseJSON(obj);
                console.dir(obj);
                var appId = obj.data.app_id,
                    timestamp = obj.data.timestamp,
                    nonceStr = obj.data.noncestr,
                    signature = obj.data.signature;
                t$.alert(al$print(obj));
                wx.config({
                    debug: true,
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
                wx.ready(function () {
                    //alert('wxready');
                    wx.onMenuShareAppMessage(g$WX);
                    wx.onMenuShareTimeline(g$WX);
                    wx.onMenuShareQQ(g$WX);
                    wx.onMenuShareWeibo(g$WX);
                });
                check.wx = true;
            },
            error: function () {
            }
        });
    };

    if (g$isWX) {
        getWxSign();
    }
    else {
        check.wx = true;
    }

});