(function ($) {
	var bdays = {},
		nextBdayId = 0;

	var compareReversalObjects = function(a, b) {
		if (a.start < b.start) return -1;
		if (a.start > b.start) return 1;
		return 0;
	};

	var displayReversalsOnUI = function() {
		$('.reversals-display-container').show();
    reversals = ReversalFinder.reversals;

		if (reversals.length < 1) {
			$('#reversals-display').html('<p>No reversals found.</p>');
			return;
		}

		$('#reversals-display').empty();

		var reversalText;
		for (var i = 0; i < reversals.length; i++) {
			reversalText = 'From ' +
				(reversals[i].start.getMonth() + 1) + '/' +
				(reversals[i].start.getDate()) + '/' +
				(reversals[i].start.getYear() + 1900) +
				' to ' +
				(reversals[i].end.getMonth() + 1) + '/' +
				(reversals[i].end.getDate()) + '/' +
				(reversals[i].end.getYear() + 1900) +
				', ' +
				reversals[i].first.name +
				' will be ' +
				reversals[i].firstAge +
				' and ' +
				reversals[i].last.name +
				' will be ' +
				reversals[i].lastAge +
				'.';
			$('<p>').text(reversalText).appendTo('#reversals-display');
		}
	};

	var addNewBdayFromUI = function() {
		var day = $('#day').val(),
			month = $('#month').val(),
			year = $('#year').val(),
			name = $('#name').val();

    var bday = {
      date: new Date(parseInt(year), parseInt(month) - 1, parseInt(day)),
      name: name,
    };

		bdays[nextBdayId] = bday;
		addNewBdayToUI(nextBdayId, bday);
		nextBdayId++;
	};

	var makeEditable = function(id) {
		var bdayEl = $('#bday-' + id),
			bdayNameEl = bdayEl.find('.bdayName'),
			bdayMonthEl = bdayEl.find('.bdayMonth'),
			bdayDayEl = bdayEl.find('.bdayDay'),
			bdayYearEl = bdayEl.find('.bdayYear'),
			bdayName = bdayNameEl.text(),
			bdayMonth = parseInt(bdayMonthEl.text()),
			bdayDay = parseInt(bdayDayEl.text()),
			bdayYear = parseInt(bdayYearEl.text());
		$('<input>').attr('type', 'text')
			.attr('id', 'bdayName-' + id)
			.val(bdayName)
			.insertAfter(bdayNameEl);
		$('#month').clone()
			.attr('id', 'bdayMonth-' + id)
			.val(bdayMonth)
			.insertAfter(bdayMonthEl);
		$('#day').clone()
			.attr('id', 'bdayDay-' + id)
			.val(bdayDay)
			.insertAfter(bdayDayEl);
		$('#year').clone()
			.attr('id', 'bdayYear-' + id)
			.val(bdayYear)
			.insertAfter(bdayYearEl);
		bdayNameEl.hide();
		bdayDayEl.hide();
		bdayMonthEl.hide();
		bdayYearEl.hide();
		$('.edit-icon').hide();
		bdayEl.find('.bdayControlBtns').show();
	};

	var makeUneditable = function(id) {
		var bdayEl = $('#bday-' + id),
			bdayNameEl = bdayEl.find('.bdayName'),
			bdayMonthEl = bdayEl.find('.bdayMonth'),
			bdayDayEl = bdayEl.find('.bdayDay'),
			bdayYearEl = bdayEl.find('.bdayYear'),
			bdayName = $('#bdayName-' + id).val(),
			bdayDay = $('#bdayDay-' + id).val(),
			bdayMonth = $('#bdayMonth-' + id).val(),
			bdayYear = $('#bdayYear-' + id).val();
		bdayNameEl.text(bdayName);
		bdayMonthEl.text(bdayMonth);
		bdayDayEl.text(bdayDay);
		bdayYearEl.text(bdayYear);

		bdays[id] = {
      name: bdayName,
      date: new Date(parseInt(bdayYear), parseInt(bdayMonth) - 1, parseInt(bdayDay)),
    };
		$('#bdayName-' + id).remove();
		$('#bdayDay-' + id).remove();
		$('#bdayMonth-' + id).remove();
		$('#bdayYear-' + id).remove();
		bdayNameEl.show();
		bdayDayEl.show();
		bdayMonthEl.show();
		bdayYearEl.show();
		$('.edit-icon').show();
		bdayEl.find('.bdayControlBtns').hide();
	};

	var addNewBdayToUI = function(id, bday) {
		var bdayHTML = '<span class="bdayName">' + bday.name + '</span>' +
			' &mdash; ' + 
			'<span class="bdayMonth">' + (bday.date.getMonth() + 1) + '</span>' +
			'/' +
			'<span class="bdayDay">' + bday.date.getDate() + '</span>' +
			'/' +
			'<span class="bdayYear">' + (bday.date.getYear() + 1900) + '</span>';
		var bdayEl = $('<div>').attr('id', 'bday-' + id).html(bdayHTML).appendTo('#bday-list');
		$('<div>').addClass('edit-icon')
			.html('<i class="fas fa-edit"></i>')
			.click(function() {
				makeEditable(id);
			})
			.appendTo(bdayEl);
		var controlBtns = $('<div>').addClass('bdayControlBtns')
			.appendTo(bdayEl);
		$('<i>').attr('class', 'bdayControlBtn saveBtn fas fa-check')
			.click(function() {
				makeUneditable(id);
				checkForReversals();
			})
			.appendTo(controlBtns);
		$('<i>').attr('class', 'bdayControlBtn deleteBtn fas fa-trash')
			.click(function() {
				bdayEl.remove();
				delete bdays[id];
				checkForReversals();
			})
			.appendTo(controlBtns);
	};

	var resetBdayField = function() {
		$('#day').val('');
		$('#month').val('');
		$('#year').val('');
		$('#name').val('');
	};

	var updateButtonVisibility = function() {
		if ($('#name').val() == '' || $('#month').val() == null ||
				$('#year').val() == null || $('#day').val() == null) {
			$('#btn-next').hide();
		} else {
			$('#btn-next').show();
		}
	};

	var checkForReversals = function() {
		if (Object.keys(bdays).length >= 2) {
			ReversalFinder.findReversals(bdays);
			ReversalFinder.addReversalAges();
			ReversalFinder.reversals.sort(compareReversalObjects);
			displayReversalsOnUI();
		}
	};

	var attachEventHandlers = function() {
		$('form select').change(updateButtonVisibility);
		$('form input').on('keyup', updateButtonVisibility);

		$('#btn-next').click(function(e) {
			e.preventDefault();
			addNewBdayFromUI();
			resetBdayField();
			updateButtonVisibility();
			checkForReversals();
		});
	};

	$(document).ready(function() {
		resetBdayField();
		attachEventHandlers();
	});
})(jQuery);
