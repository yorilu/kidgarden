/**
 *
 * @param event
 */
window.noscroll = function(event){
    event.preventDefault();
}
/**
 *
 * @param event
 */
;(function($, window, document){
    $(document).on("focus", "input, textarea", function(event){
        document.addEventListener("scroll", window.noscroll, false);
    }).on("blur", "input, textarea", function(){
        document.removeEventListener("scroll", window.noscroll, false);
    });
})(jQuery, window, document);
/**
 * 初始化localstorage
 */
;(function(window){
    var localStorage = window.localStorage;
    var globalConfig =  window.globalConfig;
    var locStoKey = globalConfig.locStoKey || "storage";
    var currLocalStorage = localStorage.getItem(locStoKey);
    if(!!currLocalStorage){
        return window.currLocStorage = JSON.parse(currLocalStorage);
    }
    $.sendAjax({
        type: "GET",
        url: globalConfig.urlPrefix + "/crm/get_storage",
        dataType: "json",
        async: false, //初始化需要同步获取
        processData: true,
        xhrFields: {
            withCredentials: true
        },
        success: function(res, textStatus, jqXHR) {
            if(res && res["storage"]){
                localStorage.setItem(locStoKey, JSON.stringify(res["storage"] || ""));
                window.currLocStorage = res["storage"];
            }
        },
        error: function(res, textStatus, jqXHR){
            //console.log("页面初始化出错，请重新刷新！");
        }
    });
})(window);
/**
 * @description: 自定义事件
 */
;(function($, window, document, undefined) {
    $.event.special.mtouchstart = {
        setup: function() {
            var ele = this;
            $.event.add(ele, 'touchstart', function(event) {
                var ths = event.originalEvent.touches[0];
                $.event.trigger('mtouchstart', {
                    'pagex': ths.pageX,
                    'pagey': ths.pageY
                }, ele);
            });
        }
    },
    $.event.special.mtouchmove = {
        setup: function() {
            var ele = this;
            $.event.add(ele, 'touchmove', function(event) {
                var ths = event.originalEvent.touches[0];
                // event.preventDefault();
                $.event.trigger('mtouchmove', {
                    'pagex': ths.pageX,
                    'pagey': ths.pageY
                }, ele);
            })
        }
    },
    $.event.special.mtouchend = {
        setup: function() {
            var ele = this;
            $.event.add(ele, 'touchend', function(event) {
                var touch = event.originalEvent.touches[0];
                $.event.trigger('mtouchend',null, ele);
            })
        }
    },
    $.event.special.fastclick = {
        setup: function() {
            var ele = this;
            $.event.add(ele, 'touchstart', function(event) {
                ele.move = 0;
            });
            $.event.add(ele, 'touchmove', function(event) {
                // event.preventDefault();
                ele.move = 1;
            })
            $.event.add(ele, 'touchend', function(event) {
                if (ele.move==0) {
                    $.event.trigger('fastclick', null, ele);
                }
            })
        }
    },
    $.event.special.swipeleft = {
        setup: function() {
            var ele = this;
            $.event.add(ele, 'touchstart', function(event) {
                ele.spagex = event.originalEvent.touches[0].pageX;
            });
            $.event.add(ele, 'touchend', function(event) {
                if (event.originalEvent.changedTouches[0].pageX - ele.spagex < -50) {
                    $.event.trigger('swipeleft', null, ele);
                }
            })
        }
    },
    $.event.special.swiperight = {
        setup: function() {
            var ele = this;
            $.event.add(ele, 'touchstart', function(event) {
                ele.spagex = event.originalEvent.touches[0].pageX;
            });
            $.event.add(ele, 'touchend', function(event) {
                if (event.originalEvent.changedTouches[0].pageX - ele.spagex > 50) {
                    $.event.trigger('swiperight', null, ele);
                }
            })
        }
    },
    $.event.special.swipeup = {
        setup: function() {
            var ele = this;
            $.event.add(ele, 'touchstart', function(event) {
                ele.spagey = event.originalEvent.touches[0].pageY;
            });
            $.event.add(ele, 'touchend', function(event) {
                if (event.originalEvent.changedTouches[0].pageY < (ele.spagey - 50)) {
                    $.event.trigger('swipeup', null, ele);
                }
            })
        }
    },
    $.event.special.swipedown = {
        setup: function() {
            var ele = this;
            $.event.add(ele, 'touchstart', function(event) {
                ele.spagey = event.originalEvent.touches[0].pageY;
            });
            $.event.add(ele, 'touchend', function(event) {
                if (event.originalEvent.changedTouches[0].pageY > (ele.spagey + 50)) {
                    $.event.trigger('swipedown', null, ele);
                }
            })
        }
    }
})(jQuery, window, document);

/**
 * @description: jQuery plugins
 */
;(function($, window, document, undefined){
    //动态插件
    $.fn.extend({
        swipedel: function(triggerPoint){
            function SwipeDelevent(elems){
                this.triggerPoint = triggerPoint || 60;
                this.sp = 0;
                this.ep = 0;
                this.elems = elems;
                this.timer = null;
                this.init();
            };
            SwipeDelevent.prototype = {
                constructor: SwipeDelevent,
                init: function(){
                    //
                    this.elems.on('touchstart', this.start.bind(this)).on('touchend', this.end.bind(this)).on('touchmove', this.move.bind(this));
                    //
                    this.elems.find('.delete').on('touchstart', function(event){
                        return false;
                    });
                },
                start: function(event){
                    this.sp = 0;
                    this.ep = 0;
                    document.body.addEventListener('touchmove',noscroll, false);
                    this.sp = event.originalEvent.changedTouches[0].pageX;
                },
                move: function(event){
                    clearTimeout(this.timer);
                    this.timer = setTimeout(function(){
                        this.mp = event.originalEvent.changedTouches[0].pageX;
                    }.bind(this), 10);
                },
                end: function(event){
                    var target = $(event.currentTarget).find(".box"), str = '';
                    //点击功能按钮时
                    if(target.hasClass('fa')){
                        target.click();
                        return false;
                    }
                    this.ep = event.originalEvent.changedTouches[0].pageX;
                    if((this.sp - this.ep) >= this.triggerPoint){
                        //打开另一项之前需要重置所有的项目
                        this.reset();
                        //
                        str = "-webkit-transform:translate3d(-"+this.triggerPoint+"px,0,0);transform:translate3d(-"+this.triggerPoint+"px,0,0)";
                    }
                    if((this.ep - this.sp) >= this.triggerPoint){
                        str = "-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)";
                    }
                    target.attr('style', str);
                    document.body.removeEventListener('touchmove',noscroll, false);
                },
                reset: function(){
                    this.elems.find(".box").each(function(idx, elem){
                        $(elem).attr("style","-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)");
                    });
                }
            }
            //
            new SwipeDelevent(this);
        },
        lazyload:function(options){
            var _this = this;
            var timer = null;
            $(window).scroll(function(){
                clearTimeout(timer);
                timer = setTimeout(function(){
                    var imgs = _this.find("img[data-lazy-src]");
                    var winhei = window.innerHeight;
                    imgs.each(function(idx, elem){
                        elem = $(elem);
                        var ftop = elem.offset().top;
                        var scrollTop = $(window).scrollTop();
                        if((ftop-scrollTop) < (winhei+50)){
                            elem.attr("src", elem.attr("data-lazy-src"));
                            elem.removeAttr("data-lazy-src");
                        }
                    });
                },10);
            });
            $(window).trigger("scroll");
        }
    });
    // 静态插件
    $.extend({
        gentoolbar: function(options){
            function GenBotToolBar(ops){
                this.mainTemp = ops.mainToolBarTemp || "";
                if(!this.mainTemp) {
                    return false;
                }
                this.localTemp = ops.localToolBarTemp || "";
                this.bodyElem = ops.bodyElem || $("body");
                this.listWidth = ops.listWidth || 170;
                this.pageId = ops.pageId || "";
                //
                this.mainTemp = this.mainTemp.replace("{{localtemp}}", (ops.localToolBarTemp || ""));
                this.mainElem = $(this.mainTemp);
                this.menuListPanel = this.mainElem.find("#J_menuListPanel");
                this.menubox = this.mainElem.find("#J_menubox");
                this.sy = 0;
                this.ey = 0;
                this.init();
            }
            GenBotToolBar.prototype = {
                constructor: GenBotToolBar,
                //初始化
                init: function(){
                    //当前页面设置标识
                    this.initActive();
                    //绑定事件
                    this.bindEvent();
                    //插入dom树
                    return this.mainElem.appendTo(this.bodyElem);
                },
                //用于类外部调节按钮显示
                setBtnItem: function(showkey){
                    var btns = this.mainElem.find("#J_btnlist a");
                    btns.hide().filter("[data-showkey="+showkey+"]").show();
                },
                initActive: function(){
                    this.mainElem.find("a[data-pageid="+this.pageId+"]").addClass("active");
                },
                //绑定事件
                bindEvent: function(){
                    var timer=null;
                    //返回上一步
                    this.mainElem.on("click", "#J_goBack", this._goBack.bind(this));
                    //显示菜单
                    this.mainElem.on("click", "#J_showMenuList", this._showMenuList.bind(this));
                    //隐藏菜单
                    this.mainElem.on("click", "#J_mask", this._hideMenuList.bind(this));
                    //按钮切换激活状态
                    this.mainElem.on("click", "#J_btnlist a", this._toggleBtnState.bind(this));
                    //
                    this.menubox.on("mtouchstart", function(event, data){
                        this.sy = data.pagey;
                    }.bind(this));
                    this.menubox.on("mtouchmove", function(event, data){
                        clearTimeout(timer);
                        timer = setTimeout(function(){
                            this.ey = data.pagey;
                            this.menubox.scrollTop(this.sy - this.ey);
                        }.bind(this), 100)
                    }.bind(this));
                },
                //拼装模版
                genGloTemp: function(){
                    return this.mainTemp.replace("{{localtemp}}", this.localTemp);
                },
                _goBack: function(){
                    window.history.go(-1);
                },
                _showMenuList: function(){
                    this.bodyElem.css({"overflow": "hidden"});
                    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
                    this.menuListPanel.show().find("#J_list").animate({"right": "0px"});
                },
                _hideMenuList: function(){
                    this.menuListPanel.find("#J_list").animate({"right": "-"+this.listWidth+"px"}, "fast", "linear", function(){
                        this.bodyElem.css({"overflow": "auto"});
                        document.removeEventListener('touchmove', function (e) { e.preventDefault(); }, false);
                        this.menuListPanel.hide()
                    }.bind(this));
                },
                _toggleBtnState: function(event){
                    var target = $(event.target);
                    var bros = target.siblings();
                    if(bros.length){
                        target.addClass("active").siblings().removeClass("active");
                    }
                }
            }
            //
            return new GenBotToolBar(options)
        },
        confirm: function(options) {
            var msg = options.msg;
            var callback = options.callback;
            var su = options.suretext ? options.suretext : '确定';
            var elem = '<div class="extendpop ptf hp100 wp100 z10"><div class="popbox pta ovh bdr3 bgcfff"><p class="text alic fs16 c66 lh20">' + msg + '</p><p class="btn confirm"><a href="javascript:;" data-do="no" class="alic dsb wp50 dsb fl fs16 c66">取消</a><a class="alic dsb wp50 dsb fl fs16 c66 cf" href="javascript:;" data-do="yes">' + su + '</a></p></div></div>';
            var pop = $('body').append(elem).find('.extendpop');
            $('.extendpop a[data-do="no"]').click(function() {
                pop.remove();
                callback(0);
            });
            $('.extendpop a[data-do="yes"]').click(function() {
                pop.remove();
                callback(1);
            });
        },
        alert: function(options) {
            var msg = options.msg;
            var elem = '<div class="extendpop ptf hp100 wp100 z10"><div class="popbox pta ovh bdr3 bgcfff"><p class="text alic fs16 c66 lh20">' + msg + '</p><p class="btn alert"><a class="alic dsb dsb fl fs16 c66" href="javascript:;" data-do="yes">确定</a></p></div></div>';
            var pop = $('body').append(elem).find('.extendpop');
            $('.extendpop a[data-do="yes"]').click(function() {
                pop.remove();
                if (options.callback) {
                    options.callback();
                }
            });
        },
        tipshow: function(options) {
            var msg = options.msg;
            var type = options.type ? options.type : 'info';
            var ico = options.ico ? options.ico : 'info-circle';
            var str = '<div class="tippop ptf z10 fs12 wp100 alic"><div class="dsilb fs12 text ' + type + '"><i class="fa fa-' + ico + '"></i>' + msg + '</div></div>';
            var pop = $('body').append(str).find('.tippop');
            //$('body').append(str);
            //var pop = $('.tippop');
            setTimeout(function() {
                pop.animate({
                    'opacity': 0
                }, 600, function() {
                    pop.remove();
                    if (options.callback) {
                        options.callback();
                    }
                });
            }, 1500);
        },
        tipshowopen: function(options) {
            var msg = options.msg;
            var type = options.type ? options.type : 'info';
            var ico = options.ico ? options.ico : 'info-circle';
            var str = '<div class="tippop ptf z10 fs12 wp100 alic"><div class="dsilb fs12 text ' + type + '"><i class="fa fa-' + ico + '"></i>' + msg + '</div></div>';
            $('body').append(str);
        },
        tipshowup: function(options) {
            var msg = options.msg;
            var type = options.type ? options.type : 'info';
            var ico = options.ico ? options.ico : 'info-circle';
            var pop = $('.tippop');
            pop.find('.text').html('<i class="fa fa-' + ico + '"></i>' + msg);
        },
        tipshowclose: function(options) {
            var msg = options.msg;
            var type = options.type ? options.type : 'info';
            var ico = options.ico ? options.ico : 'info-circle';
            var pop = $('.tippop');
            pop.find('.text').attr('class','text '+type);
            pop.find('.i').attr('class','fa fa-'+type);
            pop.find('.text').html('<i class="fa fa-' + ico + '"></i>' + msg);
            setTimeout(function() {
                pop.animate({
                    'opacity': 0
                }, 600, function() {
                    pop.remove();
                    if (options.callback) {
                        options.callback();
                    }
                });
            }, 1200);
        },
        tiplist: function(options) {
            $('.tiplistfixed').length <= 0 ? $('body').append('<div class="tiplistfixed"></div>') : '';
            var box = $('.tiplistfixed');
            var len = $('.tiplistfixed').children().length + 1;
            var msg = options.msg;
            var type = options.type ? options.type : 'info';
            var ico = options.ico ? options.ico : 'info-circle';
            var close = options.close ? '<i class="fa fa-times close"></i>' : '';
            var str = '<div class="item item' + len + '"><div class="text ' + type + '"><i class="fa fa-' + ico + '"></i>' + msg + '</div>' + close + '</div>';
            var self = box.append(str).find('.item' + len);
            //var self = box.find('.item' + len);
            if (options.close) {
                self.find('.close').click(function() {
                    self.remove();
                    if (options.callback) {
                        options.callback();
                    }
                    if (box.children().length == 0) {
                        box.remove();
                    }
                });
            } else {
                setTimeout(function() {
                    self.slideUp(600, function() {
                        self.remove();
                        if (options.callback) {
                            options.callback();
                        }
                        if (box.children().length == 0) {
                            box.remove();
                        }
                    });
                }, 3000);
            }
        },
        starting: function(options) {
            var text = options;
            $('.html').append('<div class="starting ptf z10 hp100 wp100 "><p class="pta wp100 lh26 alic cff"><img src="http://7xix4h.com1.z0.glb.clouddn.com/images/loading.gif" height="16">' + text + '</p></div>');
        },
        endingtext: function(options) {
            $('.starting p').html(options);
            setTimeout(function() {
                $('.starting').remove();
            }, 1000);
        },
        ending: function(options) {
            $('.starting').remove();
        },
        emptystart: function() {
            $('.html').html('<img src="http://7xix4h.com1.z0.glb.clouddn.com/images/loading.gif" height="16" class="emptystartimg">');
        },
        endempty: function() {
            $('.emptystartimg').remove();
        },
        bodyempty:function(elem){
            var tip = '<img class="ptf lp50 tp50" style="width:100px; margin:-37px 0 0 -50px; z-index:1;" src="http://7xix4h.com1.z0.glb.clouddn.com/images/empty.png">';
            if(elem){
                return elem.html(tip);
            }
            $('body').append(tip);
        },
        /**
         * 获取URI中的参数
         * @returns {{}}
         */
        getRequest: function(){
            var url = window.location.search,
                theRequest = {},
                str = '',
                para = [];
            if (url.indexOf("?") != -1) {
                str = url.substr(1);
                strs = str.split("&");
                for(var i = 0, len = strs.length; i < len; i ++) {
                    para = strs[i].split("=");
                    //decodeURI()、decodeURIComponent
                    theRequest[para[0]] = decodeURIComponent( (para.length>=2)?para[1]:"");
                }
            }
            return theRequest;
        },
        //  判断机型
        isAnd:function(){
            var u = window.navigator.userAgent;
             if(u.indexOf('Android') > -1 || u.indexOf('Linux') > -1){
                return 1;
             }else{
                return 0;
             }
        },
        /**
         * cookie 读与写
         * @param name cookie名（必选）必选
         * @param value cookie值（可选，有value时为写cookie，没有value时为读cookie）
         * @param options 写cookie时的可选属性(可选，包含expires, path, domain, secure)
         * @returns {*}
         */
        cookie: function (name, value, ops) {
            var doc = document;
            var CookieUtil = {
                get: function (name) {
                    var cookieName = encodeURIComponent(name) + "=",
                        cookieStart = doc.cookie.indexOf(cookieName),
                        cookieValue = null;
                    if (cookieStart > -1) {
                        var cookieEnd = doc.cookie.indexOf(";", cookieStart);
                        if (cookieEnd == -1) {
                            cookieEnd = doc.cookie.length;
                        }
                        cookieValue = decodeURIComponent(doc.cookie.substring(cookieStart + cookieName.length, cookieEnd));
                    }
                    return cookieValue;
                },
                set: function (name, value, expires, path, domain, secure) {
                    var cookieText = encodeURIComponent(name) + "=" + encodeURIComponent(value);
                    if (expires instanceof Date) {
                        cookieText += "; expires=" + expires.toGMTString();
                    }
                    if (path) {
                        cookieText += "; path=" + path;
                    }
                    if (domain) {
                        cookieText += "; domain=" + domain;
                    }
                    if (secure) {
                        cookieText += "; secure";
                    }
                    doc.cookie = cookieText;
                    return true;
                },
                unset: function (name, path, domain, secure) {
                    this.set(name, "", new Date(0), path, domain, secure);
                    return true;
                }
            };
            //value为undefined时，读cookie
            if (value === undefined)
                return CookieUtil.get(name);
            //value为""时，重置cookie
            if (value === "")
                return CookieUtil.unset(name, value, (ops && ops.path || null), (ops && ops.domain || null), (ops && ops.secure || null));
            //写cookie
            return CookieUtil.set(name, value, (ops && ops.expires || null), (ops && ops.path || null), (ops && ops.domain || null), (ops && ops.secure || null));

        },
        /**
         * cookie删除
         * @param name cookie名（必选）
         * @param options 删cookie时的可选属性 (可选，包含path, domain, secure)
         */
        removeCookie: function (name, options) {
            if (!name) return false;
            return $.cookie(name, "", options);
        },
        /**
         * 详见jquery api
         * beforeSend 在发送请求之前调用，并且传入一个XMLHttpRequest作为参数。
         * dataFilter 在请求成功之后调用。传入返回的数据以及"dataType"参数的值。并且必须返回新的数据（可能是处理过的）传递给success回调函数。
         * success 当请求之后调用。传入返回后的数据，以及包含成功代码的字符串。
         * complete 当请求完成之后调用这个函数，无论成功或失败。传入XMLHttpRequest对象，以及一个包含成功或错误代码的字符串
         */
        //sendAjax: function(option){
        //    var _this = option.scope || window;
        //    $.ajax({
        //        "url": option.url,
        //        "type": option.type || "GET",
        //        "async": option.async || true,
        //        "cache": option.cache || true,
        //        "traditional": option.traditional || true,
        //        "contentType": option.contentType || "application/x-www-form-urlencoded",
        //        "data": option.data || '',
        //        "processData": option.processData || true,
        //        "xhrFields": option.xhrFields || {
        //            withCredentials: true
        //        },
        //        "beforeSend": option.beforeSend || function(){},
        //        "error": option.error || function(){},
        //        "success": function(res, textStatus, jqXHR){
        //            //更新localstorage最新状态
        //            var localStorage = $.refLocStoNewest(res) || {};
        //            option.success.call(option.scope, res, textStatus, jqXHR, localStorage);
        //        },
        //        "complete": option.complete || function(){ }
        //    });
        //},
        //refLocStoNewest: function(data){
        //    var locSto = window.localStorage,
        //        locData = locSto.getItem("storage"),
        //        newLocData = (data&&data["storage"]) || null;
        //    if(!!newLocData){
        //        locSto.setItem("storage", JSON.stringify(newLocData));
        //        return newLocData;
        //    }
        //    return locData ? JSON.parse(locData) : {};
        //},
        /**
         *
         * @param n
         * @returns {*}
         */
        formatDay: function(n){
            return (parseInt(n, 10) >= 10) ? n : "0"+(parseInt(n, 10));
        },
        /**
         * 格式化时间
         * @param time
         * @param format
         * @returns {*} "yyyy-MM-dd hh:mm:ss"
         */
        formatDate:function(time, format){
            if(!time || !format) return "";
            var date = "";
            if(/^\d+$/.test(time)){
                date = new Date(+(time));
            }else{
                date = new Date(time.replace(/-/g,"/"));
            }
            var o = {
                "M+": date.getMonth() + 1, //month
                "d+": date.getDate(), //day
                "h+": date.getHours(), //hour
                "m+": date.getMinutes(), //minute
                "s+": date.getSeconds(), //second
                "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
                "S": date.getMilliseconds() //millisecond
            };
            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(format)){
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
                }
            }
            return format;
            /*
            var date = new Date(time*1000);
            format = format.replace('y',date.getFullYear());
            format = format.replace('m',(date.getMonth()+1)<10?"0"+(date.getMonth()+1):(date.getMonth()+1));
            format = format.replace('d',date.getDate()<10?"0"+date.getDate():date.getDate());
            format = format.replace('h',date.getHours()<10?"0"+date.getHours():date.getHours());
            format = format.replace('i',date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes());
            return format;
            */
        },
        /**
         * parent 或 teacher 的id取phone
         * @param e localstorage
         * @param id
         * @returns {*}
         */
        getPhoneById: function(id, e){
            e = e || window.currLocStorage || JSON.parse(window.localStorage(window.globalConfig.locStoKey));
            if(!e || !id) return '';
            if(e[id]){
                if(e[id]["contact_info"]) {
                    return e[id]["contact_info"]["mobi"] || "";
                }
            }
            return "";
        },
        /**
         * child或teacher 的id取name
         * @param e localstorage
         * @param id
         * @returns {*}
         */
        getNameById: function(id, e){
            e = e || window.currLocStorage || JSON.parse(window.localStorage(window.globalConfig.locStoKey));
            if(!e || !id) return '';
            if(e[id]){
                if(e[id]["name"]){
                    return e[id]["name"] || "";
                }
            }
            return "";
        },
        /**
         * 用child id 获取
         * @param e
         * @param id
         * @returns {*}
         */
        getChildNameByParentId: function(id, e){
            e = e || window.currLocStorage || JSON.parse(window.localStorage(window.globalConfig.locStoKey));
            if(!e || !id) return '';
            if(e[id] && e[id]["child"]){
                return e[id]["child"]["name"] || "";
            }
            return ""
        },
        /**
         * 用class id 取child_ids
         * @param e
         * @param id
         * @returns {*}
         */
        getChildIdsByClassId: function(id, e){
            e = e || window.currLocStorage || JSON.parse(window.localStorage(window.globalConfig.locStoKey));
            if(!e || !id) return [];
            if(e[id]){
                if(e[id]["child_ids"])
                    return e[id]["child_ids"] || [];
            }
            return [];
        },
        /**
         * 用class id获取 teacher ids
         * @param e
         * @param id
         * @returns {*}
         */
        getTeacherIdsByClassId: function(id, e){
            e = e || window.currLocStorage || JSON.parse(window.localStorage(window.globalConfig.locStoKey));
            if(!e || !id) return '';
            if(e[id]){
                if(e[id]["teacher_ids"])
                    return e[id]["teacher_ids"] || [];
            }
            return "";
        },
        /**
         * 用parents ID取Relation
         * @param e
         * @param id
         * @returns {string}
         */
        getRelationByParentId: function(id, e){
            e = e || window.currLocStorage || JSON.parse(window.localStorage(window.globalConfig.locStoKey));
            if(!e || !id) return '';
            if(e[id]){
                var role = e[id]["relation"]>-1 ? e[id]["relation"] : 0;
                if(role === 0) return "妈妈";
                if(role === 1) return "爸爸";
                if(role === 2) return "爷爷";
                if(role === 3) return "奶奶";
                if(role === 4) return "叔叔";
                if(role === 5) return "阿姨";
                if(role === 6) return "其他";
            }
            return "";
        },
        /**
         * 用parent id 取 child info
         * @param e
         * @param id
         * @returns {*}
         */
        getChildInfoByParentId: function(id, e){
            e = e || window.currLocStorage || JSON.parse(window.localStorage(window.globalConfig.locStoKey));
            if(!e || !id) return '';
            if(e[id] && e[id]["child"]){
                if(e[id]["child"]["_id"] || e[id]["child"]["name"]){
                    return e[id]["child"];
                }
            }
            return "";
        },
        /**
         * 用parent id 取 child id
         * @param e
         * @param id
         * @returns {*}
         */
        getChildIdByParentId: function(id, e){
            e = e || window.currLocStorage || JSON.parse(window.localStorage(window.globalConfig.locStoKey));
            if(!e || !id) return '';
            if(e[id] && e[id]["child"]){
                return e[id]["child"]["_id"] || "";
            }
            return "";
        },
        /**
         * 用child id获取parent ids
         * @param e
         * @param id
         * @returns {*}
         */
        getParentIdsByChildId: function(id, e){
            e = e || window.currLocStorage || JSON.parse(window.localStorage(window.globalConfig.locStoKey));
            if(!e || !id) return [];
            if(e[id] && e[id]["parent_ids"]){
                return e[id]["parent_ids"] || [];
            }
            return [];
        },
        /**
         * 用id 获取信息
         * @param e
         * @param id
         * @returns {*}
         */
        getInfoById: function(e, id){
            if(!e || !id) return {};
            if(e[id]){
                return e[id];
            }
            return {};
        },
        /**
         * 取当前用户的user_id
         * @param e
         * @returns {*}
         */
        getCurrUserId: function(e){
            e = e || window.currLocStorage || JSON.parse(window.localStorage(window.globalConfig.locStoKey));
            if(e && e["curr"] && e["curr"]["_id"]){
            	return e["curr"]["_id"];
            }
            return "";
        },
        /**
         * 取当前用户的class_id
         * @param e
         * @returns {*}
         */
        getCurrClassId: function(e){
            e = e || window.currLocStorage || JSON.parse(window.localStorage(window.globalConfig.locStoKey));
            if(e && e["curr"] && e["curr"]["class_id"]){
            	return e["curr"]["class_id"];
            }
            return "";
        },
        /**
         * 取当前用户的kg_id
         * @param e
         * @returns {*}
         */
        getCurrKgId: function(e){
            e = e || window.currLocStorage || JSON.parse(window.localStorage(window.globalConfig.locStoKey));
            if(e && e["curr"] && e["curr"]["kg_id"]){
            	return e["curr"]["kg_id"];
            }
            return "";
        },
        /**
         * 取当前用户的relation（家长0-6, 教师为null）
         * @param e
         * @returns {*}
         */
        getCurrRelation: function(e){
            e = e || window.currLocStorage || JSON.parse(window.localStorage(window.globalConfig.locStoKey));
            if(e && e["curr"] && (e["curr"]["relation"] !== null)){
            	return e["curr"]["relation"];
            }
            return  null;
        }
    });
})(jQuery, window, document);
/**
 * 照片滑动
 */
var PhotoSwipt = (function($, window, document, undefined){
    function PhotoSwipt(options) {
        var _this = this;
        var ele = $(options.element);
        this.ele = ele;
        this.box = ele.find('.list');
        this.len = ele.find('.ls').length;
        this.botline = ele.find('.botdo');
        this.closeimg = ele.find('.closeimg');
        this.winw = $(window).width();
        this.winh = $(window).height();
        this.eq = 0;
        this.pagex = 0;
        var pagex = 0;
        var chax = 0;
        this.key =0;
        this.stylestr = "width:" + this.len * this.winw + "px;-webkit-transition: -webkit-transform 0.4s;transition:transform 0.4s;-webkit-transform:-webkit-translate3d(" + this.eq * this.winw + "px,0,0);transform:translate3d(" + this.eq * this.winw + "px,0,0)";
        this.box.attr('style', this.stylestr);
        //
        ele.on('click', 'img', function() {
            if(!_this.isMe){return false};
            _this.botline.slideToggle();
        }).on('click', '.collect', function() {
            options.colCallBack.call(options.scope, _this.key);
            return false;
        }).on('click', '.delete', function() {
            //_this.delet(_this.key);
            options.delCallBack.call(options.scope, _this.key);
            return false;
        });
        this.closeimg.click(function() {
            ele.animate({
                'left': _this.winw
            }, 400);
            document.removeEventListener('touchmove',noscroll, false);
        });
        ele.on('mtouchstart', function(event, data) {
            pagex = data.pagex;
        }).on('mtouchend',function(){
            if (chax < 50 && chax > -50 && chax != 0) {
                _this.box.attr('style', "width:" + _this.len * _this.winw + "px;-webkit-transition: -webkit-transform 0.4s;transition:transform 0.4s;-webkit-transform:translate3d(" + (_this.eq * _this.winw) + "px,0,0);transform:translate3d(" + (_this.eq * _this.winw) + "px,0,0)");
            }
        }).on('mtouchmove', function(event, data) {
            var cx = data.pagex - pagex;
            chax = cx;
            var str = "width:" + _this.len * _this.winw + "px;" +
                '-webkit-transition-timing-function: cubic-bezier(0.42,0,0.58,1); ' +
                'transition-timing-function: cubic-bezier(0.42,0,0.58,1); ' +
                '-webkit-transition-duration: 0ms; ' +
                'transition-duration: 0ms; ' +
                "-webkit-transform: translate(" + (_this.eq * _this.winw + cx) + "px, 0px);" +
                "transform: translate(" + (_this.eq * _this.winw + cx) + "px, 0px);";
            _this.box.attr('style', str);
            return;

        }).on('swipeleft', function(event) {
            if (_this.eq + _this.len >= 2) {
                _this.eq--;
            }
            _this.showcenter(_this.imgs.eq(-_this.eq),_this.winw, _this.winh);
            _this.key = _this.imgs.eq(-_this.eq).data('key');
            _this.box.attr('style', "width:" + _this.len * _this.winw + "px;" +
                '-webkit-transition-timing-function: cubic-bezier(0.1, 0.57, 0.1, 1); ' +
                'transition-timing-function: cubic-bezier(0.1, 0.57, 0.1, 1); ' +
                "-webkit-transition: -webkit-transform 0.4s;" +
                "transition:transform 0.4s;" +
                "-webkit-transform:translate3d(" + (_this.eq * _this.winw) + "px, 0px, 0px);" +
                "transform:translate3d(" + (_this.eq * _this.winw) + "px, 0px, 0px)");

        }).on('swiperight', function(event) {
            if (_this.eq < 0) {
                _this.eq++;
            }
            _this.showcenter(_this.imgs.eq(-_this.eq),_this.winw, _this.winh);
            _this.key = _this.imgs.eq(-_this.eq).data('key');
            _this.box.attr('style', "width:" + _this.len * _this.winw + "px;" +
                '-webkit-transition-timing-function: cubic-bezier(0.1, 0.57, 0.1, 1); ' +
                'transition-timing-function: cubic-bezier(0.1, 0.57, 0.1, 1); ' +
                "-webkit-transition: -webkit-transform 0.4s;" +
                "transition:transform 0.4s;" +
                "-webkit-transform:translate3d(" + (_this.eq * _this.winw) + "px, 0px, 0px);" +
                "transform:translate3d(" + (_this.eq * _this.winw) + "px, 0px, 0px)");
        });
        return _this;
    }
    PhotoSwipt.prototype = {
        constructor: PhotoSwipt,
        initialbox: function() {
            if(this.len===0){
                this.ele.animate({
                'left': this.winw
                }, 400);
                document.removeEventListener('touchmove',noscroll, false);
                return false;
            }
            if(this.len+this.eq){
                this.stylestr = "width:" + this.len * this.winw + "px;" +
                    "left:"+(this.eq*this.winw)+"px";
            }else{
                this.stylestr = "width:" + this.len * this.winw + "px;" +
                    "left:"+((this.eq+1)*this.winw)+"px";
            }
            
            this.box.attr('style', this.stylestr);
            this.imgs = this.ele.find('.list img');
            this.showcenter(this.imgs.eq(-this.eq),this.winw, this.winh);
            this.key = this.imgs.eq(-this.eq).data('key');
            this.botline.slideDown();
            if(!(this.len+this.eq)){
                this.eq++
            }
            document.addEventListener('touchmove', noscroll, false);
            this.ele.animate({
                'left': 0
            });
        },
        showcenter: function (img,w,h){
            var s = h/w;
            if(img.data('src')!="no"){
                var nimg = new Image;
                var src = img.data('src')
                nimg.src = src;
                nimg.onload = function() {
                    var iw = this.width;
                    var ih = this.height;
                    var is = ih/iw;
                    if(is>s && ih>h){
                        img.attr({'src':src,'style':'height:'+h+'px;' +
                            'display:none;'
                        });
                        img.data('src','no');
                        img.fadeIn();
                    }else if(is<s && iw>w){
                        img.attr({'src':src,'style':'width:'+w+'px;' +
                            'margin-top:'+((h-ih*w/iw)/2)+'px;' +
                            'display:none;'
                        });
                        img.data('src','no');
                        img.fadeIn();
                    }else{
                        img.attr({'src':src,'style':'margin-top:' + Math.ceil((h-ih)/2) + 'px;width:'+iw+'px;display:none;'});
                        img.data('src','no');
                        img.fadeIn();
                    }
                }
            }
        }
    }
    return PhotoSwipt;
})(jQuery, window, document);