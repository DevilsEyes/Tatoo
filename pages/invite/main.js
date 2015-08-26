define([
    'icheck'
], function () {

    var vm = avalon.define({
        $id: 'invite',
        orderId: '',
        step: '',
        charge: {},
        channel: 'wx_pub',

        nickname: '',
        avatar: '',
        address: '',
        faith: '',

        phonenum: '',
        ph$old: 'nothing',//随便一个非数字字符串

        name: '',
        remark: '',
        deposit: 0,

        date: 0,
        time: 0,

        op$time: [],
        op$date: [],

        vec: '',
        vec$rem: 0,
        vec$get: function () {

            if (vm.phonenum.length != 11) {//||vm.vec$sended){
                return;
            }
            vm$root.isLoading = true;
            $.jsonp({
                url: g$baseUrl + '/Order/phonenumCaptcha/?_method=GET',
                data: {
                    phonenum: vm.phonenum
                },
                callbackParameter: "callback",
                success: function (obj) {
                    vm$root.isLoading = false;
                    obj = $.parseJSON(obj);

                    if (obj.code == 0) {
                        vm.vec$sended = true;
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

        tab: function ($event, str) {

            switch (str) {
                case 'step1':
                    (function () {
                        vm.step = str;
                    })();
                    break;
                case 'step2':
                    (function () {
                        if (vm.name.length < 1) {
                            layer.msg('请填写姓名');
                            return;
                        }
                        if (vm.phonenum.length != 11) {
                            layer.msg('请填写正确的手机号');
                            return;
                        }
                        if (!(vm.ph$old == vm.phonenum) && vm.vec.length != 6) {
                            layer.msg('请填写验证码');
                            return;
                        }
                        if (vm.date == 0) {
                            layer.msg('请选择预约日期');
                            return;
                        }
                        if (vm.time == 0) {
                            layer.msg('请选择预约时间');
                            return;
                        }
                        else {
                            vm.step = str;
                        }
                    })();
                    break;
            }
        },

        postOrder: function () {

            if (vm.name.length < 1) {
                layer.msg('请填写姓名');
                return;
            }
            if (vm.phonenum.length != 11) {
                layer.msg('请填写正确的手机号');
                return;
            }
            if (vm.vec.length != 6) {
                layer.msg('请填写验证码');
                return;
            }
            if (vm.date == 0) {
                layer.msg('请选择预约日期');
                return;
            }
            if (vm.time == 0) {
                layer.msg('请选择预约时间');
                return;
            }

            vm$root.isLoading = true;

            console.log({
                storeId: g$id,
                _id: vm.orderId,
                remark: vm.remark,
                orderTime: Date.parse(new Date(vm.date + ' ' + vm.time)),
                servicePlace: 10,
                orderFrom: g$isWX ? 21 : 22,
                customerInfo: {
                    phonenum: vm.phonenum,
                    name: vm.name
                },
                captcha: vm.ph$old == vm.phonenum ? null : vm.vec,
                pingChannel: vm.deposit > 0 ? vm.channel : null,
                pingExtra: vm.deposit > 0 || vm.channel == 'wx_pub' ?
                {
                    open_id: g$openId
                } : null
            });

            $.jsonp({
                url: g$baseUrl + '/Order/info/?_method=POST',
                data: {
                    storeId: g$id,
                    _id: vm.orderId,
                    remark: vm.remark,
                    orderTime: Date.parse(new Date(vm.date + ' ' + vm.time)),
                    servicePlace: 10,
                    orderFrom: g$isWX ? 21 : 22,
                    customerInfo: {
                        phonenum: vm.phonenum,
                        name: vm.name
                    },
                    captcha: vm.ph$old == vm.phonenum ? null : vm.vec,
                    pingChannel: vm.deposit > 0 ? vm.channel : null,
                    pingExtra: vm.deposit > 0 || vm.channel == 'wx_pub' ?
                    {
                        open_id: g$openId
                    } : null
                },
                callbackParameter: "callback",
                success: function (obj) {

                    obj = $.parseJSON(obj);
                    console.log(obj);
                    vm$root.isLoading = false;
                    if (obj.code == 0) {

                        if (vm.deposit > 0) {
                            window.pay$charge = obj.data.charge;
                            vm.payOrder();
                        } else {
                            layer.msg('预约成功！');
                            location.hash = '#!/card/';
                        }
                    }
                    else {
                        layer.msg(obj.msg);
                    }

                },
                error: function () {
                    vm$root.isLoading = false;
                    layer.msg('您的网络状况不太好哦！');
                }
            })
        },

        payOrder: function ($event) {

            var charge = pay$charge;
            vm$root.isLoading = false;

            pingpp.createPayment(charge, function (result, error) {
                if (result == "success") {
                    setTimeout(function () {
                        layer.msg("支付成功");
                        vm$root.isLoading = false;
                        vm.step = 'stepSuccess';
                    }, 2000);

                } else if (result == "fail") {
                    vm$root.isLoading = false;
                    layer.msg("支付失败");
                    vm.step = 'stepFail';

                } else if (result == "cancel") {
                    vm$root.isLoading = false;
                    layer.msg("支付被取消");
                    vm.step = 'stepFail';
                    $('#page_invite #stepFail h1').text('支付被取消了，请尝试重新支付');
                }
            });
        }
    });

    //加载invite信息
    function loadInvite(code) {

        //当店铺id与订单不符时的跳转。
        var sid = code.substr(0, code.length - 13);
        if (sid != g$id) {
            location.href = location.origin + location.pathname + '?storeId=' + sid + '#!/invite/?code=' + code;
        }

        $.jsonp({
            url: g$baseUrl + "/Order/info?_method=GET",
            data: {
                _id: code
            },
            callbackParameter: "callback",
            success: function (obj) {
                vm$root.isLoading = false;
                obj = $.parseJSON(obj);
                console.dir(obj);

                if (obj.code == 0) {

                    vm.orderId = code;
                    vm.deposit = setVar(obj.data.orderInfo.deposit, 'int');

                    //设置订单时间
                    if (obj.data.orderInfo.orderTime > 0) {
                        var d = new Date(obj.data.orderInfo.orderTime);
                        vm.date = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
                        vm.time = d.getHours() + ':' + d.getMinutes();
                    }

                    vm.remark = setVar(obj.data.orderInfo.remark, 'string');

                    ////判定订单是否需要支付，是否已经评价
                    //if (obj.data.isComment == true) {
                    //    location.hash = "#!/comment/?code=" + code;
                    //}
                    //else if (obj.data.status > 25) {
                    //    layer.msg('订单已经完成啦！');
                    //    location.hash = "#!/comment/?code=" + code;
                    //}

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

    //初始化时间选择控件
    var initTime = function () {
        vm.op$date = [];
        vm.op$time = [];
        var GetDateStr = function (AddDayCount) {
            var dd = new Date();
            dd.setDate(dd.getDate() + AddDayCount);
            var y = dd.getFullYear();
            var m = dd.getMonth() + 1; //获取当前月份的日期
            var d = dd.getDate();
            return y + "年" + m + "月" + d + "日";
        };
        for (var i = 0; i <= 10; i++) {
            var d = '';
            if (i == 0) {
                d = '（今天）';
            }
            vm.op$date.push({
                value: GetDateStr(i).replace('年', "/").replace("月", "/").replace("日", ""),
                str: GetDateStr(i) + d
            });
        }

        avalon.scan(document.getElementById('indate'));
    };

    //监视date变化
    vm.$watch("date", function (value) {
        vm.op$time = [];
        var dd = new Date();
        var checkTime = function (timeStr) {

            var h = dd.getHours(),
                m = dd.getMinutes(),
                _h = parseInt(timeStr.split(':')[0]),
                _m = parseInt(timeStr.split(':')[1]);
            return (h < _h || (h == _h && m > _m));
        };
        var isToday = (dd.getDate() == parseInt(vm.date.split('/')[2]));
        for (var i = 0; i <= 14; i++) {
            var t1 = (8 + i) + ':00',
                t2 = (8 + i) + ':30';

            checkTime(t1) || !isToday ? vm.op$time.push({value: t1, str: t1}) : null;
            checkTime(t2) || !isToday ? vm.op$time.push({value: t2, str: t2}) : null;
        }
        console.log(vm.op$time.length);
        avalon.scan(document.getElementById('intime'));
    });

    //初始化
    function init(router) {

        var code = router.params.id?router.params.id:router.query.code;

        if (vm$root.checkPage('invite')) {

            vm.nickname = setVar(g$storeInfo.userInfo.nickname, 'string');
            vm.avatar = setVar(g$storeInfo.userInfo.avatar, 'string', './imgs/def_avatar.jpg');
            vm.faith = setVar(g$storeInfo.userInfo.faith, 'string').replace(/ /g, '&nbsp;').replace(/</g, '&lt').replace(/>/g, '&gt').replace(/\n/g, '<br/>');

            if (g$storeInfo.userInfo.company != null && g$storeInfo.userInfo.company != 0) {
                vm.address = setVar(g$storeInfo.userInfo.company.address, 'string');
            }

            loadInvite(code);

            setTimeout(function () {
                checkBoxInit();
            }, 100);

            vm.step = 'step1';

            avalon.scan(document.body);
        }
        initTime();
        $(document).attr("title", "纹身大咖 - 邀约");
        window.scrollTo(0, 0);
        vm$root.isLoading = false;

        //g$WX.set({
        //    title:setVar(g$storeInfo.userInfo.nickname, 'string') + '向您发起了邀约',
        //    imgUrl:setVar(g$storeInfo.userInfo.avatar, 'string', './imgs/def_avatar.jpg'),
        //    desc:'亲，为了更好的为您服务，简单补充一下您的预约信息吧。',
        //    link:location.origin + location.pathname + '?storeId=' + g$id + '#!/invite/?code=' + code
        //});
    }

    return {init: init};

});