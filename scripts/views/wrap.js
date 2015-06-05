/**
 * view主题模块，负责子view的切换和显示
 *
 * @author mingxin.huang
 * @update 2015.05.31
 */

define(function (require) {
    var backbone = require('backbone'),
        $ = require('zepto');

    var wrapView = backbone.View.extend({
        el : '#app-wrap',
        render : function ($el) {
            this.closeAll();

            $el.addClass('show-app-view');
        },
        closeAll : function () {
            this.$el.children().removeClass('show-app-view');
        }
    });

    return new wrapView();
});