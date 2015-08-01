define(["mmRouter",
    "jQjsonp",
    "Layer",
    "css!./nf404.css"
], function () {

    avalon.router.get("/nf404/", init);

    //定义vm_address
    window.vm$nf404 = avalon.define({
        $id:'nf404',
        msg:'',
        code:''
    });

    //初始化
    function init(){

        var code = this.query.code;
        var vm = vm$nf404;

        if(vm$root.checkPage('nf404')){
            vm.code = code;
            if(vm.msg == ''){
                location.hash = '#!/home/';
            }
        }
        vm$root.isLoading = false;
    }

});