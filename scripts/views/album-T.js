/**
 * 教师相册视图增加修改描述和删除功能
 *
 * @author mingxin.huang
 * @update 2015.06.02
 */

define(function (require) {
    var _ = require('underscore'),
        core = require('base/core'),
        albumView = require('views/album');

    var albumTeacherView = albumView.extend({
        events : {
            'touchstart .fa-trash-o'      : 'delAlbum',
            'touchstart .album-desc-area' : 'showEdit',
            'keypress input'              : 'editDesc',
            'blur input'                  : 'hideEdit'
        },
        initialize : function () {
            // 执行原型的初始化方法
            albumView.prototype.initialize.apply(this);

            this.listenTo(this.model, 'destroy', this.removeAlbum);

            this.listenTo(this.model, 'change:desc', this.changeDesc);
        },
        /**
         * 被删除后从面板中移出
         */
        removeAlbum : function () {
            this.$el.css('height', this.$el.height());
            this.$el.addClass('remove-li');

            var that = this;
            setTimeout(function () {
                that.$el.css({
                    'height' : 0
                });
            }, 100);
            setTimeout(function () {
                that.remove();
            }, 1000)
        },
        /**
         * 修改描述
         * @return {[type]} [description]
         */
        changeDesc : function () {
            core.debug('changeDesc : ', this.model.toJSON());

            var $descArea = this.$('.album-desc-area');

            if ($descArea.length === 0) {
                this.$('.album-edit-area').before('<p class="album-desc-area fa-sz-24">'+this.model.get('desc')+'</p>');
            } else {
                $descArea.text(this.model.get('desc'));
            }

            this.hideEdit();
        },
        // 删除相册
        delAlbum : function () {
            core.debug('delAlbum');

            this.model.delAlbum();
        },
        /**
         * 显示编辑框
         */
        showEdit : function () {
            core.debug('showEdit');

            this.$('.album-desc-area').hide();
            this.$('.album-edit-area').show();
        },
        /**
         * 隐藏编辑框
         */
        hideEdit : function () {
            if (!this.model.has('desc')) {
                return;
            }

            this.$('.album-desc-area').show();
            this.$('.album-edit-area').hide();  
        },
        /**
         * 编辑描述内容
         * @param  {[type]} e [description]
         */
        editDesc : function (e) {
            core.debug('editDesc');

            if (e.which !== 13) {
                return;
            }

            this.model.editDesc(this.$('input').val().trim());
        }
    });
    
    // 继承原型的事件
   _.extend(albumTeacherView.prototype.events, albumView.prototype.events); 

    return albumTeacherView;
});