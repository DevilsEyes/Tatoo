define(function(){

    //赋值用
    window.setVar = function(p,type,value){
        var s = false;
        var v = false;
        if(typeof(type)!='undefined'){
            s = true;
        }
        if(typeof(value)!='undefined'){
            v = true;
        }
        if(typeof(p)!='undefined'&&p!=null){
            if(p!=0){
                if(s){
                    switch (type){
                        case 'string':
                            return p+'';
                        case 'int':
                            return parseInt(p);
                        case 'bool':
                            return p;
                        case 'array':
                            return p;
                        case 'object':
                            return p;
                        default:
                            return p;
                    }
                }
                else{
                    return p;
                }
            }
            else{
                return fev();
            }
        }
        else{
            return fev();
        }

        function fev(){
            if(v){
                return value;
            }
            if(s){
                switch (type){
                    case 'string':
                        return '';
                    case 'int':
                        return 0;
                    case 'bool':
                        return false;
                    case 'array':
                        return [];
                    case 'object':
                        return {};
                    default:
                        return '';
                }
            }
            return '';
        }
    };

    //avalon过滤器
    avalon.filters.f$null =  function(str) {
        if(str!=0){
            return str;
        }
        else{
            return '无';
        }
    };

    avalon.filters.f$current =  function(str) {
        return '￥ '+str+'.00';
    };

    avalon.filters.f$rank =  function(str) {
        if(str=='0'){
            return '千里之外';
        }
        else{
            return str;
        }
    };

    //图片加载错误 事件绑定在html中
    window.imgError = function(obj,type){
        switch (type){
            case 'banner':
                avalon.vmodels.home.banner = './imgs/def_banner.jpg';
                break;
            case 'avatar':
                avalon.vmodels.home.avatar = './imgs/def_avatar.jpg';
                break;
        }
    };
});