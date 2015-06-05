/**
 * 首页试图，主要负责用户数据的展示
 *
 * @author mingxin.huang
 * @update 2015.05.30
 */

define(function (require) {
    var backbone = require('backbone'),
        _ = require('underscore'),
        $ = require('zepto'),
        template = require('template'),

        core = require('base/core'),
        kdModel = require('models/kd'),
        weatherModel = require('models/weather'),
        wrapView = require('views/wrap'),
        weatherTmpl = require('text!templates/index/weather.html');

    var indexView = backbone.View.extend({
        el : '.view-index-header',
        model : kdModel,
        model2 : weatherModel,
        initialize : function () {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model2, 'change', this.renderWeather);

            // 测试用，设置身份
            core.setCookie('_k_openid', 'ox3k3t22bS1z-9IXemNz26Bicc7s', 30);
            // this.model.fetch();
            this.model2.fetch();
        },
        render : function () {
            // core.debug('avatar render');

            wrapView.closeAll();

            if (!this.model.hasChanged()) {
                return this;
            }

            // core.debug('index render : ', this.model.toJSON());
            this.$('.index-header-avatar img').attr('src', core.getAvatar(this.model.getUserId()));

            return this;
        },
        renderWeather : function () {
            // core.debug('weather : ', this.model2.toJSON());

            this.$('.index-header-weather').html(template(weatherTmpl, {data : this.model2.toJSON()}));
        }
    });

    var currIndexView = new indexView();

    // exports = currIndexView;
    return currIndexView;
});