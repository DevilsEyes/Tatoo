define([
    'Wookman'
], function () {

    //定义vm
    var vm = avalon.define({
        $id:'address',
        name:'',
        address:'',
        time:''
    });

    //初始化
    function init(){

        if(vm$root.checkPage('address')){

            if (g$storeInfo.userInfo.company!=null&&g$storeInfo.userInfo.company!=0) {
                vm.name = setVar(g$storeInfo.userInfo.company.name, 'string');
                vm.address = setVar(g$storeInfo.userInfo.company.address, 'string');
                vm.time = setVar(g$storeInfo.openTime, 'string');
                avalon.scan(document.body);
            }
            else{
                location.hash = '#!/card';
                return;
            }
        }
        vm$root.isLoading = false;
    }

    return {init:init};

});