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

        //获取店铺信息
        function getStoreInfo() {
            vm$root.isLoading = true;
            $.jsonp({
                url: g$baseUrl + "/Store/info/?storeId=" + g$id + '&full=true',
                callbackParameter: "callback",
                success: function (obj) {
                    obj = $.parseJSON(obj);
                    if (obj.code == 0) {

                        g$storeInfo = obj.data.storeInfo;

                        var us = g$storeInfo.sector;
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
                        else{
                            us = '爱好';
                        }
                        g$storeInfo.strSector = us;

                    }
                    else {
                        layer.msg(obj.msg, {time: 1000});
                    }

                },
                error: function () {
                    layer.msg("您的网络好像不太给力哦", {time: 1000});
                    window.hash = "#!/Login";
                }
            })
        }


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

        vm$root = avalon.define({
            $id: "root",
            url:'',
            isLoading:false
        });

        vm$root.$watch("isLoading",function(value){
            if(value){
                layer.load(2,{shade: [0.1, '#000']});
            }
            else{
                layer.closeAll('loading');
            }
        });


        getOpenId();
        getStoreInfo();

        avalon.history.start({
            basepath: "/avalon"
        });
        avalon.scan(document.body);

    }
);