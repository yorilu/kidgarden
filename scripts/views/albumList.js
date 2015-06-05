/**
 * 相册页面模块，负责相册相关的展示
 *
 * @author mingxin.huang
 * @update 2015.05.30
 */

define(function (require) {
    var backbone = require('backbone'),
        $ = require('zepto'),
        lazyload = require('lazyload'),

        core = require('base/core'),
        kd = require('models/kd'),
        albumView = kd.isTeacher() ? require('views/album-T') : require('views/album'),
        albumList = require('collections/albumList');

    var albumListView = backbone.View.extend({
        el : '.app-view-album',
        collection : albumList,
        initialize : function () {
            // 加载对应的css文件
            core.loadCss('album');

            this.$content = this.$('.app-view-content');
            this.$content.html('<ul class="common-ul"></ul>');
            this.$list = this.$('ul');

            // 绑定collection
            this.listenTo(this.collection, 'add', this.addOne);

            // 绑定滚动事件
            var that = this;
            this.$content.on('scroll', function (e) {
                that.handleScroll();
            });

            this.collection.load();
        },
        /**
         * 显示当前面板
         * @return {[type]} [description]
         */
        show : function () {
            this.$el.addClass('show-app-view');
        },
        addOne : function (model) {
            var view = new albumView({model : model});

            this.$list.append(view.render().$el);

            this.$content.find('.album-lazy').lazyload({
                container : this.$content
            });
        },
        handleScroll : function (e) {
            var contentH = this.$el.height(),
                listH = this.$('ul').height(),
                scrollTop = this.$content.scrollTop();

            if (contentH + scrollTop + 500 > listH) {
                core.debug('load more');
                this.collection.load();
            }
        }
    });

    return new albumListView();
});