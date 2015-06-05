/**
 * 相册页面预览模块
 *
 * @author mingxin.huang
 * @update 2015.05.05
 */

define(function (require) {
    var backbone = require('backbone'),
        $ = require('zepto'),
        template = require('template'),
        touch = require('touch'),

        core = require('base/core'),
        albumModel = require('models/album'),
        previewTmpl = require('text!templates/album/preview.html');

    var albumPreviewView = backbone.View.extend({
        className : 'album-preview-area',
        model : albumModel,
        events : {
            'tap img'          : 'close',
            'tap .fa-arrow-up' : 'toggleDel',
            'tap .btn-danger'  : 'delPic',
            'swipeLeft'        : 'next',
            'swipeRight'       : 'prev'
        },
        initialize : function (attrs, options) {
            this.currIndex = this.model.get('pics').indexOf(attrs.currPic);

            this.listenTo(this.model, 'delPic', this.rmPic);

            this.render();
        },
        render : function () {
            var data = this.model.toJSON();
            data.currIndex = this.currIndex;

            this.$el.html(template(previewTmpl, {data : data}));
            this.$pagin = this.$('.album-preview-pagin');
            this.$list = this.$('ul');
            this.$list.css('marginLeft', this.currIndex*-720);

            $('.app-view-album').append(this.$el);

            return this;
        },
        /**
         * 关闭预览
         */
        close : function () {
            this.remove();
        },
        next : function () {
            core.debug('next');
            var index = this.currIndex + 1;

            if (index >= this.model.get('pics').length) {
                return;
            }

            this.currIndex = index;

            this.$list.css('marginLeft', -720*this.currIndex);

            this.setPagin();
        },
        prev : function () {
            core.debug('prev');
            var index = this.currIndex - 1;

            if (index < 0) {
                return;
            }

            this.currIndex = index;

            this.$list.css('marginLeft', -720*this.currIndex);

            this.setPagin();
        },
        /**
         * 设置页码
         */
        setPagin : function () {
            this.$pagin.text((this.currIndex+1) + ' / '+this.model.get('pics').length);
        },
        toggleDel : function () {
            this.$('.fa-arrow-up').toggleClass('fa-rotate-180');
            this.$('.album-pic-handle-area').toggleClass('show-handle-area');
        },
        /**
         * 删除图片
         */
        delPic : function () {
            core.debug('del pic');

            var pics = this.model.get('pics'),
                picKey = pics[this.currIndex];

            this.model.delPic(picKey);
        },
        /**
         * 从视图中删除图片
         * @return {[type]} [description]
         */
        rmPic : function (pic_key) {
            core.debug('preview rmPic : ', pic_key);

            this.currIndex = this.currIndex === 0 ? 0 : this.currIndex-1;

            if (this.model.get('pics').length === 0) {
                return this.close();
            }

            this.$('li[data-key='+pic_key+']').remove();
            this.toggleDel();
            this.setPagin();
        }
    });

    return albumPreviewView;
});