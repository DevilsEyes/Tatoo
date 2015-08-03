define(["mmRouter",
    "jQjsonp",
    "Layer",
    "iScroll",
    "css!./pdetail.css"
], function () {

    avalon.router.get("/pdetail/", init);


    //定义vm_pdetail
    var vm_pdetail = avalon.define({
        $id: 'pdetail',

        avatar: '',
        nickname: '',
        wxNum: '',

        proList: [],

        //获取作品信息
        getProInfo: function (code) {
            $.jsonp({
                url: g$baseUrl + "/Product/info/?_method=GET",
                data: {
                    _id: code
                },
                callbackParameter: "callback",
                success: function (obj) {
                    obj = $.parseJSON(obj);

                    console.log('productInfo:');
                    console.dir(obj);

                    if (obj.code == 0) {
                        var productInfo = obj.data.productInfo;

                        var newPro = {
                            _id: productInfo._id,
                            title: productInfo.title,
                            desc: setVar(productInfo.description, 'string').replace(/ /g,'&nbsp;').replace(/</g,'&lt').replace(/>/g,'&gt').replace(/\n/g,'<br/>'),
                            tag: setVar(productInfo.tag, 'string').split('#'),
                            imgs: productInfo.images,
                            length: productInfo.images.length,
                            iscroll: null
                        };

                        vm_pdetail.proList.push(newPro);

                        console.log('proList:');
                        console.dir(vm_pdetail.proList);

                        avalon.scan(document.body);
                        $('.pdetail').css('min-height', $(window).height());
                        console.dir(newPro.tag);
                        if(newPro.tag.length>1){
                            setTimeout(function () {

                                var pd = vm_pdetail.proList[vm_pdetail.proList.length - 1];

                                var id = pd._id;

                                var newIsc = new IScroll('.pdt'+id+' #tagAr',{
                                    scrollX:true,
                                    scrollY:false
                                });

                                pd.iscroll = newIsc;

                            }, 1000);
                        }
                    }
                    else {
                        layer.msg(obj.msg);
                    }
                }
            })
        }
    });

    //初始化
    function init() {

        var code = this.query.code;

        if (vm$root.checkPage('pdetail', code)) {

            vm_pdetail.avatar = setVar(g$storeInfo.userInfo.avatar, 'string', './imgs/def_avatar.jpg');
            vm_pdetail.wxNum = setVar(g$storeInfo.userInfo.wxNum, 'string');
            vm_pdetail.nickname = setVar(g$storeInfo.userInfo.nickname, 'string');

            vm_pdetail.getProInfo(code);
        }
        window.scrollTo(0, 0);
        vm$root.isLoading = false;
    }

});