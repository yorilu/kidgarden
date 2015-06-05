/**
 * 教师单个提醒视图
 *
 * @author mingxin.huang
 * @update 2015.06.03
 */

define(function (require) {
    var backbone = require('backbone'),

        kd = require('models/kd'),
        model = require('models/reminder-T'),
        template = require('template'),
        listTmpl = require('text!templates/reminder/list-T.html');

    var reminderView = backbone.View.extend({
        tagName : 'li',
        events : {
            'touchstart .btn' : 'setRead'
        },
        initialize : function () {
            // 数据变更时进行修改视图
            this.listenTo(this.model, 'change', this.render);
        },
        render : function () {
            var data = this.model.toJSON();

            this.$el.html(template(listTmpl, {data : data}));

            if (data.audit === 1) {
                this.$el.addClass('reminder-readed');
            }

            return this;
        },
        /**
         * 设置成已读
         */
        setRead : function () {
            this.model.setRead();
        }
    });

    return reminderView;
});