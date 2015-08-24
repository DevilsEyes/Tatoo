define(["mmRouter",
    "jQjsonp",
    "Layer",
    'icheck',
    "css!./appoint.css"
], function () {
    avalon.router.get("/appoint/", init);

    var vm_appoint = avalon.define({
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

        vec: '',
        vec$rem: 0,
        vec$get: function () {
            var vm = vm_appoint;
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
            var vm = vm_appoint;
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
                    storeId:g$id,
                    remark:vm.remark,
                    orderTime:Date.parse(new Date(vm.date + ' ' + vm.time)),
                    servicePlace:10,
                    orderAddress: vm.serv?null:vm.orderAddress,
                    orderFrom:g$isWX?21:22,
                    customerInfo:{
                        phonenum: vm.phonenum,
                        name:vm.name
                    },
                    captcha:vm.vec
                },
                callbackParameter: "callback",
                success: function (obj) {
                    obj = $.parseJSON(obj);
                    vm$root.isLoading = false;
                    if(obj.code==0){
                        layer.msg('预约成功！');
                        location.hash = '#!/home/';
                    }
                    else{
                        layer.msg(obj.msg);
                    }
                },
                error:function(){
                    vm$root.isLoading = false;
                    layer.msg('您的网络状况不太好哦！');
                }
            })
        }

    });

    //初始化时间选择控件
    var initTime = function () {
        var GetDateStr = function (AddDayCount) {
            var dd = new Date();
            dd.setDate(dd.getDate() + AddDayCount);
            var y = dd.getFullYear();
            var m = dd.getMonth() + 1; //获取当前月份的日期
            var d = dd.getDate();
            return y + "年" + m + "月" + d + "日";
        };
        var addDateOption = function () {
            $('#page_appoint #date').html();
            for (var i = 0; i <= 10; i++) {
                var d = '';
                if (i == 0) {
                    d = '（今天）';
                }
                var option = '<option value=' + GetDateStr(i).replace('年', "/").replace("月", "/").replace("日", "") + '>' + GetDateStr(i) + d + '</option>';
                $('#page_appoint #date').append(option);
            }
        };
        addDateOption();

        var addTimeOption = function () {
            $('#page_appoint #time').html();
            for (var i = 0; i <= 14; i++) {
                var t1 = (8 + i) + ':00',
                    t2 = (8 + i) + ':30';

                var op1 = '<option  date-h="' + (8 + i) + '">' + t1 + '</option>',
                    op2 = '<option  date-h="' + (8 + i) + '">' + t2 + '</option>';
                $('#page_appoint #time').append(op1);
                if (i != 14) {
                    $('#page_appoint #time').append(op2);
                }

            }
        };
        addTimeOption();
        // 期望时间,若是当天 则要判断时间前后
        $('#page_appoint #date').change(function () {
            addTimeOption();
            var v = $(this).val();
            // 当天
            if (v == 1) {
                checkTime();
            }
        });

        var checkTime = function () {
            var dd = new Date();
            var h = dd.getHours();

            var m = dd.getMinutes();
            $('#apTime option').each(function () {
                var date_h = $(this).attr('date-h');
                if (h > date_h) {
                    $(this).remove();
                } else if (h == date_h) {
                    var _m = $(this).html().split(':')[1];
                    if (parseInt(_m) < m) {
                        $(this).remove();
                    }

                }
            });
        };

    };


    //初始化
    function init() {

        if (vm$root.checkPage('appoint')) {

            vm_appoint.nickname = setVar(g$storeInfo.userInfo.nickname, 'string');
            vm_appoint.avatar = setVar(g$storeInfo.userInfo.avatar, 'string', './imgs/def_avatar.jpg');
            vm_appoint.faith = setVar(g$storeInfo.userInfo.faith, 'string').replace(/ /g,'&nbsp;').replace(/</g,'&lt').replace(/>/g,'&gt').replace(/\n/g,'<br/>');

            if (g$storeInfo.userInfo.company != null && g$storeInfo.userInfo.company != 0) {
                vm_appoint.address = setVar(g$storeInfo.userInfo.company.address, 'string');
            }

            setTimeout(function () {
                initTime();
            }, 100);

            avalon.scan(document.body);

        }
        window.scrollTo(0, 0);
        vm$root.isLoading = false;

        $(document).attr("title",'预约' + setVar(g$storeInfo.userInfo.nickname, 'string') + '的纹身');
        //g$WX.set({
        //    title:setVar(g$storeInfo.userInfo.nickname, 'string') + '的微名片',
        //    imgUrl:setVar(g$storeInfo.userInfo.avatar, 'string', './imgs/def_avatar.jpg'),
        //    desc:'预约' + setVar(g$storeInfo.userInfo.nickname, 'string') + '的纹身'
        //});
    }

});