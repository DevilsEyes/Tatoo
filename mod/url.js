define(["mmRouter",
        "jQjsonp",
        "Layer",
        "pages/home/main"
    ],
    function () {

        function Page_ERROR() {
            console.log("Get Url Error!:\n  "+ location.hash);
            location.hash = "#!/home";
        }

        //获取openid
        function getOpenId(){
            if (g$isWX&&g$code) {

                $.jsonp({
                    url: g$baseUrl + "/Weixin/Public/accessToken",
                    callbackParameter: "callback",
                    data: {
                        code: g$params.code
                    },
                    success: function (obj) {
                        var obj = $.parseJSON(obj);
                        if (obj.code == 0) {
                            window.g$openId = obj.data.openid;
                        }
                    }
                });
            }
        }
        getOpenId();

        //获取店铺信息
        function getStoreInfo() {
            $.jsonp({
                url: g$baseUrl + "/Store/info/?storeId=" + g$id + '&full=true',
                callbackParameter: "callback",
                success: function (obj) {
                    obj = $.parseJSON(obj);
                    console.dir(obj);
                    if (obj.code == 0) {
                        var us = obj.data.storeInfo.sector;
                        if (us == 10) {
                            us = '美甲';
                        }
                        else if (us == 20) {
                            us = '美发';
                        }
                        else if (us == 30) {
                            us = '纹身';
                        }
                        else if (us == 40) {
                            us = '摄影';
                        }

                        g$storeInfo = {
                            avater: obj.data.userInfo.avatar,
                            phone: obj.data.userInfo.phonenum,
                            strSector: us,
                            wxNum: obj.data.userInfo.wxNum,
                            nickname: obj.data.userInfo.nickname,
                            intro: obj.data.userInfo.faith,
                            storeId: obj.data.userInfo.userId,
                            role: obj.data.userInfo.role
                        };

                    }
                    else {
                        location.hash = "#!/Login";
                    }

                },
                error: function () {
                    layer.msg("您的网络好像不太给力哦", {time: 1000});
                    window.hash = "#!/Login";
                }
            })
        }
        getStoreInfo();

        function Refresh() {
            var Page = this.query.page;
            var Query = location.hash.substr(17 + (Page.length));
            var Hash = "#!/" + Page;
            if (Query.length > 0) {
                Hash += "?" + Query;
            }
            console.log(Hash);
            location.hash = Hash;
        }

        avalon.router.error(Page_ERROR);
        avalon.router.get("/Refresh", Refresh);
        avalon.history.start({
            basepath: "/avalon"
        });
        avalon.scan(document.body);

    }
);