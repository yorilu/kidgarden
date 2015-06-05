/**
 * 单条相册的view
 *
 * @author mingxin.huang
 * @update 2015.05.31
 */

define(function (require) {
    var backbone = require('backbone'),
        $ = require('zepto'),
        template = require('template'),

        core = require('base/core'),
        albumModel = require('models/album'),
        albumPreview = require('views/albumPreview'),
        albumTemplate = require('text!templates/album/list.html');

    var albumView = backbone.View.extend({
        tagName : 'li',
        model : albumModel,
        events : {
            'touchstart img' : 'setRead',
            'touchstart img' : 'preview'
        },
        initialize : function () {
            this.listenTo(this.model, 'change:reader_count', this.addCount);

            this.listenTo(this.model, 'delPic', this.rmPic);
        },
        render : function () {
            this.$el.html(template(albumTemplate, {data : this.model.toJSON()}));

            return this;
        },
        /**
         * 设置已读
         */
        setRead : function () {
            core.debug('setRead');

            this.model.setRead();
        },
        /**
         * 增加阅读数量
         */
        addCount : function () {
            this.$('.album-tips-area span').text(this.model.get('reader_count'));
        },
        /**
         * 删除图片
         */
        rmPic : function (pic_key) {
            core.debug('rmPic : ', pic_key);

            this.$('img[data-key='+pic_key+']').remove();

            this.$('.album-pics-area img').each(function (index, img) {
                var $img = $(img);

                $img.removeClass('trd-img');

                if ((index+1)%3 === 0) {
                    $img.addClass('trd-img');
                }
            });
        },
        /**
         * 预览图片
         */
        preview : function (e) {
            new albumPreview({
                currPic : $(e.target).data('key'),
                model : this.model
            });
        }
    });

    return albumView;
});