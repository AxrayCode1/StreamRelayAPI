/*
 * SimpleModal Basic Modal Dialog
 * http://simplemodal.com
 *
 * Copyright (c) 2013 Eric Martin - http://ericmmartin.com
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

jQuery(function ($) {
	// Load dialog on page load
	//$('#basic-modal-content').modal();

	// Load dialog on click
	$('#basic-modal .basic').click(function (e) {
            $('#basic-modal-content').modal({escClose : false,onShow: function (dialog) {
                    var modal = this;			
                    $('.yes').click(function () {								
                        modal.close(); // or $.modal.close();
                    });
		}});
            $('.yes').hide();
            setTimeout(function(){$('.yes').show();}, 8000);
            return false;
	});
});