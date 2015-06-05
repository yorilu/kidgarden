/**
 * 教师考勤总视图
 *
 * @author mingxin.huang
 * @update 2015.06.05
 */

define(function (require) {
    var backbone = require('backbone'),
        kd = require('models/kd'),

        core = require('base/core'),
        baseTmpl = require('text!templates/checkin/base.html');

    var checkInView = backbone.View.extend({
        el : '.app-view-checkin',
        initialize : function () {
            core.loadCss('checkin-T');

            this.$content = this.$('.app-view-content');

            this.$content.empty();

            this.render();
        },
        render : function () {
            this.$content.html(baseTmpl);
        }
    });

    return new checkInView();
});