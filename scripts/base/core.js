/**
 * 负责基础模块功能
 *
 * @author mingxin.huang
 * @update 2015.05.31
 */

define(function (require) {
    var _ = require('underscore'),
        config = require('base/config');

    /**
     * 获取对应的请求或者文件地址
     * @param  {String} url  出入的地址
     * @param  {String} type 地址类型
     * @return {String}      拼接好的地址
     */
    function getRoot (url, type) {
        type = type || 'api';

        return 'http://'+config.root[type]+(type === 'api' ? '/crm':'')+'/'+url;
    }

    /**
     * 当前是否是发布版本
     * @return {Boolean} [description]
     */
    function isRelease () {
        return config.mode === 'release';
    }

    /**
     * 调试
     */
    function debug () {
        if (isRelease()) {
            return;
        }

        console.log.apply(console, arguments);
    }

    /**
     * @description 占位符格式化
     * @param {String} str 需要替换的模板
     * @param {Object} params 参数
     * @param {Boolean} isEncode 是否编码
     * @eg demo("http://www.baidu.com?name={name}&age={age}&chanelid={chanelid}",{name:"demo",age:23,chanelid:100},false)
     * @return {String} str 返回结果 http://www.baidu.com?name=demo&age=23&chanelid=100
     */
    function formatByVal (str, params, isEncode) {
        if (typeof params == "object") {
            for (var key in params) {
                if (!_.has(params, key) || params[key] == "undefined" || params[key] == "null") {
                    params[key] = "";
                }
                str = str.replace(new RegExp("\\{" + key + "\\}", "ig"), isEncode ? encodeURIComponent(params[key]) : params[key]);
            }
        }
        return str.replace(/\{\w*\}/ig, "");
    }

    /**
     * 公用同步数据方法，重写model默认sync方法
     * @param  {[type]} method  [description]
     * @param  {[type]} model   [description]
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    function sync (method, model, options) {
        var params = _.extend({
            type : 'GET',
            url : url,
            processData : false,
            // contentType : 'application/json',
            xhrFields : {
                withCredentials : true
            }
        }, options);

        // 处理url，get请求填充url上的数据
        var url = typeof model.url === 'string' ? model.url : options.url;

        if (!url)  {
            return;
        }

        url = url.indexOf('http') > -1 ? url : getRoot(url);
        url = formatByVal(url, options.data);
        params.url = url;

        if (params.type.toLowerCase() === 'get') {
            params.data = null;
        } else {
            params.data = JSON.stringify({data : params.data});
        }

        return $.ajax(params);
    }

    /**
     * 获取数据
     * @param  {[type]} options [description]
     */
    function getResult (options) {
        return sync('', {}, options);
    }

    /**
     * 获取用户头像地址 
     * @param  {Number} _id 用户ID
     * @return {String}     用户头像地址
     */
    function getAvatar (_id) {
        return getRoot('avatar/'+_id, 'cdnAvatar');
    }

    /**
     * 获取图片地址
     * @param  {String} key  图片在七牛上的key
     * @param  {String} type 类型 s/m
     * @return {String}      图片地址
     */
    function getImg (key, type) {
        type = type || 's';

        return getRoot(key+'-'+type, 'cdnAvatar');
    }

    /**
     * 格式化时间，按照不同的格式返回不同的字符串
     * @param  {Number} time   时间戳，如果不传，或者为null，则为当前时间
     * @param  {String} format 字符串格式 (Y:年, M:月, D:日, h:小时, m:分钟, s:秒)
     * @return {String}        字符串
     */
    function formatTime (time,format) {
        // format = format || "yyyy-MM-dd hh:mm";
        format = format || "yyyy-MM-dd hh:mm:ss";

        var datetime = time ? new Date(time) : new Date(),
            o = {
                "M+": datetime.getMonth() + 1, //month
                "d+": datetime.getDate(), //day
                "h+": datetime.getHours(), //hour
                "m+": datetime.getMinutes(), //minute
                "s+": datetime.getSeconds(), //second
                "q+": Math.floor((datetime.getMonth() + 3) / 3), //quarter
                "S": datetime.getMilliseconds() //millisecond
            };

        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (datetime.getFullYear() + "").substr(4 - RegExp.$1.length));
        }

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }

        return format;
    }

    /**
     * 获取规定格式的时间表示法
     * @param  {Number} time 时间戳
     * @return {String}      今天发布的：今天11：00
     *                       昨天发布的： 昨天11：00
     *                       本年超过昨天发布的：  X月X日11：00
     *                       非本年发布的：  XXXX年X月X日11：00
     */
    function getTime (time) {
        var dateTime = time ? new Date(time) : new Date(),
            now = new Date(),
            yesterDay = new Date(now.getTime()-86400000),
            dateTimeOP = formatTime(dateTime, 'yyyy年MM月dd日 hh:mm'),
            nowOP = formatTime(now, 'yyyy年MM月dd日 hh:mm'),
            yesterDayOP = formatTime(yesterDay, 'yyyy年MM月dd日 hh:mm');

        if (dateTimeOP.split(' ')[0] === nowOP.split(' ')[0]) {
            return '今天 '+dateTimeOP.split(' ')[1];
        }

        if (dateTimeOP.split(' ')[0] === yesterDayOP.split(' ')[0]) {
            return '昨天 '+dateTimeOP.split(' ')[1];
        }

        if (dateTimeOP.slice(0, 4) === nowOP.slice(0, 4)) {
            return dateTimeOP.slice(5);
        }

        return dateTimeOP;
    }


    var loadedCss = [];
    /**
     * 加载css文件
     * @param  {String} file css文件名
     */
    function loadCss (file) {
        if (loadedCss.indexOf(file) > -1) {
            return;
        }

        loadedCss.push(file);

        var $head = $('head'),
            path = '/styles/'+file+'.css';

        if (!isRelease()) {
            path += ('?_='+new Date().getTime());
        }

        $head.append('<link rel="stylesheet" href="'+path+'" />')
    }

    /**
     * 设置cookie
     * @param {[type]} cname  [description]
     * @param {[type]} cvalue [description]
     * @param {[type]} exdays [description]
     */
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }

    return {
        getRoot    : getRoot,
        isRelease  : isRelease,
        debug      : debug,
        sync       : sync,
        getAvatar  : getAvatar,
        getImg     : getImg,
        formatTime : formatTime,
        loadCss    : loadCss,
        setCookie  : setCookie,
        getResult  : getResult,
        getTime    : getTime
    };
 });