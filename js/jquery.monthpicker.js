/**
 * jquery.monthpicker.js  0.0.2
 * 本插件最早是在github上看到的
 * 项目原地址为：https://github.com/lugolabs/monthpicker
 * 使用的时候感觉有需要改进的地方，遂自己做了一些改造
 * 
 * 详细使用说明请查看技术帮官网 http://www.jiisb.com
 * 
 */
(function($, undefined) {

	$.fn.monthpicker = function(options) {
		
		if(options==null){
			options={};
		}
		// init month array  
		var months = options.months || [ '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月',
						'10月', '11月', '12月' ],
		tempYear,currYear,

		// el is your month input or div
		Monthpicker = function(el) {
			this._el = $(el);
			this._init();
			this._render();
			this._renderYears();
			this._renderMonths();
			this._bind();
		};

		Monthpicker.prototype = {
			destroy : function() {
				this._el.off('click');
				this._yearsSelect.off('click');
				this._container.off('click');
				$(document).off('click', $.proxy(this._hide, this));
				this._container.remove();
			},

			_init : function() {
				this._el.data('monthpicker', this);
				if(this._el.val()==""){
					var y=this._getCurrYear();
					var m=new Date().getMonth()+1;
					this._el.val(y+"-"+m);
				}
			},

			_bind : function() {
				this._el.on('click', $.proxy(this._show, this));
				$(document).on('click', $.proxy(this._hide, this));
				this._container.on('click', $.proxy(this._clk_container, this));
				
				$(".monthpicker #b10btn").on("click",$.proxy(this._clk_b10btn,this));
				$(".monthpicker #bbtn").on("click",$.proxy(this._clk_bbtn,this));
				$(".monthpicker #abtn").on("click",$.proxy(this._clk_abtn,this));
				$(".monthpicker #a10btn").on("click",$.proxy(this._clk_a10btn,this));
				$(".monthpicker .row_year .txt_year").on("click",$.proxy(this._clk_txt_year,this));
				
				$(".monthpicker .row_year .btn_year").on("click",$.proxy(this._clk_btn_year,this));
				
				$(".monthpicker .btn_month").on("click",$.proxy(this._clk_btn_month,this));
				
			},

			_show : function(e) {
				e.preventDefault();
				e.stopPropagation();
				this._setTxtYear();
				this._container.css('display', 'inline-block');
			},

			_hide : function() {
				this._container.css('display', 'none');
			},
			_render : function() {
				var linkPosition = this._el.position();
				var cssOptions = {
					display : 'none',
					position : 'absolute',
					top : linkPosition.top + this._el.height()+ (options.topOffset || 6),
					left : linkPosition.left
				};
				this._id = (new Date).valueOf();
				this._container = $('<div class="monthpicker" id="monthpicker-' + this._id+ '">').css(cssOptions).appendTo($('body'));
			},

			_renderYears : function() {
				var yearsWrap = $('<div class="row_year">').appendTo(this._container);
				var bbtn10Year =$('<button class="btn_row_year" id="b10btn">&lt;&lt;</button>').appendTo(yearsWrap);
				var bbtnYear =$('<button class="btn_row_year" id="bbtn">&lt;</button>').appendTo(yearsWrap);
				
				this._yearsSelect = $('<input type="text" name="txtYear" class="txt_year" readonly="readonly">').appendTo(yearsWrap);
				var abtnYear =$('<button class="btn_row_year" id="abtn">&gt;</button>').appendTo(yearsWrap);
				var abtn10Year =$('<button class="btn_row_year" id="a10btn">&gt;&gt;</button>').appendTo(yearsWrap);
				
				var dvYears=$("<div class='box_years'>").appendTo(yearsWrap);
				
				var years="<table class='tbl_years'>";
				
				for(var i=0;i<5;i++){
					years+="<tr>";
					for(var j=0;j<2;j++){
						years+="<td><button class='btn_year'></button></td>";
					}
					years+="</tr>";
				}
				years+="</table>";
				dvYears.html(years);
				
				
			},
			_renderMonths : function() {
				var markup = [ '<table class="tbl_month">', '<tr>' ];
				$.each(months, function(i, month) {
					if (i > 0 && i % 4 === 0) {
						markup.push('</tr>');
						markup.push('<tr>');
					}
					markup.push('<td><button class="btn_month" data-month="' + i + '">' + month
							+ '</button></td>');
				});
				markup.push('</tr>');
				markup.push('</table>');
				this._container.append(markup.join(''));
			},
			
			// bind事件方法开始
			_clk_container:function(e){
				e.preventDefault();
				e.stopPropagation();
				currYear=undefined;
				tempYear=undefined;
				$(".monthpicker .row_year .box_years").css("display","none");
			},
			_clk_b10btn:function(e){
				e.preventDefault();
				e.stopPropagation();
				var y=tempYear==undefined?this._getCurrYear():tempYear;
				y-=10;
				tempYear=y;
				this._setBtnYears(y);
				$(".monthpicker .row_year .box_years").css("display","block");
			},
			_clk_bbtn:function(e){
				e.preventDefault();
				e.stopPropagation();
				var y=tempYear==undefined?this._getCurrYear():tempYear;
				y-=1;
				tempYear=y;
				this._setBtnYears(y);
				$(".monthpicker .row_year .box_years").css("display","block");
			},
			_clk_txt_year:function(e){
				e.preventDefault();
				e.stopPropagation();
				var y=tempYear==undefined?this._getCurrYear():tempYear;
				tempYear=y;
				this._setBtnYears(y);
				$(".monthpicker .row_year .box_years").css("display","block");
			},
			_clk_abtn:function(e){
				e.preventDefault();
				e.stopPropagation();
				var y=tempYear==undefined?this._getCurrYear():tempYear;
				y+=1;
				tempYear=y;
				this._setBtnYears(y);
				$(".monthpicker .row_year .box_years").css("display","block");
			},
			_clk_a10btn:function(e){
				e.preventDefault();
				e.stopPropagation();
				var y=tempYear==undefined?this._getCurrYear():tempYear;
				y+=10;
				tempYear=y;
				this._setBtnYears(y);
				$(".monthpicker .row_year .box_years").css("display","block");
			},
			
			_clk_btn_year:function(e){
				e.preventDefault();
				e.stopPropagation();
				
				var y=parseInt($(e.target).data("year"));
				currYear=y;
				this._setTxtYear();				
				$(".monthpicker .row_year .box_years").css("display","none");
			},
			
			_clk_btn_month:function(e){
				e.preventDefault();
				e.stopPropagation();
				
				var m=parseInt($(e.target).data("month"))+1;
				this._el.val(this._getCurrYear()+"-"+m);
				
				this._hide();
			},
			
			
			
			
			// 私有方法开始
			
			_setBtnYears:function(syear){
				
				$(".monthpicker .row_year .btn_year").each(function(){
					$(this).text(syear);
					$(this).attr("data-year",syear);
					if(syear==currYear){
						$(this).addClass("curr");
					}else{
						$(this).removeClass("curr");
					}
					syear++;
				});
			},
			_setTxtYear:function(){
				var y=this._getCurrYear();
				$(".monthpicker .row_year .txt_year").val(y);
			},
			
			_hideBoxYears : function(e){
				e.preventDefault();
				e.stopPropagation();
				$(".monthpicker .row_year .box_years").css("display","none");
				currYear=$(e.target).data("year");
				$(".monthpicker .row_year .txt_year").val(currYear);
				
			},

			
			_getCurrYear:function(){
				if(currYear != undefined){
					return currYear;
				}
				
				var txtYear=$(".monthpicker .row_year .txt_year").val();
				if(txtYear!=""&&!isNaN(txtYear)){
					currYear=parseInt(txtYear);
					return currYear;
				}
				
				var txtym=this._el.val();
				if($.trim(txtym)!=""){
					var arrym=txtym.split("-");
					currYear=parseInt(arrym[0]);
					return currYear;
				}
				var dt=new Date();
				currYear=dt.getFullYear();
				return currYear;
			}
			
		};

		var methods = {
			destroy : function() {
				console.log(this);
				var monthpicker = this.data('monthpicker');
				if (monthpicker)
					monthpicker.destroy();
				return this;
			}
		}

		if (methods[options]) {
			return methods[options].apply(this, Array.prototype.slice.call(
					arguments, 1));
		} else if (typeof options === 'object' || !options) {
			return this.each(function() {
				return new Monthpicker(this);
			});
		} else {
			$.error('Method ' + options + ' does not exist on monthpicker');
		}

	};

}(jQuery));
