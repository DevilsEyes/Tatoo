define([
    "iScroll"
], function () {

    //定义vm
    var vm = avalon.define({
        $id: 'pdetail',

        avatar: '',
        nickname: '',
        wxNum: '',

        proList: [],

        //获取作品信息
        getProInfo: function (code) {
            $.jsonp({
                url: g$baseUrl.slice(0,-6) + "new/products/detail?_method=GET",
                data: {
                    _id: code
                },
                callbackParameter: "callback",
                success: function (obj) {
                    obj = $.parseJSON(obj);
                    console.dir(obj);

                    if (obj.code == 0) {
                        var productInfo = obj.data;

                        var newPro = {
                            _id: productInfo._id,
                            title: productInfo.title,
                            desc: setVar(productInfo.description, 'string').replace(/ /g,'&nbsp;').replace(/</g,'&lt').replace(/>/g,'&gt').replace(/\n/g,'<br/>'),
                            tag: setVar(productInfo.tag, 'string').split('#'),
                            imgs: productInfo.images,
                            length: productInfo.images.length,
                            timeCosts:productInfo.timeCosts,
                            iscroll: null
                        };

                        vm.proList.push(newPro);

                        avalon.scan(document.body);
                        $('.pdetail').css('min-height', $(window).height());
                        if(newPro.tag.length>1){
                            setTimeout(function () {

                                var pd = vm.proList[vm.proList.length - 1];

                                var id = pd._id;

                                var newIsc = new IScroll('.pdt'+id+' #tagAr',{
                                    scrollX:true,
                                    scrollY:false
                                });

                                pd.iscroll = newIsc;

                            }, 1000);
                        }
                        vm$root.isLoading = false;
                    }
                    else {
                        layer.msg(obj.msg);
                    }
                }
            })
        },
        filter:function(str,type){
            switch (type){
                case 'timeCosts':{
                    console.log('timeCosts:'+str);
                    str = +(str||0);
                    if(str==0)return '';
                    else{
                        return ''+str;
                    }
                }
            }
        }
    });

    //初始化
    function init(router) {

        //兼容/pdetail/?code=XXX 和 /pdetail/XXX
        var code = router.params.id?router.params.id:router.query.code;

        if (vm$root.checkPage('pdetail', code)) {

            vm.avatar = setVar(g$storeInfo.userInfo.avatar, 'string', './imgs/def_avatar.jpg');
            vm.wxNum = setVar(g$storeInfo.userInfo.wxNum, 'string');
            vm.nickname = setVar(g$storeInfo.userInfo.nickname, 'string');

            vm.getProInfo(code);
        }
        else{
            vm$root.isLoading = false;
        }
        window.scrollTo(0, 0);
    }

    return {init:init};
});