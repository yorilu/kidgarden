/**
 * Created on 2015/5/19.
 * global config
 */
window.globalConfig = (function(window){
    return {
        "ptGetDataUrl": "http://api.kgcrm.net/crm/parent",
        "thGetDataUrl": "http://api.kgcrm.net/crm/teacher", //获取
        "domain": "http://m.kgcrm.net", //通用url前缀
        "urlPrefix": "http://api.kgcrm.net", //通用url前缀
        "locStoKey": "storage",    //localstorage key
        "xijqwResUrl": "http://7xj1dh.com1.z0.glb.clouddn.com", //个人头像空间
        //"xijqwResUrl": "http://7xj754.com1.z0.glb.clouddn.com/", //个人头像空间
        "xijqwResUrlAlbums": "http://7xivxv.com1.z0.glb.clouddn.com", //班级相册图片空间
        "xijqwResUrlShare": "http://7xj3z6.com1.z0.glb.clouddn.com", //分享图片空间
        "jsApiList": ["hideOptionMenu", "showOptionMenu"],
        "loadFireHeight": 200,
        "appId": "wxb52a82ef7899c308",
        "mainTeaToolBarTpml":  '<div class="bottools ptf wp100 b0 bgcfff z4">' +
            '<a href="javascript:;" id="J_goBack" class="back dsb pta c66 alic"><i class="fa fa-angle-left fs24 mr5"></i></a>' +
            '<a href="javascript:;" id="J_showMenuList" class="menus dsb pta c66 r0 alic"><i class="fa fa-ellipsis-h fs24 mr5"></i></a>' +
            '<div class="btnlist" id="J_btnlist">{{localtemp}}</div>' +
            '<div id="J_menuListPanel" class="menulist ptf wp100 hp100 z1 hide">' +
            '<div id="J_list" class="menuList pta hp100 ovh z2">' +
            '<p class="menutil fs12 pl10 pta wp100">菜单列表</p>' +
            '<div id="J_menubox" class="menubox ovh">' +
            '<a href="t-albums.html" class="m c66 ptr dsb" data-pageid="t-albums"><i class="fa fa-picture-o fs16 vam mr10"></i>班级相册<i class="fa fa-check pta r0 hide"></i></a>' +
            '<a href="t-remind.html" class="m c66 ptr dsb" data-pageid="t-remind"><i class="fa fa-bell-o fs16 vam mr10"></i>事件提醒<i class="fa fa-check pta r0 hide"></i></a>' +
            '<a href="t-check.html" class="m c66 ptr dsb" data-pageid="t-check"><i class="fa fa-calendar fs16 vam mr10"></i>学生考勤<i class="fa fa-check pta r0 hide"></i></a>' +
            '<a href="t-redlist.html" class="m c66 ptr dsb" data-pageid="t-redlist"><i class="fa fa-heart-o fs16 vam mr10"></i>红花榜<i class="fa fa-check pta r0 hide"></i></a>' +
            '<a href="t-message.html" class="m c66 ptr dsb" data-pageid="t-message"><i class="fa fa-comment-o fs16 vam mr10"></i>班级消息<i class="fa fa-check pta r0 hide"></i></a>' +
            '<a href="t-maillist.html" class="m c66 ptr dsb" data-pageid="t-maillist"><i class="fa fa-list-alt fs16 vam mr10"></i>通讯录<i class="fa fa-check pta r0 hide"></i></a>' +
            '<a href="t-apply.html" class="m c66 ptr dsb" data-pageid="t-apply"><i class="fa fa-user-plus fs16 vam mr10"></i>注册申请<i class="fa fa-check pta r0 hide"></i></a>' +
            '</div>' +
            '<a href="index1.html" class="mgohome pta b0 l10 cd"><i class="fa fa-home fs18 vam mr10"></i>返回首页</a>' +
            '</div>' +
            '<a id="J_mask" href="javascript:;" class="pta hp100 wp100" style="background:rgba(0,0,0,0.5)"></a>' +
            '</div></div></div>',
        "mainParToolBarTpml":  '<div class="bottools ptf wp100 b0 bgcfff z4">' +
            '<a href="javascript:;" id="J_goBack" class="back dsb pta c66 alic"><i class="fa fa-angle-left fs24 mr5"></i></a>' +
            '<a href="javascript:;" id="J_showMenuList" class="menus dsb pta c66 r0 alic"><i class="fa fa-ellipsis-h fs24 mr5"></i></a>' +
            '<div class="btnlist" id="J_btnlist">{{localtemp}}</div>' +
            '<div id="J_menuListPanel" class="menulist ptf wp100 hp100 z1 hide">' +
            '<div id="J_list" class="menuList pta hp100 ovh z2">' +
            '<p class="menutil fs12 pl10 pta wp100">菜单列表</p>' +
            '<div id="J_menubox" class="menubox ovh">' +
            '<a href="p-albums.html" class="m c66 ptr dsb" data-pageid="p-albums"><i class="fa fa-picture-o fs16 vam mr10"></i>班级相册<i class="fa fa-check pta r0 hide"></i></a>' +
            '<a href="p-timeline.html" class="m c66 ptr dsb" data-pageid="p-timeline"><i class="fa fa-bell-o fs16 vam mr10"></i>宝贝相册<i class="fa fa-check pta r0 hide"></i></a>' +
            '<a href="p-remind.html" class="m c66 ptr dsb" data-pageid="p-remind"><i class="fa fa-calendar fs16 vam mr10"></i>事件提醒<i class="fa fa-check pta r0 hide"></i></a>' +
            '<a href="p-check.html" class="m c66 ptr dsb" data-pageid="p-check"><i class="fa fa-heart-o fs16 vam mr10"></i>宝贝考勤<i class="fa fa-check pta r0 hide"></i></a>' +
            '<a href="p-redlist.html" class="m c66 ptr dsb" data-pageid="p-redlist"><i class="fa fa-comment-o fs16 vam mr10"></i>红花榜<i class="fa fa-check pta r0 hide"></i></a>' +
            '<a href="p-message.html" class="m c66 ptr dsb" data-pageid="p-message"><i class="fa fa-list-alt fs16 vam mr10"></i>班级消息<i class="fa fa-check pta r0 hide"></i></a>' +
            '<a href="p-teachers.html" class="m c66 ptr dsb" data-pageid="p-teachers"><i class="fa fa-user-plus fs16 vam mr10"></i>通讯录<i class="fa fa-check pta r0 hide"></i></a>' +
            '<a href="p-letter.html" class="m c66 ptr dsb" data-pageid="p-letter"><i class="fa fa-envelope-o fs16 vam mr10"></i>站内信<i class="fa fa-check pta r0 hide"></i></a>' +
            '</div>' +
            '<a href="index2.html" class="mgohome pta b0 l10 cd"><i class="fa fa-home fs18 vam mr10"></i>返回首页</a>' +
            '</div>' +
            '<a id="J_mask" href="javascript:;" class="pta hp100 wp100" style="background:rgba(0,0,0,0.5)"></a>' +
            '</div></div></div>',
        "wxInfo": {
            "ts": "1432441655",
            "/index1.html": {
                "noncestr": "55615334695a32046a00014e",
                "signature": "1141f33d1e565ac7b15cc5214123930115251c53"
            },
            "/index2.html": {
                "noncestr": "55615d93695a32046a00017d",
                "signature": "b97b1f139d7f5202dd210acc4fef6ca6dab4e885"

            },
            "/t-albums.html": {
                "noncestr": "55615dc7695a32046a00017e",
                "signature": "9631ac48aa546445d131f205f3b85f397de80aab"

            },
            "/t-timeline.html": {
                "noncestr": "55615e3a695a32046a000181",
                "signature": "0c5db70de33b1452d087fb23f8184406ce3e705f"
            },
            "/t-check.html": {
                "noncestr": "55615efa695a32046a000191",
                "signature": "0a0ae5bff0fdc5cc9be58704b27783dbd48324d6"
            },
            "/t-checkreport.html": {
                "noncestr": "55615f17695a32046a000193",
                "signature": "27ff3e420948645d197d33a45327ac1d7a001132"
            },
            "/t-redlist.html": {
                "noncestr": "55615f4f695a32046a000196",
                "signature": "9b70f4b921f4e5d8e6fc24950a08096b8ff29bd3"
            },
            "/t-message.html": {
                "noncestr": "55615f6e695a32046a000197",
                "signature": "e059d708e47390ec732f29733a70552a0f5f4e5a"
            },
            "/t-letternew.html": {
                "noncestr": "55615ff0695a32046a00019d",
                "signature": "60a28578527b68903cd303e13e0f9e10ff2f0713"
            },
            "/t-maillist.html": {
                "noncestr": "55616031695a32046a0001a3",
                "signature": "7d84ea0b70ee255b72ba85ad9e5da9da3e7fa6d2"
            },
            "/t-apply.html": {
                "noncestr": "55616054695a32046a0001a7",
                "signature": "adfaaedce19c4806ba6e78330db05eaa0f4d40c6"
            },
            "/t-logs.html": {
                "noncestr": "556160ec695a32046a0001af",
                "signature": "9d3f47254b182eb05092970f7e1f3c16e7ed87aa"
            },
            "/page-qa.html": {
                "noncestr": "556160b8695a32046a0001ab",
                "signature": "866a793e82be529f478ad62f4cbc29f18eb9bd74"
            },
            "/p-albums.html": {
                "noncestr": "556161dc695a32046a0001b4",
                "signature": "e597ad8fbc81780cb737c9d2631f75e1e88f97ae"
            },
            "/p-timeline.html": {
                "noncestr": "55615e3a695a32046a000181",
                "signature": "e597ad8fbc81780cb737c9d2631f75e1e88f97ae"
            }
        }
    };
})(window);