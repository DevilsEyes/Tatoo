define([
    'icheck'
], function () {

    var vm = avalon.define({
        $id: 'appoint',

        nickname: '',
        avatar: '',
        address: '',
        faith: '',

        name: '',
        phonenum: '',
        remark: '',

        date: 0,
        time: 0,

        op$time: [],
        op$date: [],

        vec: '',
        vec$rem: 0,
        vec$get: function () {

            if (vm.phonenum.length != 11) {//||vm_bill.vec$sended){
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
            $.jsonp({
                url: g$baseUrl + '/Order/info/?_method=PUT',
                data: {
                    storeId: g$id,
                    remark: vm.remark,
                    orderTime: Date.parse(new Date(vm.date + ' ' + vm.time)),
                    servicePlace: 10,
                    orderAddress: vm.serv ? null : vm.orderAddress,
                    orderFrom: g$isWX ? 21 : 22,
                    customerInfo: {
                        phonenum: vm.phonenum,
                        name: vm.name
                    },
                    captcha: vm.vec
                },
                callbackParameter: "callback",
                success: function (obj) {
                    obj = $.parseJSON(obj);
                    vm$root.isLoading = false;
                    if (obj.code == 0) {
                        layer.msg('预约成功！');
                        location.hash = '#!/card/';
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
        }

    });

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

        avalon.scan(document.getElementById('apdate'));
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
        avalon.scan(document.getElementById('aptime'));
    });


    //初始化
    function init() {

        if (vm$root.checkPage('appoint')) {

            vm.nickname = setVar(g$storeInfo.userInfo.nickname, 'string');
            vm.avatar = setVar(g$storeInfo.userInfo.avatar, 'string', './imgs/def_avatar.jpg');
            vm.faith = setVar(g$storeInfo.userInfo.faith, 'string').replace(/ /g, '&nbsp;').replace(/</g, '&lt').replace(/>/g, '&gt').replace(/\n/g, '<br/>');

            if (g$storeInfo.userInfo.company != null && g$storeInfo.userInfo.company != 0) {
                vm.address = setVar(g$storeInfo.userInfo.company.address, 'string');
            }

            avalon.scan(document.body);

        }
        window.scrollTo(0, 0);
        vm$root.isLoading = false;
        initTime();

        $(document).attr("title", '预约' + setVar(g$storeInfo.userInfo.nickname, 'string') + '的纹身');
    }

    return {init: init};

});