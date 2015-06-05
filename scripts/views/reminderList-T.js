/**
 * 教师提醒模块
 *
 * @author mingxin.huang
 * @update 2015.06.03
 */

define(function (require) {
    var backbone = require('backbone'),

        core = require('base/core'),
        reminderListCollection = require('collections/reminderList-T'),
        reminderView = require('views/reminder-T');

    var reminderListView = backbone.View.extend({
        el : '.app-view-reminder',
        collection : reminderListCollection,
        initialize : function () {
            // 加载对应的css文件
            core.loadCss('reminder-T');

            this.$content = this.$('.app-view-content');

            this.$content.empty();
            this.$content.html('<ul class="common-ul"></ul>');
            this.$list = this.$('ul');

            this.listenTo(this.collection, 'add', this.addOne);
        },
        addOne : function (model) {
            var view = new reminderView({model : model});

            this.$list.append(view.render().$el);
        }
    });

    return new reminderListView();
});