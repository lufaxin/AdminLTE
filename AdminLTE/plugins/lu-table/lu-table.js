/**
 * 注意：依赖于：iCheck,jQyery
 * @param {Object} win
 * @param {Object} $
 */
(function(win, $) {
	var _out_init = function($table, pars) {
		pars = pars || {};
		var onCheckAll = pars.onCheckAll;
		var onCheckOne = pars.onCheckOne;
		var all_sel = $($table).find("th input:checkbox[ac=row_check]");
		var all_sel_ins = $($table).find("th ins");
		var sel_s = $($table).find("td input:checkbox[ac=row_check]");
		$(all_sel).iCheck({
			checkboxClass: 'icheckbox_flat-green',
			radioClass: 'iradio_flat-green'
		});
		$(sel_s).iCheck({
			checkboxClass: 'icheckbox_flat-green',
			radioClass: 'iradio_flat-green'
		});
		$(all_sel).on('ifChanged', function(event) {
			var all_sel_checked = $(all_sel).is(':checked');
			if(all_sel_checked) {
				$(sel_s).iCheck('check');
				if($.isFunction(onCheckAll)) {
					var ches = _get_checked($table);
					new onCheckAll(ches);
				}
			} else {
				$(sel_s).iCheck('uncheck');
			}
		});
	};

	function _get_checked($table) {
		var sel_s = $($table).find("td input:checkbox[ac=row_check]");
		if(!sel_s) {
			return undefined;
		}
		var val_a = new Array();
		for(var i = 0; i < sel_s.length; i++) {
			var sel = sel_s[i];
			var sel_checked = $(sel).is(':checked');
			if(sel_checked) {
				var value = $(sel).val();
				val_a.push(value);
			}
		}
		if(val_a == undefined || val_a.length == 0) {
			return undefined;
		}
		var val_a_str = val_a.join(",");
		return val_a_str;
	}

	var _out_getChecked = function($table) {
		var ches = _get_checked($table);
		return ches;
	}

	var lu_table = lu_table || {
		init: _out_init,
		getChecked: _out_getChecked
	};

	win.$lu_table = lu_table;
})(window, jQuery);