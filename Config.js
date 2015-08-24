//window.t$ = {
//    alert:function(){},
//    log:function(){},
//    dir:function(){}
//};

window.t$ = {
    alert:function(str){
        alert(str);
    },
    log:function(str){
        console.log(str);
    },
    dir:function(obj){
        console.dir(obj);
    }
};

//测试用指令
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

        if(typeof obj[i] == 'function'){
            str += '  ' + i + ':isFunction;';
        }
        else{
            str += '  ' + i + ': ' + obj[i] + '; ';
        }

        if (typeof obj[i] == 'object') {

            str += '{';
            for (var j in obj[i]) {

                if(typeof obj[i][j] == 'function'){
                    str += '  ' + j + ':isFunction;';
                }
                else{
                    str += '  ' + j + ': ' + obj[i][j] + '; ';
                }

                if (typeof obj[i][j] == 'object') {
                    str += '{';

                    for (var k in obj[i][j]) {
                        if(typeof obj[i][j][k] == 'function'){
                            str += '  ' + k + ':isFunction;';
                        }
                        else{
                            str += '  ' + k + ': ' + obj[i][j][k] + '; ';
                        }
                    }
                    str += '}';
                }
            }
            str += '}';
        }
    }

    return str;
};