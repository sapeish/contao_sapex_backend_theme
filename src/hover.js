/* Contao Open Source CMS, (c) 2005-2013 Leo Feyer, LGPL license */
var Theme = {

	/**
	 * Autofocus the first text field or textarea
	 * @param object
	 */
	focusInput: function(id) {
		if (id == '') return;
		var el = $$('#'+id+' input[class^="tl_text"],#'+id+' textarea');
		if (el && el.length > 0) el[0].focus();
	},

	/**
	 * Colorize a table row when hovering over it
	 * @param object
	 * @param integer
	 */
	hoverRow: function(el, state) {
		var items = $(el).getChildren();
		for (var i=0; i<items.length; i++) {
			if (items[i].nodeName.toLowerCase() == 'td') {
				items[i].setStyle('background-color', (state ? '#f3f8ee' : ''));
			}
		}
	},

	/**
	 * Colorize a layer when hovering over it
	 * @param object
	 * @param integer
	 */
	hoverDiv: function(el, state) {
		if (!state) {
			el.removeAttribute('data-visited');
		}
		$(el).setStyle('background-color', (state ? '#f3f8ee' : ''));
	},

	/**
	 * Toggle a group of checkboxes
	 * @param object
	 */
	toggleSelect: function(el) {
		var input = $(el).getElement('input');
		if (input) {
			if (input.checked) {
				if (input.get('type') != 'radio') {
					input.checked = '';
				}
			} else {
				input.checked = 'checked';
			}
		}
	},

	/**
	 * Work around the missing :last-child support in IE7 and IE8 (see #4017)
	 */
	fixLabelLastChild: function() {
		if (Browser.ie7 || Browser.ie8) {
			$$('.tl_checkbox_container label:last-child').each(function(el) {
				el.setStyle('margin-bottom', 0);
			});
		}
	},

	/**
	 * Stop the propagation of click events of certain elements
	 */
	stopClickPropagation: function() {

		// Do not propagate the click events of the icons
		$$('.picker_selector').each(function(ul) {
			ul.getElements('a').each(function(el) {
				el.addEvent('click', function(e) {
					e.stopPropagation();
				});
			});
		});

		// Do not propagate the click events of the checkboxes
		$$('.picker_selector,.click2edit').each(function(ul) {
			ul.getElements('input[type="checkbox"]').each(function(el) {
				el.addEvent('click', function(e) {
					e.stopPropagation();
				});
			});
		});
	},

	/**
	 * Set up the [Ctrl] + click to edit functionality
	 * @param object
	 * @param integer
	 */
	setupCtrlClick: function() {
		$$('.click2edit').each(function(el) {

			// Do not propagate the click events of the default buttons (see #5731)
			el.getElements('a').each(function(a) {
				a.addEvent('click', function(e) {
					e.stopPropagation();
				});
			});

			// Set up regular click events on touch devices
			if (Browser.Features.Touch) {
				el.addEvent('click', function(e) {
					if (!el.getAttribute('data-visited')) {
						el.setAttribute('data-visited', 1);
					} else {
						el.getElements('a').each(function(a) {
							if (a.hasClass('edit')) {
								document.location.href = a.href;
								return;
							}
						});
						el.removeAttribute('data-visited');
					}
				});
			} else {
				el.addEvent('click', function(e) {
					var key = Browser.Platform.mac ?
							e.event.metaKey : e.event.ctrlKey;
					if (key && e.event.shiftKey) {
						el.getElements('a').each(function(a) {
							if (a.hasClass('editheader')) {
								document.location.href = a.href;
								return;
							}
						});
					} else if (key) {
						el.getElements('a').each(function(a) {
							if (a.hasClass('edit')) {
								document.location.href = a.href;
								return;
							}
						});
					}
				});
			}
		});
	}
};

// Initialize
window.addEvent('domready', function() {
	Theme.fixLabelLastChild();
	Theme.stopClickPropagation();
	Theme.setupCtrlClick();
});

// Respond to Ajax changes
window.addEvent('ajax_change', function() {
	Theme.stopClickPropagation();
	Theme.setupCtrlClick();
});




/* rococo: arrange header */
function arrangeHeader() {
    var headlinee = $$(".main_headline")[0];
    var mainn = headlinee.parentNode;
    var buttonss = $$("#tl_buttons");
    var headlinecontainerr  = new Element('div', {'class': 'main_headline_container'});
    buttonss.inject(headlinecontainerr, 'top');
    headlinee.inject(headlinecontainerr, 'top');
    headlinecontainerr.inject(mainn, 'before');
}

/* rococo: check footer */
function checkFooter(e) {
    var formBody = document.getElement('.tl_formbody_submit') || false;
    var stickyClass = 'stickySave';
    //restore sticky class if was wrongly erased
    if(formBody && !document.body.hasClass(stickyClass)) {
    
        var raffle = formBody.getPosition().y + formBody.getFirst().getHeight(),
            diff = raffle - window.getHeight(),
            scrollSizeToInt = window.getScroll().y.toInt();
        
        //negative diff was causing malfunctioning
        if(diff < 0)
            diff = diff * (-1);
            
        if(scrollSizeToInt <= diff)
            document.body.addClass(stickyClass);
    }
}

/* rococo: arrange footer */
function arrangeStickyFooter() {
    window.addEvents({
        'scroll': checkFooter,
        'resize': checkFooter,
        'ajax_change': checkFooter
    });
    var fieldsets = $$('fieldset');
    //addEvent Delegation for legends
    fieldsets.addEvent('click:relay(legend)', function(e){
        checkFooter();
    });
    //Improvment for checkbox actions
    fieldsets.addEvent('click:relay(input.tl_checkbox[onclick])', function(e){
        checkFooter();
    });
}

window.onload = function(){
    arrangeHeader();
    arrangeStickyFooter();
};
