/**
 * 微信服务端通信
 */
;(function($, window, document, undefined){
    var MainSign = {
        _wxInfo: {},
        _globalConfig: window.globalConfig,
        _getWxInfo: function(callback){
            var _this = this;
            var url = window.location.href.split('#')[0];
            var ts = ((new Date()).getTime()+'').substr(0, 10);
            $.sendAjax({
                "type": "GET",
                "url": _this._globalConfig.urlPrefix+'/wx/signature/sign?url=' + url + '&timestamp=' + ts,
                "dataType": "json",
                "success": function(res) {
                    //获取状态码
                    if(res.code !== 0){
                        return false;
                    }
                    var localWxInfo = JSON.parse(window.localStorage.getItem("wxInfo")) || {};
                    localWxInfo[window.location.href.split('#')[0]] = {
                        noncestr: res.data.noncestr,
                        signature: res.data.signature,
                        ts: ts
                    };
                    window.localStorage.setItem("wxInfo", JSON.stringify(localWxInfo));
                    //
                    callback.call(_this, res.data.noncestr, res.data.signature, ts);
                },
                error:function(){
                    alert('系统参数错误，部分功能无法正常运行，请稍后再试···')
                }
            });
        },
        _genWxConfig: function(noncestr, signature, ts){
            var jsApiList = [];
            if(window.jsApiLists && window.jsApiLists.length){
                jsApiList = this._globalConfig.jsApiList.concat(window.jsApiLists);
            }else {
                jsApiList = this._globalConfig.jsApiList;
            }
            wx.config({
                debug: true,
                appId: this._globalConfig.appId,
                timestamp: ts,
                nonceStr:  noncestr,
                signature:  signature,
                jsApiList: jsApiList
            });
            //
            this._hideOptionMenu();
        },
        _hideOptionMenu:function(){
            //隐藏右上角菜单
            wx.ready(function(){
                wx.hideOptionMenu();
            });
        },
        _weChatAuto: function(_mustAjaxArr){
            //某些重要页面依赖微信的接口，安全起见都去后端获取签名，不从localstorage中查找
            var url = window.location.href.split('#')[0];
            for(var i= 0, len=_mustAjaxArr.length; i<len; i++){
                if(url.indexOf(_mustAjaxArr[i]) !== -1){
                    //ajax获取签名
                    this._getWxInfo(this._genWxConfig);
                    return;
                }
            }
            var exInfo = window.localStorage.getItem("wxInfo") || "";
            //判断localstorage是否已经存在
            if(exInfo){
                this._wxInfo = JSON.parse(exInfo);
                var info = this._wxInfo[window.location.href.split('#')[0]] || null;
                if(info && info["noncestr"] && info["signature"] && info["ts"]){
                    //配置中获取
                    this._genWxConfig(info["noncestr"], info["signature"], info["ts"])
                    return true;
                }
            }
            //ajax获取签名
            //this._getWxInfo(this._genWxConfig);
            return true;
        },
        _initWxInfo: function(){
            //已经存在直接跳过
            if(window.localStorage.getItem("wxInfo")){
                return true;
            }
            //设置localstorage
            if(window.globalConfig && window.globalConfig.wxInfo){
                window.localStorage.setItem("wxInfo", JSON.stringify(window.globalConfig.wxInfo));
            }
        },
        init: function(){
            var _mustAjaxArr = [
                "/p-editinfo.html",
                "/t-editinfo.html",
                "/t-messagenew.html",
                "/t-messageshow.html",
                "/p-messageshow.html",
                "/t-sharet.html",
                "/p-share.html"
            ];
            //从配置中读取微信签名内容，填充到localstorage中，以备后用
            this._initWxInfo();
            //初始化
            this._weChatAuto(_mustAjaxArr);
        }
    };
    //
    MainSign.init();
    //var wxn = '',
    //    wxs = '',
    //    networkType,
    //    wxu = location.href.split('#')[0],
    //    wxt = String(new Date().getTime()).substr(0, 10);
    //$.sendAjax({
    //    "type": "GET",
    //    "url": window.globalConfig.urlPrefix+'/wx/signature/sign?url=' + wxu + '&timestamp=' + wxt,
    //    "dataType": 'json',
    //    "processData": true,
    //    "xhrFields": {
    //        withCredentials: true
    //    },
    //    "success": function(data) {
    //        wxs = data.data.signature;
    //        wxn = data.data.noncestr;
    //        wx.config({
    //            debug: false,
    //            appId: window.globalConfig.appId,
    //            timestamp: wxt,
    //            nonceStr: wxn,
    //            signature: wxs,
    //            jsApiList: window.jsApiList
    //        });
    //        //隐藏右上角菜单
    //        wx.ready(function(){
    //            wx.hideOptionMenu();
    //        });
    //    },
    //    error:function(){
    //        console.log(arguments)
    //        alert('系统参数错误，部分功能无法正常运行，请稍后再试···')
    //    }
    //});
})(jQuery, window, document);