/**
 * 班级相册列表集合，负责相册数据的处理
 *
 * @author mingxin.huang
 * @update 2015.05.31
 */

define(function (require) {
    var backbone = require('backbone'),
        _ = require('underscore'),

        core = require('base/core'),
        albumModel = require('models/album');

    var albumList = backbone.Collection.extend({
        url : core.getRoot('album/list/10/{page}'),
        model : albumModel,
        sync : core.sync,
        currPage : 1,
        isLastPage : false, //是否最后一页
        isSyncing : false, //是否在同步数据
        initialize : function () {
            this.on('sync', function () {
                this.isSyncing = false;
            });
        },
        parse : function (res) {
            if (res.data.length < 10) {
                this.isLastPage = true;
            }

            return res.data;
        },
        /**
         * 加载数据
         */
        load : function () {
            if (this.isLastPage || this.isSyncing) {
                return;
            }

            this.isSyncing = true;

            this.fetch({
                data : {
                    page : this.currPage
                }
            });

            this.currPage++;
        }
    });

    return new albumList(); 
});