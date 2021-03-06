define([
    'icheck'
], function () {

    var vm = avalon.define({
        $id: 'comment',
        billId: '',
        nickname:'',
        avatar:'',

        step:'',

        stars:0,
        star$click:function($event,num){
            vm.stars = num;
        },

        textComment:'',

        putComment:function(){

            if(vm.stars==0){
                layer.msg('给手艺人打个分嘛！');
                return;
            }
            if(vm.textComment.length<1){
                layer.msg('你还没有做出评价哦！');
                return;
            }
            vm$root.isLoading = true;
            $.jsonp({
                url: g$baseUrl + "/Bill/comment/?_method=PUT",
                data: {
                    billId: vm.billId,
                    score:vm.stars,
                    content:vm.textComment
                },
                callbackParameter: "callback",
                success: function (obj) {
                    vm$root.isLoading = false;

                    obj = $.parseJSON(obj);
                    console.dir(obj);

                    if (obj.code == 0) {

                        layer.msg('评价成功！');
                        window.scrollTo(0, 0);
                        vm$root.isLoading = false;
                        vm.step = 'step2';

                    }
                    else {
                        layer.msg(obj.msg);
                    }
                },
                error:function(){
                    vm$root.isLoading = false;
                    layer.msg('您的网络连接不太顺畅哦！');
                }
            })
        }

    });


    //加载bill信息
    function loadBill(code) {
        
        vm$root.isLoading = true;

        //当店铺id与订单不符时的跳转。
        var sid = code.substr(0,code.length-13);
        if(sid!=g$id){
            location.href = location.origin + location.pathname + '?storeId=' + sid + '#!/comment/?code=' + code;
        }

        $.jsonp({
            url: g$baseUrl + "/Bill/info/?_method=GET",
            data: {
                billId: code,
                wxopenId: g$openId
            },
            callbackParameter: "callback",
            success: function (obj) {
                vm$root.isLoading = false;
                obj = $.parseJSON(obj);
                console.dir(obj);

                if (obj.code == 0) {

                    //判定订单是否任需支付
                    if (obj.data.status < 25) {
                        layer.msg('订单尚未支付');
                        location.hash = "#!/bill/?code=" + code;
                    }
                    else if(obj.data.isComment==true){
                        layer.msg('订单已评价');
                        vm.step = 'step2';
                    }

                    vm.billId = code;
                }
                else {
                    layer.msg(obj.msg);
                    to404(obj.msg,obj.code);
                }
            },
            error:function(){
                vm$root.isLoading = false;
                layer.msg('您的网络状况不太好哦');
            }
        })
    }

    //初始化
    function init(router) {

        var code = router.params.id?router.params.id:router.query.code;

        if (vm$root.checkPage('comment')) {

            vm.nickname = setVar(g$storeInfo.userInfo.nickname, 'string');
            vm.avatar = setVar(g$storeInfo.userInfo.avatar, 'string', './imgs/def_avatar.jpg');

            vm.step = 'step1';
            loadBill(code);

            avalon.scan(document.body);
        }
        window.scrollTo(0, 0);
        vm$root.isLoading = false;
    }
    
    return{init:init};

});