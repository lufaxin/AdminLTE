/**
 * 注意：依赖于：iCheck,jQyery
 * @param {Object} win
 * @param {Object} $
 */
(function(win, $, $data) {
	var act_data = act_data || {};

	var _uuid = function() {
		return $data.uuid();
	}

	function _get_data_to_save() {
		var data_to_save = data_to_save || new Array();
		for(var act_data_name in act_data) {
			var act_data_l = act_data[act_data_name];
			var save_url = act_data_l.save_url;
			var data_list = $data.get_return(act_data_name);
			if(data_list == undefined || data_list.length == 0) {
				continue;
			}
			for(var i = 0; i < data_list.length; i++) {
				var data = data_list[i];
				var act = data.method;
				if(act == undefined) {
					continue;
				}
				var sav_data = {
					data_id: act_data_name,
					save_url: save_url,
					data: data
				};
				data_to_save.push(sav_data);
			}
		}
		return data_to_save;
	}

	function _call_back(call, pars) {
		if($.isFunction(call)) {
			new call(pars);
		}
	}

	var _init = function(pars) {
		pars = pars || {};
		var data_id = pars.data_id;
		var data = pars.data;
		var save_url = pars.save_url;
		var data_url = pars.data_url;
		var data_par = pars.data_par;
		var before_init = pars.before_init;
		var after_init = pars.after_init;
		var type = pars.type || "list";
		_call_back(before_init, {
			data_id: data_id,
			type: type
		});
		_get_data({
			url: data_url,
			pars: data_par,
			save_url: save_url
		}, function(res_d, par_d) {
			var sus = res_d.success;
			var save_url_d = par_d.save_url;
			if(sus == false) {
				_call_back(after_init, {
					success: false,
					data_id: data_id,
					type: type,
					msg: res_d.msg,
					save_url: save_url_d
				});
				return;
			} else {
				var data_list = res_d.data;
				$data.put({
					data_id: data_id,
					data: data_list,
					res_call: function(res_d_d) {
						var data_id = res_d_d.data_id;
						act_data[data_id] = pars;
						_call_back(after_init, {
							success: true,
							data_id: data_id,
							type: type,
							msg: res_d.msg
						});
					}
				});
			}
		});
	};

	var _add = function(pars) {
		pars = pars || {};
		var data_id = pars.data_id;
		var id = pars.data._id;
		pars.data.method = "add";
		pars.res_call = function(data) {

		};
		$data.put_one(pars);
	};

	var _edit = function(pars) {
		pars = pars || {};
		var data_id = pars.data_id;
		var id = pars.data.id;
		pars.data.method = "edit";
		pars.res_call = function(data) {

		};
		$data.put_one(pars);
	};

	var _save = function(pars) {
		pars = pars || {};
		var data_to_save_list = _get_data_to_save();
		var data_to_save_list_count = data_to_save_list.length;
		var res_call = pars.res_call;
		var comp_count = 0;
		var sus_count = 0;
		var fail_count = 0;
		for(var i = 0; i < data_to_save_list_count; i++) {
			var data_s = data_to_save_list[i];
			_send_data(data_s, function(data, par_data) {
				var success = data.success;
				var data_id = par_data.data_id;
				var data_act = par_data.data.method;
				var data_data_id = par_data.data.id || par_data.data._id;
				var save_comp_list = new Array();
				if(success == true) {
					sus_count = sus_count + 1;
					var id = data.id;
					var data_d = $data.get_one({
						data_id: data_id,
						id: data_data_id,
						res_call: function(one_data) {
							if(one_data) {
								one_data.id = id;
								var one_d = {
									data_id: data_id,
									data: one_data
								};
								save_comp_list.push(one_d);
								delete one_data.method;
							}
						}
					});
				} else {
					fail_count = fail_count + 1;
				}
				comp_count = comp_count + 1;
				if(comp_count == data_to_save_list_count) {
					if($.isFunction(res_call)) {
						var red_da = {
							all_count: comp_count,
							sus_count: sus_count,
							fail_count: fail_count,
							save_comp_list: save_comp_list
						};
						new res_call(red_da);
					}
				}
			});
		}
	};

	function _send_data(par_data, res_call) {
		var data = par_data.data;
		var str = JSON.stringify(data);
		var md5 = $.md5(str);
		var save_url = par_data.save_url;
		$.ajax({
			type: "POST",
			url: save_url,
			data: {
				pars: str,
				md5: md5
			},
			dataType: "json",
			contentType: "application/x-www-form-urlencoded;charset=UTF-8",
			beforeSend: function(xhr, settings) {},
			success: function(data) {
				new res_call(data, par_data);
			},
			error: function(xhr, errorType, error) {
				var err_d = {
					success: false
				};
				new res_call(err_d, par_data);
			}
		});
	}

	function _get_data(par_data, res_call) {
		var pars = par_data.pars;
		var get_url = par_data.url;
		$.ajax({
			type: "POST",
			url: get_url,
			data: pars,
			dataType: "json",
			contentType: "application/x-www-form-urlencoded;charset=UTF-8",
			beforeSend: function(xhr, settings) {},
			success: function(data) {
				new res_call(data, par_data);
			},
			error: function(xhr, errorType, error) {
				var err_d = {
					success: false
				};
				new res_call(err_d, par_data);
			}
		});
	}

	var _del = function(pars) {
		pars = pars || {};
		var data_id = pars.data_id;
		var id = pars.data.id;
		pars.data.method = "del";
		pars.res_call = function(data) {
			
		};
		$data.put_one(pars);
	};

	var _lu_action_get_return = function(pars) {
		// 主语言
		var main_lan = pars.main_lan || "0";
		// 目标语言
		var tar_lan = pars.tar_lan || "1";
		// 主语参数言名
		var main_lan_name = "lan" + main_lan;
		// 目标语言参数名
		var tar_lan_name = "lan" + tar_lan;
		// 数据标记
		var data_id = pars.data_id;
		// 根据数据标记取出的数据
		var data_list = $data.get_return(data_id);
		// 主语言数据列表
		var data_lan_main = new Array();
		// 目标语言数据列表
		var data_lan_tar = new Array();
		for(var i = 0; i < data_list.length; i++) {
			var data_l = data_list[i];
			// 当前数据项语言
			var lan = data_l.bgyy || "0";
			if(lan == main_lan) { // 主语言
				data_lan_main.push(data_l);
			} else { // 目标语言
				data_lan_tar.push(data_l);
			}
		}
		if(data_lan_main == undefined) {
			return undefined;
		}
		var lan_data_list = new Array();
		var lan_dat = {};
		for(var i = 0; i < data_lan_main.length; i++) {
			var data_lan = data_lan_main[i];
			lan_dat[main_lan_name] = data_lan;
			var data_lan_id = data_lan.id;
			var data_lan_tar_z = {};
			for(var j = 0; j < data_lan_tar.length; j++) {
				var lan_tar = data_lan_tar[j];
				var zid = lan_tar.zid;
				if(data_lan_id == zid) {
					data_lan_tar_z = lan_tar;
					break;
				}
			}
			lan_dat[tar_lan_name] = data_lan_tar_z;
			lan_data_list.push(lan_dat);
		}
		return lan_data_list;
	};

	var _lu_action_get_one_return = function(pars) {
		// 主语言
		var main_lan = pars.main_lan || "0";
		// 目标语言
		var tar_lan = pars.tar_lan || "1";
		// 主语参数言名
		var main_lan_name = "lan" + main_lan;
		// 目标语言参数名
		var tar_lan_name = "lan" + tar_lan;
		// 数据标记
		var data_id = pars.data_id;
		// 主数据ID
		var id = pars.id;
		// 根据数据标记取出的数据
		var data_list = $data.get_return(data_id);
		// 主语言数据列表
		var data_lan_main = new Array();
		// 目标语言数据列表
		var data_lan_tar = new Array();
		for(var i = 0; i < data_list.length; i++) {
			var data_l = data_list[i];
			// 当前数据项语言
			var lan = data_l.bgyy || "0";
			if(lan == main_lan) { // 主语言
				data_lan_main.push(data_l);
			} else { // 目标语言
				data_lan_tar.push(data_l);
			}
		}
		if(data_lan_main == undefined) {
			return undefined;
		}
		var lan_dat = {};
		for(var i = 0; i < data_lan_main.length; i++) {
			var data_lan = data_lan_main[i];
			lan_dat[main_lan_name] = data_lan;
			var data_lan_id = data_lan.id;
			if(data_lan_id != id) {
				continue;
			}
			var data_lan_tar_z = {};
			for(var j = 0; j < data_lan_tar.length; j++) {
				var lan_tar = data_lan_tar[j];
				var zid = lan_tar.zid;
				if(data_lan_id == zid) {
					data_lan_tar_z = lan_tar;
					break;
				}
			}
			lan_dat[tar_lan_name] = data_lan_tar_z;
		}
		return lan_dat;
	};

	var _get_pars = function(data_id) {
		if(data_id == undefined || act_data == undefined) {
			return undefined;
		}
		var pars = act_data[data_id];
		return pars;
	};

	var lu_action = lu_action || {
		init: _init,
		save: _save,
		add: _add,
		edit: _edit,
		del: _del,
		uuid: _uuid,
		get_return: _lu_action_get_return,
		get_one_return: _lu_action_get_one_return,
		get_pars: _get_pars
	};

	win.$lu_act = lu_action;
})(window, jQuery, $lu_data);