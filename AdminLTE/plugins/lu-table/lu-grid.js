/**
 * 注意：依赖于：jQyery
 * @param {Object} win
 * @param {Object} $
 */
(function(win, $, $check) {

	var _out_load = function(pars) {
		pars = pars || {};
		var type = pars.type || "list";
		var container = pars.container;
		var data_id = $(container).attr("data-id");
		if(data_id == undefined) {
			data_id = $lu_act.uuid();
			$(container).attr("data-id", data_id);
		}
		// 保存链接
		var save_url = pars.save_url;
		var data_url = pars.data_url;
		var data_par = pars.data_par;
		// 当前语言
		var curr_lang = pars.curr_lang || "0";
		// 目标语言
		var tar_lang = pars.tar_lang || "1";
		// 按钮事件
		var btn_func = pars.btn_func;
		var table_container = $(container).find("[data-ac=box_data]");
		var data_container = $(container).find("table tbody");
		// 加载效果模板
		var load_tpl = pars.load_tpl;
		// 空数据模板
		var none_tpl = pars.none_tpl;
		// 列表项模板
		var item_tpl = pars.item_tpl;
		// 编辑页模板
		var edit_tpl = list_pars.edit_tpl;
		// 分页标记
		var page = pars.page || false;
		// 分页参数
		var page_par = pars.page_par;
		$lu_act.init({
			data_id: data_id,
			save_url: save_url,
			data_url: data_url,
			data_par: data_par,
			type: "list",
			before_init: function(data) {
				var html = $(load_tpl).tmpl();
				$(data_container).append("");
				$(data_container).append(html);
			},
			after_init: function(res_d) {
				var res_d_id = res_d.data_id;
				var lan_data = $lu_act.get_return({
					main_lan: curr_lang,
					tar_lan: tar_lang,
					data_id: res_d_id
				});
				if(lan_data == undefined || lan_data.length == 0) {
					var html = $(none_tpl).tmpl();
					$(data_container).append("");
					$(data_container).append(html);
				} else {
					var html = $(item_tpl).tmpl(lan_data);
					$(data_container).append("");
					$(data_container).append(html);
				}
				bind_btn_click(res_d_id);
			}
		});
	};

	function bind_btn_click(data_id) {
		var pars = $lu_act.get_pars(data_id);
		var btn_func = pars.btn_func;
		var data_id_d = pars.data_id;
		if(btn_func) {
			for(var btn_ac in btn_func) {
				var btn_f = btn_func[btn_ac];
				if($.isFunction(btn_f)) {
					var btn = $(container).find("[btn-ac=" + btn_ac + "]");
					$(btn).unbind();
					$(btn).click(function() {
						new btn_f(this, {
							data_id: data_id_d
						});
					});
				}
			}
		}
	}

	var _edit_item = function(pars) {
		pars = pars || {};
		var data_id = pars.data_id;
		var id = pars.id;
		var edit_tpl = pars.edit_tpl;
		var row = pars.row;
		var func_btn = pars.func_btn;
		var lan_data = $lu_act.get_one_return({
			data_id: data_id,
			id: id
		});
		var html = $(edit_tpl).tmpl(lan_data);
		$(row).after(html);
		$(row).remove();
		if(func_btn != undefined) {
			for(var func_btn_n in func_btn) {
				var fun = func_btn[func_btn_n];
				var main_pars = $lu_act.get_pars(data_id);
				var row_edit = $(container).find("[row=" + id + "]");
				if(row_edit) {
					$(row_edit).find("[btn-ac=" + func_btn_n + "]").click(function() {
						var this_ele = this;
						if($.isFunction(fun)) {
							new fun(this_ele, {
								data_id: data_id,
								id: id
							});
						}
					});
				}
			}
		}
	};

	var _del_item = function(pars) {
		pars = pars || {};
		var data_id = pars.data_id;
		var id = pars.id;
		var row = pars.row;
		
	};

	var lu_grid = lu_grid || {
		load: _out_load,
		edit_item: _edit_item,
		del_item: _del_item
	};

	win.$lu_grid = lu_grid;
})(window, jQuery, $lu_check);