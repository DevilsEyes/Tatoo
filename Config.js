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