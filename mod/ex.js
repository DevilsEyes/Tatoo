define(function(){

    window.setVar = function(p,type,value){
        var s = false;
        var v = false;
        if(typeof(type)!='undefined'){
            s = true;
        }
        if(typeof(value)!='undefined'){
            v = true;
        }
        if(typeof(p)!='undefined'||p==null){
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

    //打印3层以内的Object
    window.$print = function(obj){
        var str='';
        for (var i in obj) {
            str += '&nbsp' + i + ': ' + obj[i] + '<br/>';

            if (typeof obj[i] == 'object') {
                for (var j in obj[i]) {
                    str += '&nbsp└─&nbsp' + j + ': ' + obj[i][j] + '<br/>';

                    if (typeof obj[i][j] == 'object') {
                        for (var k in obj[i][j]) {
                            str += '&nbsp&nbsp&nbsp└─&nbsp' + k + ': ' + obj[i][j][k] + '<br/>';
                        }
                    }
                }
            }
        }

        return str;
    };

    //打印3层以内的Object,给alert用！
    window.al$print = function(obj){
        var str='';
        for (var i in obj) {
            str += '  ' + i + ': ' + obj[i] + '; ';

            if (typeof obj[i] == 'object') {

                str += '{';
                for (var j in obj[i]) {
                    str += '  ' + j + ': ' + obj[i][j] + '; ';

                    if (typeof obj[i][j] == 'object') {
                        str += '{';
                        for (var k in obj[i][j]) {
                            str += '  ' + k + ': ' + obj[i][j][k] + '; ';
                        }
                        str += '}';
                    }
                }
                str += '}';
            }
        }

        return str;
    }
});