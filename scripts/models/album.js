/**
 * 相册单个数据model,用于主播对某条记录进行修改和删除
 *
 * @author mingxin.huang
 * @update 2015.05.31
 */

define(function (require) {
    var backbone = require('backbone'),

        core = require('base/core');

    var albumModel = backbone.Model.extend({
        urls : {
            delAlbum : 'album/del_album/{album_id}',
            delPic   : 'album/del_pic/{album_id}/{pic_key}',
            editDesc : 'album/desc',
            read     : 'album/reader/{album_id}'
        },
        sync : core.sync,
        initialize : function () {
            this.set('id', this.get('_id'));

            // 防止xss
            if (this.has('desc')) {
                this.set('desc', this.escape('desc'));
            }
        },
        /**
         * 删除相册
         */
        delAlbum : function () {
            this.destroy({
                url : this.urls.delAlbum,
                data : {
                    album_id : this.get('_id')
                }
            });
        },
        /**
         * 删除单张图片
         * @param  {String} pic_key 图片key值
         */
        delPic : function (pic_key) {
            var pics = this.get('pics');

            pics.splice(pics.indexOf(pic_key), 1);

            // 触发模型内的删除图片事件 
            this.trigger('delPic', pic_key);
            
            this.save('pics', pics, {
                url : this.urls.delPic,
                data : {
                    album_id : this.get('_id'),
                    pic_key : pic_key
                }
            });
        },
        /**
         * 修改描述
         * @param  {String} text 描述
         */
        editDesc : function (text) {
            this.save('desc', text, {
                url : this.urls.editDesc,
                type : 'POST',
                data : {
                    album_id : this.get('_id'),
                    desc : text
                }
            });
        },
        /**
         * 设置成已读
         */
        setRead : function () {
            if (this.get('isRead')) {
                return;
            }

            this.set('isRead', true);

            var count = this.get('reader_count') || 0;

            this.save('reader_count', count+1, {
                url : this.urls.read,
                data : {album_id : this.get('_id')}
            });
        }
    });

    return albumModel;
});