define(["mmRouter",
    "jQjsonp",
    "Layer",
    'Wookman',
    "css!./address.css"
], function () {

    avalon.router.get("/address/", init);

    //定义vm_address
    var vm_address = avalon.define({
        $id:'address',
        name:'',
        address:'',
        time:''
    });

    //初始化
    function init(){

        if(vm$root.checkPage('address')){

            if (g$storeInfo.userInfo.company!=null&&g$storeInfo.userInfo.company!=0) {
                vm_address.name = setVar(g$storeInfo.userInfo.company.name, 'string');
                vm_address.address = setVar(g$storeInfo.userInfo.company.address, 'string');
                vm_address.time = setVar(g$storeInfo.openTime, 'string');
                avalon.scan(document.body);
            }
            else{
                location.hash = '#!/home';
                return;
            }

        }
        vm$root.isLoading = false;
    }

});