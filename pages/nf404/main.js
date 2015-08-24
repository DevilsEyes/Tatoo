define(function () {

    //定义vm_address
    window.vm$nf404 = avalon.define({
        $id:'nf404',
        msg:'',
        code:''
    });

    //初始化
    function init(router){

        var code = router.query.code;
        var vm = vm$nf404;

        if(vm$root.checkPage('nf404')){
            vm.code = code;
            if(vm.msg == ''){
                location.hash = '#!/card/';
            }
        }
        vm$root.isLoading = false;
    }

    return {init:init};

});