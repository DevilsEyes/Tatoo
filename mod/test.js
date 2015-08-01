define(function(){

    window.test = {
        getOpenid:function(){
            $.jsonp({
                url: g$baseUrl + "/Weixin/Public/accessToken",
                callbackParameter: "callback",
                data: {
                    code: '001fd267e9d119f2c7074525f6d8dcdo'
                },
                success: function (obj) {
                    obj = $.parseJSON(obj);
                    if (obj.code == 0) {
                        window.g$openId = obj.data.openid;
                    }
                },
                error:function(){
                    alert('Error!');
                }
            });
        },
        postBill:function(){
            $.jsonp({
                url: g$baseUrl + '/Bill/verifyPhone/?_method=GET',
                data: {
                    phonenum: '12345111111'
                },
                callbackParameter: "callback",
                success: function (obj) {
                    obj = $.parseJSON(obj);

                    console.log('获取验证码');
                    console.dir(obj);


                    $.jsonp({
                        url: g$baseUrl + '/Bill/info/?_method=POST',
                        data: {
                            billId: '10017645bfbACRI0icK',
                            phonenum: '12345111111',
                            captcha: '111111',
                            channel: 'wx_pub',
                            extra: {
                                open_id: 'oNyPMs7crBm9X-llnNzAWJeSiUjM'
                            }
                        },
                        callbackParameter: "callback",
                        success:function(obj){
                            obj = $.parseJSON(obj);

                            console.log('获取Charge');
                            console.dir(obj);

                        }
                    })
                }
            });
        }
    };


});