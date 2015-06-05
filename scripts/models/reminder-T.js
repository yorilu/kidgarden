/**
 * 老师提醒model
 *
 * @author mingxin.huang
 * @udpate 2015.06.03
 */

define(function (require) {
    var backbone = require('backbone'),

        core = require('base/core'),
        kd = require('models/kd');

    var reminderModel = backbone.Model.extend({
        url : 'teacher/reminds/process',
        sync : core.sync,
        setRead : function (reply) {
            reply = reply || '已阅';

            var data = {
                    audit : 1,
                    readers : [{
                        reply : reply,
                        teacher_id : kd.getUserId(),
                        ts : Math.round(new Date().getTime()/1000)
                    }]
                },
                options = {
                    url : this.url,
                    type : 'POST',
                    data : {
                        remind_id : this.get('_id'),
                        reply : reply
                    }
                }

            this.save(data, options);
        }
    });

    return reminderModel;
});