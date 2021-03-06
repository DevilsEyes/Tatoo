define([
    'Wookman'
], function () {

    var updated = null;

    var vm = avalon.define({
        $id: 'card',

        offSetY: 0,

        nickname: '',
        avatar: '',
        banner: '',
        strSector: '',
        visitCount: '',
        wxNum: '',
        companyName: '',
        rank: 0,
        price: '',

        likeCount: 1000,
        like$bool: false,
        like$click: function () {
            if (vm.like$bool) {
                openLikeWindow('只能赞一次哦!');
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
                            $('#page_card #addOne').show();
                            setTimeout(function () {
                                $('#page_card #addOne').css({
                                    top: '70px',
                                    opacity: '0',
                                    color: '#322f2c'
                                })
                            }, 0);
                            openLikeWindow('点赞成功')
                        }
                        else {
                            if (obj.msg == '只能赞一次。') {
                                openLikeWindow('只能赞一次哦!')
                            } else {
                                openLikeWindow(obj.msg)
                            }
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
        faith$mH: 60,
        faith$toggle: function () {
            vm.faith$bool = !vm.faith$bool;
            if (vm.faith$bool) {
                $('#page_card .faith p').height(vm.faith$mH);
                $('#page_card .faith a').text('收起');
            } else {
                $('#page_card .faith p').height(60);
                $('#page_card .faith a').text('查看全文');
            }
        },

        productList: [],
        pro$msg: '正在加载更多...',
        pro$loading: false,
        pro$over: false
    });

    var openLikeWindow = function (str) {
        layer.open({
            skin: 'like',
            title: '',
            content: '<h1>' + str + '</h1><h2><img src="./imgs/favicon.png"/><p>下载纹身大咖<br>了解更多纹身资讯</p></h2><div class="btn">立即下载</div>',
            shade: 0.3,
            shadeClose: true,
            closeBtn: false,
            btn: false
        });
        $('.like .layui-layer-content').click(vm$root.downloadApp)
    };

    //加载作品
    function loadProduct() {

        window.timerLoadMore = null;
        if (timerLoadMore) {
            clearInterval(timerLoadMore);
        }
        var limit = 6;//一次加载6个
        var data = {
            userId: g$storeInfo.storeId,
            limit: limit
        };
        if (updated != null)data.updated = updated;

        $.jsonp({
            url: g$baseUrl.slice(0, -6) + "new/products?_method=GET",
            data: data,
            callbackParameter: "callback",
            success: function (obj) {
                obj = $.parseJSON(obj);
                if (obj.code == 0) {
                    if (!obj.data) {
                        vm.pro$over = true;
                        vm.pro$loading = false;
                        clearInterval(timerLoadMore);
                        if (vm.productList.length == 0) {
                            vm.pro$over = true;
                            vm.pro$msg = '掌柜的太忙了！还没有上传作品！';
                            vm.pro$loading = true;
                            $('#page_card .do').css('padding-top', '20px');
                            $('#page_card .up').css('padding-bottom', '20px');
                        }
                    }
                    else {
                        var $pbl = $('#page_card #pbl');

                        var Lo = vm.productList.length;
                        vm.productList = vm.productList.concat(obj.data);
                        var Ln = vm.productList.length - 1;
                        updated = obj.data[obj.data.length - 1].updated;

                        for (var i = Lo; i <= Ln; i++) {
                            var node = vm.productList[i],
                                img = pbl.cal(node.images[0]),
                                nodeStr = "<li>"
                                    + "<a href='#!/pdetail?code=" + node._id + "'>"
                                    + "<img src='" + img.url + "' width=" + img.w + " height=" + img.h + "/>"
                                    + "<div>"
                                    + "<span class='f28'>" + node.images.length + "张</span>"
                                    + "<p class='f28'>" + node.title + "</p>"
                                    + "</div>"
                                    + "</a>"
                                    + "</li>";
                            $pbl.append(nodeStr);
                            $('li:eq(' + i + ')', $pbl).css('background-color', '#eeeeee');
                            //$.ajax({
                            //    url: node.images[0] + '?imageAve',
                            //    index: i,
                            //    success: function (obj) {
                            //        if (obj.RGB) {
                            //            $('li:eq(' + this.index + ')', $pbl).css('background-color', '#' + obj.RGB.substr(2));
                            //        }
                            //    }
                            //});
                            //$('li',$pbl).last().css('background-color',getRandomColor());
                        }
                        pbl.Set();
                        //下拉继续加载
                        window.timerLoadMore = setInterval(function () {
                            if (vm$root.nowPage == 'card' && vm.pro$over == false && vm.pro$loading == false) {
                                var h = $(document).height();
                                var r = $(window).height();
                                var y = window.pageYOffset;
                                if (y > h - 300 - r) {
                                    vm.pro$loading = true;
                                    loadProduct();
                                }
                            }
                        }, 100);
                    }

                }
            }
        })
    }

//瀑布流
    window.pbl = {
        cal: function (str) {
            var w = g$mobile ? $(window).width() : 640;
            var width = (w - 45) / 2;

            if (!str) {
                return {w: width};
            } else {
                var t = str.split('_W_')[1];
                if (t) {
                    var wO = t.split('X')[0];
                    var hO = t.split('X')[1];
                    return {w: width, h: hO / wO * width, url: str + '?imageView2/0/w/320'}
                }
                else {
                    return {w: width, h: width, url: str + '?imageView2/1/w/320/h/320'}
                }

            }
        },
        Set: function () {

            pbl.ex = $('#pbl li').wookmark({
                container: $('#pbl'),
                offset: 10,
                outerOffset: 15,
                itemWidth: pbl.cal().w,
                flexibleWidth: pbl.cal().w,
                align: 'left'
            });
            setTimeout(function () {
                $('#pbl li').css('opacity', 1);
            }, 300);

            var imgLoad = imagesLoaded('#pbl');
            imgLoad.on('always', function (instance) {
                pbl.Refresh();
                vm.pro$loading = false;
            });
            imgLoad.on('progress', function (instance, image) {
                $(image.img).css('opacity', 1);
            });
        },
        Refresh: function () {
            $('#pbl').trigger('refreshWookmark');
        }
    };

//记录拉动距离
    var timercardOSY = setInterval(function () {
        if (vm$root.nowPage == 'card') {
            vm.offSetY = window.pageYOffset;
        }
    }, 100);


//初始化
    function init() {

        if (vm$root.checkPage('card')) {

            vm.nickname = setVar(g$storeInfo.userInfo.nickname, 'string');
            vm.avatar = setVar(g$storeInfo.userInfo.avatar, 'string', './imgs/def_avatar.jpg');
            vm.banner = setVar(g$storeInfo.topBanner, 'string');
            vm.strSector = setVar(g$storeInfo.strSector, 'string');
            vm.visitCount = setVar(g$storeInfo.visitCount, 'int');
            vm.wxNum = setVar(g$storeInfo.userInfo.wxNum, 'string');
            vm.price = setVar(g$storeInfo.userInfo.price, 'string', '');
            vm.faith = setVar(g$storeInfo.userInfo.faith, 'string').replace(/ /g, '&nbsp;').replace(/</g, '&lt').replace(/>/g, '&gt').replace(/\n/g, '<br/>');
            vm.likeCount = setVar(g$storeInfo.like, 'int', '0');
            vm.rank = setVar(g$storeInfo.hotRankCountry, 'string');
            if (vm.banner == '') {
                vm.banner = './imgs/def_banner.jpg';
            }
            else if (g$mobile) {
                vm.banner += '?imageView2/1/w/320/h/200';
            } else {
                vm.banner += '?imageView2/1/w/320/h/100';
            }

            if (g$storeInfo.userInfo.company) {
                vm.companyName = setVar(g$storeInfo.userInfo.company.name, 'string');
            }
            else {
                vm.companyName = null;
            }

            avalon.scan(document.getElementById('page_card'));

            //延迟调用，设置参数
            setTimeout(function () {
                var h = $('#page_card .faith p').height();
                $('#page_card .faith p').height(60);
                if (h < 60) {
                    $('#page_card .faith p').height(h);
                }
                vm.faith$mH = h;

                loadProduct();

            }, 100);

        }
        pbl.Refresh();
        window.scrollTo(0, vm.offSetY);
        vm$root.isLoading = false;

        $(document).attr("title", setVar(g$storeInfo.userInfo.nickname, 'string') + '的作品集');
        //g$WX.set({
        //    title : setVar(g$storeInfo.userInfo.nickname, 'string') + '的作品集',
        //    imgUrl : setVar(g$storeInfo.userInfo.avatar, 'string', './imgs/def_avatar.jpg'),
        //    desc : '我的作品都在里面，进来看看吧'
        //});
    }

    return {init: init};
});