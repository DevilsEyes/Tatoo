define(["mmRouter",
    "jQjsonp",
    "Layer",
    'Wookman',
    "css!./home.css"
], function () {
    avalon.router.get("/home/", init);

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
        pro$over: false
    });

    //加载作品
    function loadProduct() {

        window.timerLoadMore = null;
        if (timerLoadMore) {
            clearInterval(timerLoadMore);
        }
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
                    if (obj.data.list.length == 0) {
                        vm_home.pro$over = true;
                        vm_home.pro$loading = true;
                    }
                    else{
                        //旧版
                        //vm_home.productList = vm_home.productList.concat(obj.data.list);
                        //avalon.scan(document.body);
                        //pbl.Set();

                        //jQuery重写
                        var nodeStr = '';
                        var node = {};
                        var $pbl = $('#page_home #pbl');

                        var Lo = vm_home.productList.length;
                        vm_home.productList = vm_home.productList.concat(obj.data.list);
                        var Ln = vm_home.productList.length - 1;

                        for (var i = Lo; i <= Ln; i++) {
                            node = vm_home.productList[i];
                            nodeStr = "<li>"
                                + "<a href='#!/pdetail?code=" + node._id + "'>"
                                + "<img src='" + node.images[0] + "?imageView2/0/w/320'/>"
                                + "<div>"
                                + "<span class='f28'>" + node.images.length + "张</span>"
                                + "<p class='f28'>" + node.title + "</p>"
                                + "</div>"
                                + "</a>"
                                + "</li>";

                            $pbl.append(nodeStr);
                            pbl.Set();

                        }
                    }
                }
                console.log(obj.data.count, vm_home.productList.length);
                console.dir(vm_home.productList);
                vm_home.pro$loading = false;
                if (obj.data.count <= vm_home.productList.length) {
                    vm_home.pro$over = true;
                    clearInterval(timerLoadMore);
                    if (obj.data.count == 0) {
                        vm_home.pro$msg = '掌柜的太忙了！还没有上传作品！';
                        vm_home.pro$loading = true;
                        $('#page_home .do').css('background-color', '#383431');
                        $('#page_home .do').css('padding-top', '20px');
                    }
                } else {
                    //下拉继续加载
                    window.timerLoadMore = setInterval(function () {
                        if (vm$root.nowPage == 'home' && vm_home.pro$over == false && vm_home.pro$loading == false) {
                            var h = $(document).height();
                            var r = $(window).height();
                            var y = window.pageYOffset;
                            //console.log(h-r,y);
                            if (y > h - 300 - r) {
                                vm_home.pro$loading = true;
                                loadProduct();
                            }
                        }
                    }, 100);
                }
            }
        })
    }

    //瀑布流
    var pbl = {
        ex: null,
        Set: function () {

            // Destroy the old handler
            //$('#pbl li').css('opacity', 0);
            //if (pbl.ex) {
            //    pbl.ex.wookmarkInstance.clear();
            //}

            pbl.ex = $('#pbl li').wookmark({
                container: $('#pbl'),
                offset: 10,
                outerOffset: 15,
                itemWidth: '48%',
                flexibleWidth: '48%',
                align: 'left'
                //resizeDelay: 100,
                //autoResize: true
            });

            var imgLoad = imagesLoaded('#pbl');

            imgLoad.on('always', function (instance) {
                pbl.Refresh();
                $('#pbl li').css('opacity', 1);
            });

            imgLoad.on('progress', function (instance, image) {
                var $li = $(image.img.parentNode.parentNode);
                $(image.img).width($(image.img).width());
                $(image.img).height($(image.img).height());
                //$li.css('opacity', 1);

                //    //$li.show();
                //    //$li.removeClass('isload');
                //    image.img.parentNode.className = image.isLoaded ? '' : 'broken';
            });
        },
        Refresh: function () {
            setTimeout(function () {
                $('#pbl').trigger('refreshWookmark');
            }, 300);
        }
    };

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
            vm.faith = setVar(g$storeInfo.userInfo.faith, 'string').replace(/ /g, '&nbsp;').replace(/</g, '&lt').replace(/>/g, '&gt').replace(/\n/g, '<br/>');
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
        window.scrollTo(0,vm.offSetY);
        vm$root.isLoading = false;

        g$WX.title = setVar(g$storeInfo.userInfo.nickname, 'string') + '的微名片';
        g$WX.imgUrl = setVar(g$storeInfo.userInfo.avatar, 'string', './imgs/def_avatar.jpg');
        g$WX.desc = setVar(g$storeInfo.userInfo.faith, 'string');
        wx.ready(function () {
            wx.onMenuShareAppMessage(g$WX);
            wx.onMenuShareTimeline(g$WX);
            wx.onMenuShareQQ(g$WX);
            wx.onMenuShareWeibo(g$WX);
        });
    }



});