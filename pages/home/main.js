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

        offSetY: 0,

        nickname: '',
        avatar: '',
        banner: '',
        strSector: '',
        visitCount: '',
        wxNum: '',
        address: '',
        rank: 0,

        likeCount: 1000,
        like$bool: false,
        like$click: function () {
            var vm = vm_home;
            if (vm.like$bool) {
                return;
            }
            else {
                vm.like$bool = true;
                $.jsonp({
                    url: g$baseUrl + '/Store/like/?_method=PUT',
                    data: {
                        storeId: g$id
                    },
                    callbackParameter: "callback",
                    success: function (obj) {
                        obj = $.parseJSON(obj);
                        if (obj.code == 0) {
                            vm.likeCount++;
                            $('#page_home #addOne').show();
                            setTimeout(function () {
                                $('#page_home #addOne').css({
                                    top: '70px',
                                    opacity: '0',
                                    color: '#322f2c'
                                })
                            }, 0);
                        }
                        else {
                            layer.msg(obj.msg)
                        }
                    },
                    error: function () {
                        layer.msg('您的网络连接不太顺畅哦！');
                    }
                });


            }

        },

        faith: '',
        faith$bool: false,
        faith$mH: 50,
        faith$toggle: function () {
            vm_home.faith$bool = !vm_home.faith$bool;
            if (vm_home.faith$bool) {
                $('#page_home .faith').height($('#page_home .faith>p').height());
                $('#page_home .faith + a').text('收起');
            } else {
                $('#page_home .faith').height(50);
                $('#page_home .faith + a').text('查看全文');
            }
        },

        productList: [],
        pro$msg: '正在加载更多...',
        pro$loading: false,
        pro$over: false,

        wx$zx: function () {
            layer.open({
                skin: 'tatoo',
                title: '店主微信号',
                content: '<h2>' + g$storeInfo.userInfo.wxNum + '</h2><p>长按上面文字复制</p>',
                shade: 0.3,
                shadeClose: true,
                closeBtn: false,
                btn: []
            });
        }

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
                    if (obj.data.count == 0) {
                        vm_home.pro$msg = '掌柜的太忙了！还没有上传作品！';
                        vm_home.pro$loading = true;
                        $('#page_home .do').css('background-color', '#383431');
                    }
                }
            }
        })
    }

    //瀑布流
    var pbl = {
        Set: function () {
            $('#pbl li').wookmark({
                container: $('#pbl'),
                offset: 10,
                outerOffset: 15,
                itemWidth: '48%',
                flexibleWidth: '48%',
                resizeDelay: 100,
                autoResize: true
            });
            $('#pbl img').load(function () {
                pbl.Refresh();
            });
        },
        Refresh: function () {
            setTimeout(function () {
                $('#pbl').trigger('refreshWookmark');
            }, 10);
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
    var timerHomeOSY = setInterval(function () {
        if (vm$root.nowPage == 'home') {
            vm_home.offSetY = window.pageYOffset;
        }
    }, 100);

    //初始化
    function init() {
        var vm = vm_home;

        if (vm$root.checkPage('home')) {

            vm.nickname = setVar(g$storeInfo.userInfo.nickname, 'string');
            vm.avatar = setVar(g$storeInfo.userInfo.avatar, 'string', './imgs/def_avatar.jpg');
            vm.banner = setVar(g$storeInfo.topBanner, 'string');
            vm.strSector = setVar(g$storeInfo.strSector, 'string');
            vm.visitCount = setVar(g$storeInfo.visitCount, 'int');
            vm.wxNum = setVar(g$storeInfo.userInfo.wxNum, 'string');
            vm.faith = setVar(g$storeInfo.userInfo.faith, 'string').replace(/ /g,'&nbsp;').replace(/</g,'&lt').replace(/>/g,'&gt').replace(/\n/g,'<br/>');
            for (var i = 0; i < g$storeInfo.userInfo.faith.length; i++) {
                if (i == 16) {
                    console.log(g$storeInfo.userInfo.faith.charCodeAt(i));
                }
            }
            vm.likeCount = setVar(g$storeInfo.like, 'int', '0');
            vm.rank = setVar(g$storeInfo.hotRankCountry, 'string');
            if (vm.banner == '') {
                vm.banner = './imgs/def_banner.jpg';
            }
            else {
                vm.banner += '?imageView2/1/w/320/h/200';
            }

            if (g$storeInfo.userInfo.company != null && g$storeInfo.userInfo.company != 0) {
                vm.address = setVar(g$storeInfo.userInfo.company.address, 'string');
            }

            avalon.scan(document.body);

            //延迟调用，设置参数
            setTimeout(function () {
                var h = $('#page_home .faith>p').height();
                $('#page_home .faith').height(50);
                if (h < 50) {
                    $('#page_home .faith').height(h);
                }
                avalon.vmodels.home.faith$mH = h;

                loadProduct();
            }, 100);

        }
        pbl.Refresh();
        window.scrollTo(0, vm.offSetY);
        vm$root.isLoading = false;

        g$WX.title = setVar(g$storeInfo.userInfo.nickname, 'string') + '的微名片';
        wx.ready(function () {
            wx.onMenuShareAppMessage(g$WX);
            wx.onMenuShareTimeline(g$WX);
            wx.onMenuShareQQ(g$WX);
            wx.onMenuShareWeibo(g$WX);
        })
    }

});