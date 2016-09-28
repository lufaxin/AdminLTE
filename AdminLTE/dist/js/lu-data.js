/**
 * 依赖于jQuery，jquery.md5
 * @param {Object} win
 * @param {Object} $
 */
(function(win, $) {

	var _uuid = function _uuid() {
		var s = [];
		var hexDigits = "0123456789abcdef";
		for(var i = 0; i < 36; i++) {
			s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
		}
		s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
		s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
		s[8] = s[13] = s[18] = s[23] = "-";

		var uuid = s.join("");
		if(uuid) {
			while(uuid.indexOf("-") > -1) {
				uuid = uuid.replace("-", "");
			}
		}
		return uuid;
	};

	var mian_data = mian_data || {};

	var _put = function(pars) {
		pars = pars || {};
		var data_id = pars.data_id || _uuid();
		var data = pars.data || {};
		var res_call = pars.res_call;
		mian_data[data_id] = data;
		if($.isFunction(res_call)) {
			var res_data = {
				code: 1,
				data_id: data_id
			};
			new res_call(res_data);
		}
	};

	var _put_one = function(pars) {
		pars = pars || {};
		var data_id = pars.data_id || _uuid();
		var data = pars.data || {};
		var res_call = pars.res_call;
		var dat_list = mian_data[data_id] || new Array();
		var id = data.id || data._id;
		if(dat_list.length == 0) {
			dat_list.push(data);
		} else {
			var ex = false;
			for(var i = 0; i < dat_list.length; i++) {
				var dat_list_id = dat_list[i].id;
				var _id = dat_list[i]._id;
				if(id == dat_list_id || id == _id) {
					delete dat_list[i];
					dat_list.push(data);
					ex = true;
				}
			}
			if(ex == false) {
				at_list.push(data);
			}
		}

		if($.isFunction(res_call)) {
			var res_data = {
				code: 1,
				data_id: data_id
			};
			new res_call(res_data);
		}
	};

	var _get = function(pars) {
		pars = pars || {};
		var data_id = pars.data_id;
		var res_call = pars.res_call;
		if(!$.isFunction(res_call)) {
			return;
		}
		var data = {};
		if(!data_id) {
			res_data = {
				code: 0,
				msg: "参数异常：data_id"
			};
			new res_call(res_data);
			return;
		}
		var data = mian_data[data_id];
		res_data = {
			code: 1,
			data: data
		};
		new res_call(res_data);
		return;
	};

	var _get_return = function(data_id) {
		if(!data_id) {
			return undefined;
		}
		var data = mian_data[data_id];
		return data;
	};

	var _get_one = function(pars) {
		pars = pars || {};
		var data_id = pars.data_id;
		var res_call = pars.res_call;
		if(!$.isFunction(res_call)) {
			return;
		}
		if(!data_id) {
			res_data = {
				code: 0,
				msg: "参数异常：data_id"
			};
			new res_call(res_data);
			return;
		}
		var id = pars.id;
		if(!id) {
			res_data = {
				code: 0,
				msg: "参数异常：id"
			};
			new res_call(res_data);
			return;
		}
		_get({
			data_id: data_id,
			function(data_list) {
				var data_one = undefined;
				if(data_list != undefined && data_list.length > 0) {
					for(var i = 0; i < data_list.length; i++) {
						var data_l = data_list[i];
						var id_s = data_l.id;
						var _id = data_l._id;
						if(id == id_s || id == _id) {
							data_one = data_l;
						}
					}
				}
				res_data = {
					code: 1,
					data: data_one
				};
				new res_call(res_data);
				return;
			}
		});
	};

	var _remove = function(pars) {
		pars = pars || {};
		var data_id = pars.data_id;
		var res_call = pars.res_call;
		if(!$.isFunction(res_call)) {
			return;
		}
		var data = {};
		if(!data_id) {
			res_data = {
				code: 0,
				msg: "参数异常：data_id"
			};
			new res_call(res_data);
			return;
		}
		var data = mian_datap[data_id];
		res_data = {
			code: 1,
			data: data
		};
		new res_call(res_data);
		return;
	};

	var _get_edit = function(pars) {
		var res_call = pars.res_call;
		if(!$.isFunction(res_call)) {
			return;
		}
		var data_to_save = new Array();
		mian_data = mian_data || {};
		for(var data_name in mian_data) {
			var data_list = mian_data[data_name];
			if(data_list == undefined || data_list.length == 0) {
				continue;
			}
			for(var i = 0; i < data_list.length; i++) {
				var data_l = data_list[i];
				var act = data_l.method;
				if(act != undefined) {
					var res_d = {
						data_id: data_name,
						data: data_l
					};
					data_to_save.push(res_d);
				}
			}
		}
	};

	var lu_data = lu_data || {
		uuid: _uuid,
		put: _put,
		put_one: _put_one,
		get: _get,
		get_return: _get_return,
		get_one: _get_one,
		remove: _remove
	};

	win.$lu_data = lu_data;

	var act_data = act_data || {};

	function _get_data_to_save() {
		var data_to_save = data_to_save || new Array();
		for(var act_data_name in act_data) {
			var act_data_l = act_data[act_data_name];
			var save_url = act_data_l.save_url;
			var data_list = $lu_data.get_return(act_data_name);
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

	var _init = function(pars) {
		pars = pars || {};
		var data_id = pars.data_id;
		var data = pars.data;
		var save_url = pars.save_url;
		var type = pars.type || "list";
		var data_m = {
			data_id: data_id,
			data: data,
			res_call: function(res_d) {
				data_id = res_d.data_id;
				var act_data_o = {
					data_id: data_id,
					save_url: save_url,
					type: type
				};
				act_data[data_id] = act_data_o;
			}
		};
		$lu_data.put(data_m);
	};

	var _add = function(pars) {
		pars = pars || {};
		var data_id = pars.data_id;
		var id = pars.data._id;
		pars.data.method = "add";
		pars.res_call = function(data) {

		};
		$lu_data.put_one(pars);
	};

	var _edit = function(pars) {
		pars = pars || {};
		var data_id = pars.data_id;
		var id = pars.data.id;
		pars.data.method = "edit";
		pars.res_call = function(data) {

		};
		$lu_data.put_one(pars);
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
					var data_d = $lu_data.get_one({
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

	var _del = function(pars) {
		pars = pars || {};
		var data_id = pars.data_id;
		var id = pars.data.id;
		pars.data.method = "del";
		pars.res_call = function(data) {

		};
		$lu_data.put_one(pars);
	};

	var lu_action = lu_action || {
		init: _init,
		save: _save,
		add: _add,
		edit: _edit,
		del: _del,
		uuid: _uuid
	};

	win.$lu_act = lu_action;

})(window, jQuery);