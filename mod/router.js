define(["mmRouter"],
    function () {
        var initModel = function (modName) {
            return function () {
                var self = this;
                require([modName], function (model) {
                    model.init(self);
                })
            }
        };

        avalon.router.get("/card/", initModel('page_card'));
        avalon.router.get("/address/", initModel('page_address'));
        avalon.router.get("/pdetail/", initModel('page_pdetail'));
        //avalon.router.get("/pdetail/{id:string}",initModel('page_pdetail'));
        avalon.router.get("/bill/", initModel('page_bill'));
        avalon.router.get("/comment/", initModel('page_comment'));
        avalon.router.get("/appoint/", initModel('page_appoint'));
        avalon.router.get("/invite/", initModel('page_invite'));
        avalon.router.get("/nf404/", initModel('page_nf404'));

    }
);