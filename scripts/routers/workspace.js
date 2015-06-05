define(function (require) {
    var backbone = require('backbone');

    var WorkSpace = backbone.Router.extend({
        routes : {
            ''         : 'index', //默认首页
            'album'    : 'album',  //相册
            'reminder' : 'reminder', //事件提醒
            'checkin'  : 'checkin', //学生考勤
            'flowers'  : 'flowers', //红花榜
            'msg'      : 'msg', //班级消息
            'contacts' : 'contacts', //通讯录
            'register' : 'register', //注册审核
            'feedback' : 'feedback', //产品反馈
            'log'      : 'log' //操作记录
        },
        index : function () {
            require(['views/index'], function (indexView) {
                indexView.render();
            });
        },
        album : function () {
            require(['views/albumList'], function (albumListView) {
                changeView('album')
            });
        },
        reminder : function () {
            require(['views/reminderList-T'], function (reminderListView) {
                changeView('reminder');
            });
        },
        checkin : function () {
            require(['views/checkin-T'], function () {
                changeView('checkin');
            });
        },
        flowers : function () {
        },
        msg : function () {
        },
        contacts : function () {
        },
        register : function () {
        },
        feedback : function () {
        },
        log : function () {
        }
    });
    
    /**
     * 切换到对应的view
     * @param  {String} viewName view的名称
     */
    function changeView (viewName) {
        $('#app-wrap .app-view-'+viewName).addClass('show-app-view');
    }
    
    return WorkSpace;
});