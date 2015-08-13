define(["mmRouter",
        "jQjsonp",
        "Layer",
        "pages/home/main",
        "pages/address/main",
        "pages/pdetail/main",
        "pages/bill/main",
        "pages/comment/main",
        "pages/appoint/main",
        "pages/invite/main",
        "pages/nf404/main"
    ],
    function () {

        window.to404 = function(msg,code){
            vm$root.isLoading = false;

            vm$nf404.msg = msg;

            if(typeof(code)!='undefined'){
                location.hash = '#!/nf404/?code=' + code;
            }
            else{
                location.hash = '#!/nf404/';
            }
            avalon.scan(document.body);
        };

        function Page_ERROR() {
            console.log("Get Url Error!:\n  "+ location.hash);
            location.hash = "#!/home/";
        }

        //获取openid
        function getOpenId(){
            if (g$isWX&&g$params.code) {
                $.jsonp({
                    url: g$baseUrl + "/Weixin/Public/accessToken",
                    callbackParameter: "callback",
                    data: {
                        code: g$params.code
                    },
                    success: function (obj) {
                        obj = $.parseJSON(obj);
                        if (obj.code == 0) {
                            if(typeof(obj.data.errmsg)!='undefined'){
                                if(obj.data.errmsg.match('invalid code')){

                                    var page = location.hash.split('/')[1];
                                    var code = location.hash.split('code=')[1];

                                    var str = '#!/refresh/?page=' + page;
                                    if(typeof(code)!='undefined'){
                                        str += '&code=' + code;
                                    }

                                    location.hash = str;
                                }
                            }
                            window.g$openId = obj.data.openid;
                            check.openId = true;
                        }
                    }
                });
            }else{
                check.openId = true;
            }
        }

        //获取店铺信息
        function getStoreInfo() {
            vm$root.isLoading = true;
            $.jsonp({
                url: g$baseUrl + "/Store/info/?_method=GET",
                data:{
                    storeId:g$id,
                    full:true
                },
                callbackParameter: "callback",
                success: function (obj) {
                    obj = $.parseJSON(obj);

                    console.log('获取店铺信息');
                    console.log('storeId:'+g$id);
                    console.dir(obj);
                    console.log('');

                    if (obj.code == 0) {


                        g$storeInfo = obj.data.storeInfo;

                        var us = g$storeInfo.userInfo.sector;
                        if (us == 10) {
                            us = '美甲师';
                        }
                        else if (us == 20) {
                            us = '美发师';
                        }
                        else if (us == 30) {
                            us = '纹身师';
                        }
                        else if (us == 40) {
                            us = '摄影师';
                        }
                        else{
                            us = '爱好者';
                        }
                        g$storeInfo.strSector = us;
                        check.storeInfo = true;

                        avalon.scan(document.body);

                    }
                    else {
                        check.storeInfo = true;
                        to404(obj.msg);
                    }

                },
                error: function () {
                    layer.msg("您的网络好像不太给力哦");
                }
            })
        }


        avalon.router.get("/refresh/",function(){
            var code = this.query.code;
            var page = this.query.page;
            g$params.code=null;
            var str = location.origin + location.pathname + '?' + g$params.toStr() + '#!/' + page + '/';

            if(typeof(code)!='undefined'){
                str += '?code=' + code;
            }
            location.href = str;
        });

        avalon.router.error(Page_ERROR);

        window.vm$root = avalon.define({
            $id: "root",
            nowPage:'',
            allPage:[],
            checkPage:function(page,icode){
                //code用于给详情页判断缓存
                vm$root.isLoading = true;
                var code = typeof(icode)=='undefined'?'':icode;

                var search = '';
                for(var i=0;i<vm$root.allPage.length;i++){
                    search += vm$root.allPage[i].id + vm$root.allPage[i].code + '#';
                    if(page==vm$root.allPage[i].id){
                        var ele = vm$root.allPage[i];
                    }
                }

                if(search.match(page)){
                    vm$root.nowPage = page+code;
                    avalon.scan(document.body);

                    if(!search.match(page+code)){
                        ele.code.push(page+code);
                        return true;
                    }

                    return false;
                }
                else{
                    vm$root.nowPage = page+code;
                    vm$root.allPage.push({
                        id:page,
                        url:'pages/'+page+'/'+page+'.html',
                        code:[page+code]
                    });
                    avalon.scan(document.body);

                    return true;
                }
            },
            isLoading:false,

            wx$zx: function () {
                layer.open({
                    skin: 'tatoo',
                    title: '店主微信号',
                    content: '<h2>' + g$storeInfo.userInfo.wxNum + '</h2><p>长按上面文字复制</p>',
                    shade: 0.3,
                    shadeClose: true,
                    closeBtn: false,
                    btn: []
                });
            }
        });

        vm$root.$watch("isLoading",function(value){
            if(value){
                layer.load(2,{shade: [0.1, '#000']});
            }
            else{
                layer.closeAll('loading');
            }
        });
        vm$root.isLoading = true;

        getOpenId();
        getStoreInfo();

        check.timer = setInterval(function(){

            if(check.openId&&check.storeInfo&&check.wx){
                avalon.history.start({
                    basepath: "/avalon"
                });
                clearInterval(check.timer);
            }

        },50);




    }
);