/**
 * 注意：依赖于：jQyery
 * @param {Object} win
 * @param {Object} $
 */
(function(win, $, table) {

	var _out_init = function(pars) {
		pars = pars || {};
		var type = pars.type || "list";
		var container = pars.container;
		var data_id = $(container).attr("data-id");
		if(data_id == undefined) {
			data_id = $lu_act.uuid();
			$(container).attr("data-id", data_id);
		}
		var data_list = pars.data_list;
		if(type == "list") {
			// 列表参数
			var list_pars = pars.list_pars || {};
			// 列表项模板
			var item_tpls = list_pars.item_tpls || [];
			// 编辑页模板
			var edit_tpl = list_pars.edit_tpl;
			// 当前语言
			var curr_lang = list_pars.curr_lang || "0";
			// 目标语言
			var tar_lang = list_pars.tar_lang || "1";
			// 保存链接
			var save_url = list_pars.save_url;
			// 数据列表
			var data_list = list_pars.data_list;
			// 按钮事件
			var btns = list_pars.btns;
		} else {
			var form_pars = pars.form_pars || {};
		}
	};

	var lu_grid = lu_grid || {
		init: _out_init
	};

	win.$lu_grid = lu_grid;
})(window, jQuery, $lu_table);