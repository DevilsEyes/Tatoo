define(["mmRouter",
    "jQjsonp",
    "Layer",
    'icheck',
    "css!./bill.css"
], function () {
    avalon.router.get("/bill/", init);

    var vm_bill = avalon.define({
        $id: 'bill',
        billId: '',
        step: '',

        nickname: '',
        avatar: '',

        amount: 0,

        phonenum: '',
        ph$have: false,
        ph$old: '',
        ph$change: function () {
            var vm = vm_bill;

            vm.ph$have = false;
            vm.phonenum = '';
            $('#page_bill #i-phonenum').prop('value', '');

            avalon.scan(document.body);

        },

        vec: '',
        vec$rem: 0,
        vec$get: function () {
            var vm = vm_bill;
            if (vm.phonenum.length != 11 || vm.vec$rem > 0) {//||vm.vec$sended){
                return;
            }
            vm$root.isLoading = true;
            $.jsonp({
                url: g$baseUrl + '/Bill/verifyPhone/?_method=GET',
                data: {
                    phonenum: vm.phonenum
                },
                callbackParameter: "callback",
                success: function (obj) {
                    vm$root.isLoading = false;
                    obj = $.parseJSON(obj);

                    if (obj.code == 0) {
                        vm.vec$sended = true;
                        vm.ph$old = vm.phonenum;
                        layer.msg('验证码已发送');
                        vm.vec$rem = 60;
                        window.time$vec = setInterval(function () {
                            if (vm.vec$rem > 0) {
                                vm.vec$rem = vm.vec$rem - 1;
                            } else if (vm.vec$rem <= 0) {
                                vm.vec$rem = 0;
                                clearInterval(time$vec);
                            }
                        }, 1000)
                    } else {
                        layer.msg(obj.msg);
                    }
                },
                error: function () {
                    vm$root.isLoading = false;
                    layer.msg('您的网络状况不太好哦~');
                }
            });
        },

        channal: '',

        obj: '',

        tab: function ($event, str) {
            var vm = vm_bill;
            switch (str) {
                case 'step1':
                    (function () {
                        vm.step = str;
                    })();
                    break;
                case 'step2':
                    (function () {
                        if (vm.phonenum.length < 11) {
                            layer.msg('请填写手机号');
                        }
                        else if (!vm.ph$have && vm.vec.length < 6) {
                            layer.msg('请填写验证码');
                        }
                        else {
                            vm.step = str;
                        }
                    })();
                    break;
            }
        },

        putBill: function ($event) {
            var vm = vm_bill;

            vm$root.isLoading = true;
            $.jsonp({
                url: g$baseUrl + '/Bill/info/?_method=POST',
                data: {
                    billId: vm.billId,
                    phonenum: vm.phonenum,
                    captcha: vm.vec.length > 0 ? vm.vec : null,
                    channel: 'wx_pub',
                    extra: {
                        open_id: g$openId
                    }
                },
                callbackParameter: "callback",
                success: function (obj) {
                    obj = $.parseJSON(obj);

                    console.log('获取Charge');
                    console.dir(obj);

                    if (obj.code == 0) {
                        window.pay$charge = obj.data.charge;
                        vm.payBill();
                    }
                    else {
                        vm$root.isLoading = false;
                        layer.msg(obj.msg);
                    }

                },
                error: function () {
                    vm$root.isLoading = false;
                    layer.msg('您的网络状况不太好哦');
                }
            })
        },

        payBill: function ($event) {

            var vm = vm_bill;
            var charge = pay$charge;
            vm$root.isLoading = false;

            pingpp.createPayment(charge, function (result, error) {
                if (result == "success") {
                    setTimeout(function () {
                        layer.msg("支付成功");
                        location.hash = '#!/comment/?code=' + vm.billId;
                        vm$root.isLoading = false;
                    }, 2000);

                } else if (result == "fail") {
                    vm$root.isLoading = false;
                    layer.msg("支付失败");
                    //alert(error.extra + '请截图联系客服');
                    vm.step = 'stepfail';

                } else if (result == "cancel") {
                    vm$root.isLoading = false;
                    layer.msg("支付被取消");
                    vm.step = 'stepfail';
                    $('#page_bill #stepfail h1').text('支付被取消了，请尝试重新支付')

                }
            });
        }
    });

    vm_bill.$watch('phonenum', function (v) {
        vm_bill.vec$sended = (v == vm_bill.ph$old);
    });

    //初始化CheckBox
    function checkBoxInit() {
        $('.icheck').ready(function () {
            $('.icheck').iCheck({
                checkboxClass: 'icheckbox_square-red',
                radioClass: 'iradio_square-red',
                increaseArea: '20%' // optional
            });
            $('.icheck#channal_wx_pub').iCheck('check');
        });
    }

    //加载bill信息
    function loadBill(code) {

        var vm = vm_bill;

        //当店铺id与订单不符时的跳转。
        var sid = code.substr(0, code.length - 13);
        if (sid != g$id) {
            location.href = location.origin + location.pathname + '?storeId=' + sid + '#!/bill/?code=' + code;
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

                vm.obj = $print(obj);
                avalon.scan(document.body);

                if (obj.code == 0) {

                    //判定订单是否需要支付，是否已经评价
                    if (obj.data.isComment == true) {
                        location.hash = "#!/comment/?code=" + code;
                    }
                    else if (obj.data.status > 25) {
                        layer.msg('订单已经完成啦！');
                        location.hash = "#!/comment/?code=" + code;
                    }

                    vm.billId = obj.data._id;
                    vm.amount = obj.data.amount;
                    vm.phonenum = setVar(obj.data.phonenum);
                    if (vm.phonenum.length == 11) {
                        vm.ph$old = vm.phonenum;
                        vm.ph$have = true;
                    }
                    else {
                        vm.phonenum = '';
                    }

                    g$WX.set({
                        title:setVar(g$storeInfo.userInfo.nickname, 'string') + '向您发起收款',
                        imgUrl:setVar(g$storeInfo.userInfo.avatar, 'string', './imgs/def_avatar.jpg'),
                        desc:setVar(g$storeInfo.userInfo.nickname, 'string') + '正在向您收取纹身相关服务费' + obj.data.amount + '元'
                    });
                }
                else {
                    layer.msg(obj.msg);
                    to404(obj.msg, obj.code);
                }
            },
            error: function () {
                vm$root.isLoading = false;
                layer.msg('您的网络状况不太好哦');
            }
        })
    }

    //初始化
    function init() {

        var vm = vm_bill;
        var code = this.query.code;

        if (vm$root.checkPage('bill')) {

            vm.nickname = setVar(g$storeInfo.userInfo.nickname, 'string');
            vm.avatar = setVar(g$storeInfo.userInfo.avatar, 'string', './imgs/def_avatar.jpg');

            vm.step = 'step1';

            avalon.scan(document.body);
            checkBoxInit();
        }
        loadBill(code);
        $(document).attr("title", "纹身大咖 - 收款");
        window.scrollTo(0, 0);

    }

});