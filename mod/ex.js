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
        if(typeof(p)!='undefined'){
            if(p!=0){
                if(s){
                    switch (type){
                        case 'string':
                            return p+'';
                        case 'int':
                            return parseInt(p);
                        case 'array':
                            return p;
                        case 'object':
                            return p;
                        default:
                            return p;
                    }
                }
                else{
                    console.log('p:'+p);
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
    }
});