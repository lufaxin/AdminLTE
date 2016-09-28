(function(win, $) {

	function _init_page() {
		_remove_test_tool();
	}

	function _remove_test_tool() {
		setTimeout(function() {
			var trans_tooltip = $("#trans-tooltip");
			if(trans_tooltip) {
				var p = $(trans_tooltip).parent();
				if(p) {
					p.remove();
				}
			}
		}, 100)
	}

	var _al = function(msg) {
		msg = msg || "";
		alert(msg);
	};

	var lu_app = lu_app || {
		init: _init_page,
		al: _al
	};
	win.$lu_app = lu_app;
})(window, jQuery);