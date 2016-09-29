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
	//main_data = {"data_id":"data_list"};

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

})(window, jQuery);