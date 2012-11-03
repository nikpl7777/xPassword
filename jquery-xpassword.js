/**
 * Free jQuery plugin for creating extended password input boxes
 * 
 * @author Nickolay Litvinov <nikpl777@gmail.com>
 * @version 1.0
 */

!function ($) {

	/* XPASSWORD PUBLIC CLASS DEFINITION
	 * ================================ */
	var
	  KEY_BACKSPACE = 8
	, KEY_DELETE = 46
	
	/**
	 * xPassword constructor
	 * @constructor
	 * @this xPassword
	 */
	var xPassword = function (element, options) {
		this.$element = $(element);
		this.options = $.extend({}, $.fn.xPassword.defaults, options);
		this.init();
	}
	
	/**
	 * Bind evetns and create hidden container
	 * @this xPassword
	 */
	xPassword.prototype.init = function() {
		var name = this.$element.attr('name')
		, val = this.$element.val();
		
		if (name != '') this.$element.attr('name', name + '-displayed')
		if (this.options.formField)
			this.$element.after('<input type="hidden" class="xPassword-container" name="' + name + '" value= "' + val + '"/>')
		
		this.$element
			.on('keyup', this.update)
			.on('keypress', this.letterLimit)
			.data('xpass', val)
	}
	
	/**
	 * Update value in jQuery data and mask symbols in visble input box
	 * If enabled form support, update value in hidden input box
	 * @this DOM element
	 */
	xPassword.prototype.update = function (e) {
		var
		 $this = $(this)
		 , maskSymbol = $this.data('xPassword').options.maskSymbol
		 , formField = $this.data('xPassword').options.formField
		 , caretPos = $this.data('xPassword')._getCaretPosition()
		 , key = e.keyCode || e.keyChar
		 , val = $this.val()
		 , $hidden = formField && $this.next('input.xPassword-container')
		 , xpass = $this.data('xpass')
		 , mask = ''
		 , new_symbol = val.charAt(caretPos - 1)
		
		if (key === KEY_BACKSPACE || key === KEY_DELETE) {
			xpass = xpass.substr(0, caretPos) + xpass.substr(caretPos + 1);
		}
		
		if (val.charAt(0) != maskSymbol) xpass = val;
		else if (val.length > xpass.length)	xpass = xpass.substr(0, caretPos - 1) + new_symbol + xpass.substr(caretPos - 1);
		
		if (formField) $hidden.val(xpass);
		
		for (var i = 0; i < val.length; i++) mask += maskSymbol;
		
		if (val != mask) {
			$this.val(mask);
			if (caretPos < val.length) $this.data('xPassword')._setCaretPosition(caretPos);
		}
		$this.data('xpass', xpass);
	}
	
	/**
	 * Cross-browser function for getting the caret position in input element
	 * @this xPassword
	 * @return {int} caret position
	 */
	xPassword.prototype._getCaretPosition = function() {
		var caretPos = 0;
		if (document.selection) {
			var range = document.selection.createRange();
			range.moveStart('textedit', -1);
			caretPos = range.text.length;
		} else {
			caretPos = this.$element.get(0).selectionStart;
		}
		return caretPos;
	}
	
	/**
	 * Cross-browser function for change the caret position in input element
	 * @this xPassword
	 * @param {int} new caret position
	 */
	xPassword.prototype._setCaretPosition = function(pos) {
		el = this.$element.get(0);
		if (typeof el.setSelectionRange == 'function') {
			el.setSelectionRange(pos, pos);
		} else {
			range = el.createTextRange();
			range.collapse(true);
			range.moveEnd('character', pos);
			range.moveStart('character', pos);
			range.select();
		}
	}
	
	/**
	 * Letter limit function
	 * @this DOM element
	 */
	xPassword.prototype.letterLimit = function() {
		var $this = $(this)
		, val = $this.data('xpass')
		$this.val($this.val().substr(0, val.length))
	}
	
	/* XPASSWORD PLUGIN DEFINITION
	 * ========================= */
	$.fn.xPassword = function (option) {
		return this.each(function () {
			var $this = $(this)
			, data = $this.data('xPassword')
			, options = typeof option == 'object' && option
			
			if (!data) $this.data('xPassword', (data = new xPassword(this, options)))
		})
	}

	$.fn.xPassword.defaults = {
		'maskSymbol': '•',
		'formField': true
	}

	$.fn.xPassword.Constructor = xPassword
}(window.jQuery);