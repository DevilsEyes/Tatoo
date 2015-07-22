define(["mmRouter",
    "jQjsonp",
    "Layer",
    "css!./home.css"
],function(){
    avalon.router.get("/home",init);

    function init(){
        vm$root.url='pages/home/home.html';
        vm$root.isLoading = false;
    }

});