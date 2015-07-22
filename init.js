g$params = {};
g$id = '';
g$isMobile = false;
g$isWX = false;
g$code = '';


//g$baseUrl = 'http://192.168.2.3/V1.0.0';  //本地测试
//g$baseUrl = 'http://123.57.42.13/V1.0.0/';     //外网测试
g$baseUrl = 'http://api.mzg.so/V1.0.0';      //正式服务器



(function () {

    //获取页面上的参数
    var args = window.location.search.substring(1);
    var str='';
    args = args.split("&");

    for (var i = 0; i < args.length; i++) {
        str = args[i];
        var arg = str.split("=");
        if (arg.length <= 0) continue;
        if (arg.length == 1) g$params[arg[0]] = true;
        else g$params[arg[0]] = arg[1];
    }

    g$id = g$params.storeId;

    //是否移动端判断
    g$isMobile = navigator.userAgent.match(/mobile/i) != null;

    //移动端显示设置
        if(g$isMobile){
            var m = document.createElement("META");
            m.setAttribute("name","viewport");
            m.setAttribute("content","width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no");
            document.head.appendChild(m);
        }

    //是否微信判断
        g$isWX = false;

        function onBridgeReady() {
            g$isWX = true;
        }
        if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
            }
        } else {
            onBridgeReady();
        }

    //URL编码解码算法
    var enCodeUni = function(str){
        var nstr =[];
        for(var i=0;i<str.length;i++){
            nstr.push(str.charCodeAt(i));
        }
        return nstr.join('o');
    };

    var deCodeUni = function(nstr){
        var ar = nstr.split('o');
        var str = '';
        for(var i=0;i<ar.length;i++){
            str += String.fromCharCode(ar[i]);
        }
        return str;
    };

    //微信中获取code
    if(g$isWX){   //if(isWX||location.href.match(/page_invite/i)){

        if (typeof(g$params.state)=='undefined'&&typeof(g$params.code)=='undefined'){
            //1st
            var appId = 'wx57c7040dfd0ba925';
            var REURI = encodeURI(location.origin + location.pathname);
            var state = enCodeUni( location.search + location.hash );
            location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?'
                + 'appid=' + appId + '&redirect_uri=' + REURI + '&response_type=code&scope=snsapi_base&state='+ state +'#wechat_redirect';
        }
        else if (g$params.code&&typeof(g$params.state)=='undefined') {
            //3rd
            g$code = g$params.code;
        }
        else if (g$params.state){
            //2nd
            var newurl = deCodeUni(g$params.state).split('#');
            location.href = location.origin + location.pathname + newurl[0] + '&code=' + g$params.code + '#' + newurl[1];
        }
    }

})(window);