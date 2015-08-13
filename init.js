g$params = {

    //获取页面上的参数
    get:function() {
        var args = window.location.search.substring(1);
        var str = '';
        args = args.split("&");

        for (var i = 0; i < args.length; i++) {
            str = args[i];
            var arg = str.split("=");
            if (arg.length <= 0) continue;
            if (arg.length == 1) g$params[arg[0]] = true;
            else g$params[arg[0]] = arg[1];
        }
        g$id = g$params.storeId;
    },

    //拼接为字符串
    toStr:function(){
        var str = '';

        for(var i in g$params){
            if(g$params[i]!==null&&i>0&&typeof(g$params[i])!='function'){
                if(str.length>0){
                    str += '&';
                }
                str += i +'=' + g$params[i];
            }
        }

        return str;
    }
};

g$id = '';
g$isMobile = false;
g$isWX = false;
g$code = '';
g$openId = '';
g$storeInfo = {};
vm$root = {};
check = {
    timer:null,
    openId:false,
    storeInfo:false,
    wx:false
};

//g$baseUrl = 'http://192.168.2.13/WenShen/V1.0.0';  //本地测试
//g$baseUrl = 'http://123.57.42.13/WenShen/V1.0.0';     //外网测试
g$baseUrl = 'http://api.meizhanggui.cc/WenShen/V1.0.0';      //正式服务器


(function () {

    //是否移动端判断
    g$isMobile = navigator.userAgent.match(/mobile/i) != null;

    //移动端显示设置
    if (g$isMobile) {
        var m = document.createElement("META");
        m.setAttribute("name", "viewport");
        m.setAttribute("content", "width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no");
        document.head.appendChild(m);
    }

    //是否微信判断
    g$isWX = navigator.userAgent.match(/MicroMessenger/i) != null;

    //URL编码解码算法
    var enCodeUni = function (str) {
        return str.replace(/#/g, '*0').replace(/!/g, '*1').replace(/\?/g, '*2').replace(/=/g, '*3').replace(/&/g, '*4').replace(/\//g, '*5');
    };
    var deCodeUni = function (nstr) {
        return nstr.replace(/\*0/g, '#').replace(/\*1/g, '!').replace(/\*2/g, '?').replace(/\*3/g, '=').replace(/\*4/g, '&').replace(/\*5/g, '/');
    };


    //微信中获取code
    if (g$isWX||location.hash.match(/invite/i)||location.hash.match(/bill/i)) {
    //if(isWX||location.href.match(/page_invite/i)){

        g$params.get();
        if (typeof(g$params.state) == 'undefined' && typeof(g$params.code) == 'undefined') {
            //1st
            var appId = 'wx57c7040dfd0ba925';
            var REURI = encodeURI(location.origin + location.pathname);
            var state = enCodeUni(location.search + location.hash);
            location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?'
                + 'appid=' + appId + '&redirect_uri=' + REURI + '&response_type=code&scope=snsapi_base&state=' + state + '#wechat_redirect';
        }
        else if(typeof(g$params.state) == 'undefined' &&g$params.code){
            g$params.get();
        }
        else if (g$params.state&&g$params.code) {
            //2nd
            var newurl = deCodeUni(g$params.state).split('#');
            var newsrc = location.origin + location.pathname + newurl[0] + '&code=' + g$params.code + '#' + newurl[1];

            location.href = newsrc;
            //history.pushState(null, document.title, newsrc);
        }
    }
    else {
        g$params.get();
    }

})(window);