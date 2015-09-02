define(["mmRouter"],
    function () {
        var VersionList = {
            page_card:'?v=20150902-1029',
            page_address:'?v=20150826-1132',
            page_pdetail:'?v=20150826-1132',
            page_bill:'?v=20150826-1132',
            page_comment:'?v=20150826-1132',
            page_appoint:'?v=20150826-1132',
            page_invite:'?v=20150902-1132',
            page_nf404:'?v=20150826-1132'
        };

        var initModel = function (modName) {
            return function () {
                vm$root.isLoading = true;
                var self = this;
                require([modName + VersionList[modName]], function (model) {
                    model.init(self);
                })
            }
        };
        avalon.router.$types.intStr19 = { pattern:'[0-9&a-z&A-Z]{19}', decode: String};

        avalon.router.get("/card/", initModel('page_card'));
        avalon.router.get("/address/", initModel('page_address'));
        avalon.router.get("/appoint/", initModel('page_appoint'));
        avalon.router.get("/nf404/", initModel('page_nf404'));

        avalon.router.get("/pdetail/", initModel('page_pdetail'));
        avalon.router.get("/pdetail/{id:intStr19}",initModel('page_pdetail'));

        avalon.router.get("/bill/", initModel('page_bill'));
        avalon.router.get("/bill/{id:intStr19}", initModel('page_bill'));

        avalon.router.get("/invite/", initModel('page_invite'));
        avalon.router.get("/invite/{id:intStr19}", initModel('page_invite'));

        avalon.router.get("/comment/", initModel('page_comment'));
        avalon.router.get("/comment/{id:intStr19}", initModel('page_comment'));

    }
);