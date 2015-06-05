/**
 * 教师事件提醒列表
 *
 * @author mingxin.huang
 * @update 2015.06.03
 */

define(function (rquire) {
    var backbone = require('backbone'),

        core = require('base/core'),
        reminderModel = require('models/reminder-T')

    var reminderList = backbone.Collection.extend({
        url : 'teacher/reminds/list',
        sync : core.sync,
        model : reminderModel,
        initialize : function () {
            this.fetch();
        },
        parse : function (res) {
            return res.data;
        }
    });

    return new reminderList();
});