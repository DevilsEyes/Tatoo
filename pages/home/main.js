define(["mmRouter",
    "jQjsonp",
    "Layer",
    'Wookman',
    "css!./home.css"
], function () {
    avalon.router.get("/home/", init);

    //点赞还没做！
    //访问量还没做！
    //排名是什么东东？
    //微信咨询
    //预约TA(新页面)

    var vm_home = avalon.define({
        $id: 'home',

        offSetY:0,

        nickname: '',
        avatar: '',
        banner: '',
        strSector: '',
        visitCount: '',
        wxNum: '',
        faith: '',
        address: '',

        faith$bool: false,
        faith$mH: 68,
        faith$toggle: function () {
            vm_home.faith$bool = !vm_home.faith$bool;
            if (vm_home.faith$bool) {
                $('#page_home .faith').height($('#page_home .faith>p').height());
                $('#page_home .faith + a').text('收起');
            } else {
                $('#page_home .faith').height(68);
                $('#page_home .faith + a').text('查看全文');
            }
        },

        productList: [],
        pro$msg:'正在加载更多...',
        pro$loading: false,
        pro$over: false

    });

    //加载作品
    function loadProduct() {

        var limit = 6;//一次加载6个

        $.jsonp({
            url: g$baseUrl + "/Product/list/?_method=GET",
            data: {
                storeId: g$storeInfo.storeId,
                latestIndex: vm_home.productList.length != 0 ? vm_home.productList.length : null,
                limit: limit,
                count: true

            },
            callbackParameter: "callback",
            success: function (obj) {
                obj = $.parseJSON(obj);
                if (obj.code == 0) {
                    vm_home.pro$loading = false;
                    vm_home.productList = vm_home.productList.concat(obj.data.list);
                    avalon.scan(document.body);
                    pbl.Set();
                }
                if (obj.data.count == vm_home.productList.length) {
                    vm_home.pro$over = true;
                    clearInterval(timerLoadMore);
                    if(obj.data.count==0){
                        vm_home.pro$msg = '掌柜的太忙了！还没有上传作品！';
                        vm_home.pro$loading = true;
                        $('#page_home .do').height($(window).height() - $('#page_home .up').height() -80 );
                        $('#page_home .do').css('background-color','#383431');
                    }
                }
            }
        })
    }

    //瀑布流
    var pbl = {
        Set:function () {
            $('#pbl li').wookmark({
                container: $('#pbl'),
                autoResize: true,
                offset: 10,
                outerOffset: 15,
                itemWidth: '48%',
                flexibleWidth: '48%',
                resizeDelay: 100
            });
            pbl.Refresh();
        },
        Refresh:function(){
            setTimeout(function(){
                $('#pbl').trigger('refreshWookmark');
            },100);
        }
    };

    //下拉继续加载
    var timerLoadMore = setInterval(function () {
        if (vm$root.nowPage == 'home' && vm_home.pro$over == false && vm_home.pro$loading == false) {
            var h = $(window).height();
            var y = window.pageYOffset;
            if (y > h - 300) {
                vm_home.pro$loading = true;
                loadProduct();
            }
        }
    }, 100);

    //记录拉动距离
    var timerHomeOSY = setInterval(function(){
        if(vm$root.nowPage == 'home'){
            vm_home.offSetY = window.pageYOffset;
        }
    },100);

    //初始化
    function init() {

        if(vm$root.checkPage('home')){

            vm_home.nickname = setVar(g$storeInfo.userInfo.nickname, 'string');
            vm_home.avatar = setVar(g$storeInfo.userInfo.avatar, 'string', './imgs/def_avatar.jpg');
            vm_home.banner = setVar(g$storeInfo.topBanner, 'string', './imgs/def_banner.jpg');
            vm_home.strSector = setVar(g$storeInfo.strSector, 'string');
            vm_home.visitCount = setVar(g$storeInfo.visitCount, 'int');
            vm_home.wxNum = setVar(g$storeInfo.userInfo.wxNum, 'string');
            vm_home.faith = setVar(g$storeInfo.userInfo.faith, 'string');

            if (g$storeInfo.userInfo.company!=null&&g$storeInfo.userInfo.company!=0) {
                vm_home.address = setVar(g$storeInfo.userInfo.company.address, 'string');
            }

            avalon.scan(document.body);

            //延迟调用，设置参数
            setTimeout(function () {
                var h = $('#page_home .faith>p').height();
                if (h < 68) {
                    $('#page_home .faith').height(h);
                }
                avalon.vmodels.home.faith$mH = h;

                loadProduct();
            },100);

        }
        pbl.Refresh();
        window.scrollTo(0,vm_home.offSetY);
        vm$root.isLoading = false;
    }

});