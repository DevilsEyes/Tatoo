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

        //��ȡopenid
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

        //��ȡ������Ϣ
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
                            us = '����';
                        }
                        else if (us == 20) {
                            us = '����';
                        }
                        else if (us == 30) {
                            us = '����';
                        }
                        else if (us == 40) {
                            us = '��Ӱ';
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
                    layer.msg("�����������̫����Ŷ", {time: 1000});
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