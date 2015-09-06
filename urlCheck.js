g$params = {

    //获取页面上的参数
    get:function(args) {
        var str = '';
        args = args.split("&");

        for (var i = 0; i < args.length; i++) {
            str = args[i];
            var arg = str.split("=");
            if (arg.length <= 0) continue;
            if (arg.length == 1) g$params[arg[0]] = true;
            else g$params[arg[0]] = arg[1];
        }
    },

    //拼接为字符串
    toStr:function(){
        var str = '';

        for(var i in g$params){
            if(g$params[i]!==null&&i.length>0&&typeof(g$params[i])!='function'){
                if(str.length>0){
                    str += '&';
                }
                str += i +'=' + g$params[i];
            }
        }

        return str;
    },

    //置空,参数是保留列表
    clear:function(args){
        var arr = args.join('#');

        for(var i in g$params){
            if(g$params[i]!==null&&i.length>0&&typeof(g$params[i])!='function'&&arr.match(i)==null){
                g$params[i]=null;
            }
        }
    }
};

g$id = '';
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

//g$baseUrl = 'http://192.168.2.13/WenShen/V2.0.0';  //本地测试
g$baseUrl = 'http://123.57.42.13/WenShen/V2.0.0';     //外网测试
//g$baseUrl = 'http://api.meizhanggui.cc/WenShen/V2.0.0';      //正式服务器

(function () {

    //是否微信判断
    g$isWX = navigator.userAgent.match(/MicroMessenger/i) != null;

    //URL编码解码算法
    var enCodeUni = function (str) {
        return str.replace(/#/g, '*0').replace(/!/g, '*1').replace(/\?/g, '*2').replace(/=/g, '*3').replace(/&/g, '*4').replace(/\//g, '*5');
    };
    var deCodeUni = function (nstr) {
        return nstr.replace(/\*0/g, '#').replace(/\*1/g, '!').replace(/\*2/g, '?').replace(/\*3/g, '=').replace(/\*4/g, '&').replace(/\*5/g, '/');
    };

    t$.alert(location.href);
    //微信中获取code
    if (location.hash.match(/invite/i)||location.hash.match(/bill/i)||location.href.match(/\*5invite\*5/i)||location.href.match(/\*5bill\*5/i)) {
    //if(false){
        g$params.get(window.location.search.substring(1));

        if (typeof(g$params.state) == 'undefined' && typeof(g$params.code) == 'undefined') {
            //1st
            var appId = 'wx744789961108d6b7';
            var REURI = encodeURI(location.origin + location.pathname);
            var state = enCodeUni('?' + g$params.toStr() + location.hash);
            location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?'
                + 'appid=' + appId + '&redirect_uri=' + REURI + '&response_type=code&scope=snsapi_base&state=' + state + '#wechat_redirect';
        }
        else if (g$params.state&&g$params.code) {
            //2nd
            var newurl = deCodeUni(g$params.state).split('#');
            g$params.get(newurl[0].substring(1) + '&code=' + g$params.code);
            g$params.clear(['storeId', 'code']);
            g$params.showwxpaytitle = 1;
            //history.pushState(null, document.title, location.origin + location.pathname + '?' + g$params.toStr() + '#' + newurl[1]);
            location.href = location.origin + location.pathname + '?' + g$params.toStr() + '#' + newurl[1];
        }
        else if (g$params.showwxpaytitle == 1){
            //啥都不干
        }
    }
    else {
        g$params.get(window.location.search.substring(1));
        g$params.clear(['storeId']);
        history.pushState(null, document.title, location.origin + location.pathname + '?' + g$params.toStr() + location.hash);
    }

})(window);