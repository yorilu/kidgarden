/**
 * 日期控件
 */
var DatePicker = (function($, window, document, undefined){
    function DatePicker(options){
        var _this = this;
        var target = options.target;
        _this.options = options;
        _this.nowtime = options.defaultdate ? new Date(options.defaultdate.replace(/\-/ig,'/')) : new Date();
        _this.showtype = options.showtype;
        _this.daygroup = options.daygroup;
        _this.dayarr = [];
        if(_this.showtype=="scroll"){
            var len = $('.datepicker').length;
            _this.dom = _this.creatdom(options,len);
            $('body').append(_this.dom);
            var ele = $('.datepicker'+len);
            _this.gr(ele);
            if(_this.day){
                var v = _this.nowtime.getMonth()+1;
                if(v==2){
                    _this.day.find('.o').removeClass('o');
                    if(_this.nowtime.getFullYear()%4){
                        _this.day.find('li:gt(27)').addClass('o');
                    }else{
                        _this.day.find('li:gt(28)').addClass('o');
                    }
                }else if(v==1||v==3||v==5||v==7||v==8||v==10||v==12){
                    _this.day.find('li').removeClass('o');
                }else{
                    _this.day.find('li').removeClass('o');
                    _this.day.find('li:gt(29)').addClass('o');
                }
            };
            _this.cal = ele.find('.dp-cal');
            _this.sure = ele.find('.dp-sure');
            _this.ls = ele.find('.list');
            _this.ls.each(function(i,n){
                var $this = $(this);
                var ul = $this.find('ul');
                var li = ul.find('li');
                var num = parseInt($this.attr('data-num'));
                var type = $this.attr('data-type');
                var aty = 0;
                var sy =0;
                var ey = 0;
                var my = 0;
                $this.on('touchstart',function(event){
                    sy = event.originalEvent.touches[0].pageY;
                    my = event.originalEvent.touches[0].pageY;
                    aty = parseInt($this.attr('data-aty'));
                    if(type=="d"){
                        num = 31-$this.find('.o').length;
                    }
                }).on('touchmove',function(event){
                    my = event.originalEvent.touches[0].pageY;
                    ul.attr('style', "-webkit-transform:translate3d(0,"+(aty+my-sy)+"px,0);transform:translate3d(0,"+(aty+my-sy)+"px,0)");
                }).on('touchend',function(){
                    aty = aty+my-sy;
                    aty = Math.round(aty/30)*30;
                    if(aty>=60){
                        aty=60;
                    };
                    if(aty<=(3-num)*30){
                        aty=(3-num)*30;
                    };
                    if(type=="m" && _this.day){
                        var v = (60-aty)/30+1;
                        if(v==2){
                            _this.day.find('li').removeClass('o');
                            if(parseInt(_this.year.find('li').eq(2-parseInt(_this.year.attr('data-aty'))/30).html())%4){
                                _this.day.find('li:gt(27)').addClass('o');
                            }else{
                                _this.day.find('li:gt(28)').addClass('o');
                            }
                        }else if(v==1||v==3||v==5||v==7||v==8||v==10||v==12){
                            _this.day.find('li').removeClass('o');
                        }else{
                            _this.day.find('li').removeClass('o');
                            _this.day.find('li:gt(29)').addClass('o');
                        }
                    };
                    ul.attr('style', "-webkit-transform:translate3d(0,"+(aty)+"px,0);transform:translate3d(0,"+(aty)+"px,0);-webkit-transition: -webkit-transform 0.4s;transition:transform 0.4s;");
                    $this.attr('data-aty',aty);
                });
            });
            _this.cal.click(function(){
                ele.hide();
                document.body.removeEventListener('touchmove',noscroll, false);
            });
            _this.sure.click(function(){
                var out = options.timeformat;
                if(_this.year){
                    var v = _this.year.find('li').eq(2-parseInt(_this.year.attr('data-aty'))/30).html();
                    out = out.replace('y',v);
                }
                if(_this.month){
                    var v = _this.month.find('li').eq(2-parseInt(_this.month.attr('data-aty'))/30).html();
                    v = v.length==1?'0'+v:v;
                    out = out.replace('m',v);
                }
                if(_this.day){
                    var v = _this.day.find('li').eq(2-parseInt(_this.day.attr('data-aty'))/30).html();
                    v = v.length==1?'0'+v:v;
                    out = out.replace('d',v);
                }
                if(_this.hours){
                    var v = _this.hours.find('li').eq(2-parseInt(_this.hours.attr('data-aty'))/30).html();
                    v = v.length==1?'0'+v:v;
                    out = out.replace('h',v);
                }
                if(_this.min){
                    var v = _this.min.find('li').eq(2-parseInt(_this.min.attr('data-aty'))/30).html();
                    v = v.length==1?'0'+v:v;
                    out = out.replace('i',v);
                }
                $(target).val(out);
                $(target).change();
                ele.hide();
                document.body.removeEventListener('touchmove',noscroll, false);
            });
            $(target).click(function(){
                document.body.addEventListener('touchmove',noscroll, false);
                ele.show();
            });
        }else if(_this.showtype=="cover" || _this.showtype=="indiv"){
            _this.month = _this.nowtime.getMonth()+1;
            _this.year = _this.nowtime.getFullYear();
            _this.prevtext = options.prevtext?options.prevtext:"&lt;";
            _this.nexttext = options.nexttext?options.nexttext:"&gt;";
            _this.monthtext = options.monthtext?options.monthtext:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
            _this.weektext = options.weektext?options.weektext:["日","一","二","三","四","五","六"];
            var len = $('.datepickerdiv').length;
            _this.dom = _this.creatdomdiv(len);
            // _this.dayarr.push(_this.year+'/'+_this.month+'/'+_this.nowtime.getDate());
            $(options.target).append(_this.dom);
            var ele = $('.datepickerdiv'+len);
            _this.ele = ele;
            _this.close = ele.find('.dp-close');
            _this.tds = ele.find('td');
            _this.prevbtn = ele.find('.prev');
            _this.nextbtn = ele.find('.next');
            options.prev==0?_this.prevbtn.hide():'';
            options.next==0?_this.nextbtn.hide():'';
            _this.spanyear = ele.find('.year');
            _this.monthspan = ele.find('.m');
            _this.namespan = ele.find('.name');
            _this.tdclick();
            _this.prevbtn.click(function(){
                _this.monthchange('prev');
            });
            _this.nextbtn.click(function(){
                _this.monthchange('next');
            });
            _this.close.click(function(){
                if(options.close==1){
                    $(target).hide();
                }
            });
        }
    };
    DatePicker.prototype = {
        constructor: DatePicker,
        creatdom:function(options,len){
            return '<div class="datepicker datepicker'+len+' dsb ptf z3 hp100 wp100 " style="display:none;">\
			<div class="dpls dpls'+(options.timegroup.split("-").length)+' pta b0 wp100 cff bgcfff z2">'+this.timels(options.timegroup)+'</div>\
			<p class="dp-btn pta wp100 b0 z5">\
				<a href="javascript:;" class="dp-cal dsb fl wp50 alic cff fwb">取消</a>\
				<a href="javascript:;" class="dp-sure dsb fl wp50 bd-l alic cff fwb">确定</a>\
			</p>\
		</div> ';
        },
        gr:function(obj){
            if($(obj).find('div[data-type="y"]').length>0){
                this.year = $(obj).find('div[data-type="y"]');
            }
            if($(obj).find('div[data-type="m"]').length>0){
                this.month = $(obj).find('div[data-type="m"]');
            }
            if($(obj).find('div[data-type="d"]').length>0){
                this.day = $(obj).find('div[data-type="d"]');
            }
            if($(obj).find('div[data-type="h"]').length>0){
                this.hours = $(obj).find('div[data-type="h"]');
            }
            if($(obj).find('div[data-type="i"]').length>0){
                this.min = $(obj).find('div[data-type="i"]');
            }
        },
        timels:function(g){
            var str = '';
            var arr = g.split("-");
            for(var x=0;x<arr.length;x++){
                if(arr[x]=="y"){
                    var ystr = '';
                    for(var z=2029; z>=1970; z--){
                        ystr += '<li class="dp-option">'+z+'</li>';
                    }
                    var n = this.nowtime.getFullYear()-2029+2;
                    var style = "-webkit-transform:translate3d(0,"+(n*30)+"px,0);transform:translate3d(0,"+(n*30)+"px,0)";
                    str+='<div class="dp-select"><p class="th fs18 fwb c33 alic">年</p><span class="sp pta z4 dsb bd-t bd-b"></span><div class="list cff alic ptr ovh z4" data-num="60" data-type="y" data-aty="'+(n*30)+'"><ul style="'+style+'" class="dp-options ovh ptr z2">'+ystr+'</ul></div></div>';
                }else if(arr[x]=="m"){
                    var mstr = '';
                    for(var z=1; z<=12; z++){
                        mstr += '<li class="dp-option">'+z+'</li>';
                    }
                    var n = -this.nowtime.getMonth()+2;
                    var style = "-webkit-transform:translate3d(0,"+(n*30)+"px,0);transform:translate3d(0,"+(n*30)+"px,0)";
                    str+='<div class="dp-select"><p class="th fs18 fwb c33 alic">月</p><span class="sp pta z4 dsb bd-t bd-b"></span><div class="list cff alic ptr ovh z4" data-num="12" data-type="m" data-aty="'+(n*30)+'"><ul style="'+style+'" class="dp-options ovh ptr z2">'+mstr+'</ul></div></div>';
                }else if(arr[x]=="d"){
                    var dstr = '';
                    for(var z=1; z<=31; z++){
                        dstr += '<li class="dp-option">'+z+'</li>';
                    }
                    var n = -this.nowtime.getDate()+3;
                    var style = "-webkit-transform:translate3d(0,"+(n*30)+"px,0);transform:translate3d(0,"+(n*30)+"px,0)";
                    str+='<div class="dp-select"><p class="th fs18 fwb c33 alic">日</p><span class="sp pta z4 dsb bd-t bd-b"></span><div class="list cff alic ptr ovh z4" data-num="31" data-type="d" data-aty="'+(n*30)+'"><ul style="'+style+'" class="dp-options ovh ptr z2">'+dstr+'</ul></div></div>';
                }else if(arr[x]=="h"){
                    var hstr = '';
                    for(var z=1; z<=24; z++){
                        hstr += '<li class="dp-option">'+z+'</li>';
                    }
                    var n = -this.nowtime.getHours()+3;
                    var style = "-webkit-transform:translate3d(0,"+(n*30)+"px,0);transform:translate3d(0,"+(n*30)+"px,0)";
                    str+='<div class="dp-select"><p class="th fs18 fwb c33 alic">时</p><span class="sp pta z4 dsb bd-t bd-b"></span><div class="list cff alic ptr ovh z4" data-num="24" data-type="h" data-aty="'+(n*30)+'"><ul style="'+style+'" class="dp-options ovh ptr z2 ovh ptr z2">'+hstr+'</ul></div></div>';
                }else if(arr[x]=="i"){
                    var istr = '';
                    for(var z=0; z<=59; z++){
                        istr += '<li class="dp-option">'+z+'</li>';
                    }
                    var n = -this.nowtime.getMinutes()+2;
                    var style = "-webkit-transform:translate3d(0,"+(n*30)+"px,0);transform:translate3d(0,"+(n*30)+"px,0)";
                    str+='<div class="dp-select"><p class="th fs18 fwb c33 alic">分</p><span class="sp pta z4 dsb bd-t bd-b"></span><div class="list cff alic ptr ovh z4" data-num="60" data-type="i" data-aty="'+(n*30)+'"><ul style="'+style+'" class="dp-options ovh ptr z2">'+istr+'</ul></div></div>';
                }
            }
            return str;
        },
        creatdomdiv:function(len){
            var str = '<div class="datepickerdiv datepicker'+this.showtype+' ovh datepickerdiv'+len+'">\
			<div class="box bgcfff ptr z3">\
				<div class="dp-top bgc ptr alic">\
					<a href="javascript:;" class="prev dsb pta alic cff">'+this.prevtext+'</a>\
					<a href="javascript:;" class="next dsb pta r0 alic cff">'+this.nexttext+'</a>\
					<p><span class="name fwb cff plr5"></span><span class="m fwb cff plr5">'+this.monthtext[this.nowtime.getMonth()]+'</span><span class="year fwb cff plr5">'+this.nowtime.getFullYear()+'</span></p>\
				</div>\
				<div class="table">\
					<table width="100%" cellspacing="0" cellpadding="0">\
						<tr>\
							<th class="lh28">'+this.weektext[0]+'</th><th>'+this.weektext[1]+'</th><th>'+this.weektext[2]+'</th><th>'+this.weektext[3]+'</th><th>'+this.weektext[4]+'</th><th>'+this.weektext[5]+'</th><th>'+this.weektext[6]+'</th>\
						</tr>'+this.creatday(this.nowtime.getFullYear(),this.nowtime.getMonth()+1)+'\
					</table>\
				</div>\
			</div>\
			<a href="javascript:;" class="dp-close pta z2 dsb hp100 wp100 "></a>\
		</div>';
            return str;
        },
        creatday:function(y,m){
            var str = '';
            var newtime = new Date(y+'/'+m+'/1');
            var daynum = 0;
            var month = newtime.getMonth()+1;
            if(month==2){
                if(newtime.getFullYear()%4){
                    daynum=28;
                }else{
                    daynum=29;
                }
            }else if(month==1||month==3||month==5||month==7||month==8||month==10||month==12){
                daynum=31;
            }else{
                daynum=30;
            }
            var firstday = newtime.getDay();
            for(var i=0; i<Math.ceil((daynum+firstday)/7);i++){
                var dstr = '';
                for(var n=1;n<=7;n++){
                    if((i*7+n>firstday)&&(i*7+n<=daynum+firstday)){
                        var ac = $.inArray(y+'/'+m+'/'+(i*7+n-firstday),this.dayarr)>-1?'active':'';
                        if(i*7+n-firstday==this.nowtime.getDate() && newtime.getMonth()==this.nowtime.getMonth()){
                            dstr+='<td data-time="'+y+'/'+m+'/'+(i*7+n-firstday)+'"><a href="javascript:;" data-time="'+y+'/'+m+'/'+(i*7+n-firstday)+'" class="today dsb pr5 alir fs12 c33 ptr active '+ac+'" data-year="'+y+'" data-month="'+m+'" data-date="'+(i*7+n-firstday)+'">'+(i*7+n-firstday)+'</a></td>';
                        }else{
                            dstr+='<td data-time="'+y+'/'+m+'/'+(i*7+n-firstday)+'"><a href="javascript:;" data-time="'+y+'/'+m+'/'+(i*7+n-firstday)+'" data-year="'+y+'" data-month="'+m+'" data-date="'+(i*7+n-firstday)+'" class="dsb pr5 alir fs12 c33 ptr '+ac+'">'+(i*7+n-firstday)+'</a></td>';
                        }
                    }else{
                        dstr+='<td><a href="javascript:;"></a></td>';
                    }
                }
                str+='<tr>'+dstr+'</tr>';
            }
            return str;
        },
        initialday:function(m,y){
            var str = '<table width="100%" cellspacing="0" cellpadding="0">\
				<tr>\
					<th class="lh28">'+this.weektext[0]+'</th><th>'+this.weektext[1]+'</th><th>'+this.weektext[2]+'</th><th>'+this.weektext[3]+'</th><th>'+this.weektext[4]+'</th><th>'+this.weektext[5]+'</th><th>'+this.weektext[6]+'</th>\
				</tr>'+this.creatday(y,m)+'\
			</table>';
            $(str).replaceAll(this.ele.find('table'));
            this.tdclick();
            this.monthspan.html(this.monthtext[m-1]);
            this.spanyear.html(y);
        },
        resettime:function(time,callback, scope){
            var time = time?new Date(time):new Date();
            this.year = time.getFullYear();
            this.month = time.getMonth()+1;
            this.spanyear.html(this.year);
            this.monthspan.html(this.monthtext[this.month-1]);
            this.initialday(this.month,this.year);
            scope = scope || window;
            if(callback){
                callback.call(scope);                
            }
        },
        monthchange:function(type){
            var _this = this;
            if(type=="prev"){
                _this.month--;
            }else{
                _this.month++;
            };
            if(_this.month<1){
                _this.year--;
                _this.spanyear.html(_this.year);
                _this.month = 12;
            };
            if(_this.month>12){
                _this.year++;
                _this.spanyear.html(_this.year);
                _this.month = 1;
            };
            _this.monthspan.html(_this.monthtext[_this.month-1]);
            _this.initialday(_this.month,_this.year);
            _this.tdclick();
            if(_this.options.monthchange){
                _this.options.monthchange(_this.year,_this.month);
            };
        },
        tdclick:function(){
            var _this = this;
            _this.tds = _this.ele.find('td');
            _this.tdas = _this.ele.find('table a');
            _this.tdas.click(function(){
                var $this = $(this);
                if(_this.daygroup){
                    if($this.hasClass('active')){
                        if(_this.dayarr.length<=1){
                            return false;
                        }
                        _this.dayarr.remove($this.attr('data-time'));
                        $this.removeClass('active'); 
                    }else{
                        _this.dayarr.push($this.attr('data-time'));
                        $this.addClass('active'); 
                    }
                }else{
                    _this.tdas.removeClass('active');
                    $this.addClass('active'); 
                }
            });
        }
    };
    Array.prototype.remove = function (val) {
        if (typeof(val) == "undefined") {
            return false;
        }
        for (var i = 0,n=0;i<this.length; i++) {
            if (val != this[i]) {
                this[n++] = this[i];
            }
        }
        this.length -= 1
    }
    //
    return DatePicker;
})(jQuery, window, document);

