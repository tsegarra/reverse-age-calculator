(function ($) {
	var bdays = {},
		nextBdayId = 0,
		reversals;

	var incrementDay = function(dateObj) {
		dateObj.day++;
	};

	var decrementDay = function(dateObj) {
		dateObj.day--;
	};

	var isBetween = function (dateObj, earliest, latest) {
		if (dateObj.year < earliest.year || dateObj.year > latest.year)
			return false;
		if ((dateObj.year == earliest.year && dateObj.month < earliest.month) ||
				(dateObj.year == latest.year && dateObj.month > latest.month))
			return false;
		if ((dateObj.year == earliest.year && dateObj.month == earliest.month && dateObj.day < earliest.day) ||
				(dateObj.year == latest.year && dateObj.month == latest.month && dateObj.day > latest.day))
			return false;
		return true;
	};

	var testIsBetween = function() {
		var d1 = { year: 2000, month: 1, day: 1 },
			d2 = { year: 1999, month: 12, day: 30 },
			d3 = { year: 1999, month: 12, day: 31 },
			d4 = { year: 2001, month: 12, day: 31 },
			d5 = { year: 2000, month: 12, day: 31 };

		console.log(isBetween(d1, d2, d3) == false);
		console.log(isBetween(d1, d3, d4) == true);
		console.log(isBetween(d1, d5, d4) == false);
		console.log(isBetween(d2, d3, d1) == false);
		console.log(isBetween(d2, d3, d4) == false);
		console.log(isBetween(d2, d3, d5) == false);
		console.log(isBetween(d2, d5, d4) == false);
		console.log(isBetween(d3, d2, d1) == true);
		console.log(isBetween(d3, d1, d4) == false);
	};

	var isReversal = function (a, b) {
		var earliest = {}, latest = {}, mid = {};
		for (var cycle = -10; cycle <= 10; cycle++) {
			earliest.year = (a.year + cycle*9) - 1;
			mid.year = earliest.year + 1;
			latest.year = earliest.year + 2;
			earliest.month = a.month;
			latest.month = a.month;
			mid.month = a.month;
			earliest.day = a.day;
			latest.day = a.day;
			mid.day = a.day;
			incrementDay(earliest);
			decrementDay(latest);
			if (isBetween(b, earliest, mid))
				return { cycle: cycle, pos: -1 };
			if (isBetween(b, mid, latest))
				return { cycle: cycle, pos: 1 };
		}

		return null;
	};

	var findReversals = function (days) {
		reversals = [];

		var dayKeys = Object.keys(days);
		var numCycles, startYear;
		var nextReversalFound = false;
		var reversalStartDay = {}, reversalEndDay = {};
		var reversal;
		var keyI, keyJ;
		for (var i = 0; i < dayKeys.length; i++) {
			keyI = dayKeys[i];
			for (var j = i + 1; j < dayKeys.length; j++) {
				keyJ = dayKeys[j];
				if (numCycles = isReversal(days[keyI], days[keyJ])) {
					if (numCycles.cycle == 0) continue;

					reverse = false;
					if (days[keyJ].month > days[keyI].month || ((days[keyJ].month == days[keyI].month) && days[keyJ].day > days[keyI].day)) {
						reverse = true;
					}

					if (numCycles.pos < 0) {
						reversalStartDay.month = days[keyI].month;
						reversalStartDay.day = days[keyI].day;
						reversalEndDay.month = days[keyJ].month;
						reversalEndDay.day = days[keyJ].day;
						if (reverse) {
							reversalStartDay.year = days[keyJ].year + numCycles.cycle + 1;
						} else {
							reversalStartDay.year = days[keyJ].year + numCycles.cycle;
						}
					} else {
						reversalStartDay.month = days[keyJ].month;
						reversalStartDay.day = days[keyJ].day;
						reversalEndDay.month = days[keyI].month;
						reversalEndDay.day = days[keyI].day;
						reversalStartDay.year = days[keyI].year + numCycles.cycle;
						if (reverse) {
							reversalStartDay.year = days[keyJ].year + numCycles.cycle;
						} else {
							reversalStartDay.year = days[keyJ].year + numCycles.cycle;
						}
					}
					while (!nextReversalFound) {
						if (new Date(reversalStartDay.year, reversalStartDay.month - 1, reversalStartDay.day) >= new Date()) {
							nextReversalFound = true;
						} else {
							reversalStartDay.year += 11;
						}
					}

					reversalEndDay.year = reversalStartDay.year;
					if (reverse) {
						if (numCycles.pos > 0) {
							reversalEndDay.year += 1;
						}
					} else {
						if (numCycles.pos < 0) {
							reversalEndDay.year += 1;
						}
					}

					reversal = {
						start: new Date(reversalStartDay.year, reversalStartDay.month - 1, reversalStartDay.day),
						end: new Date(reversalEndDay.year, reversalEndDay.month - 1, reversalEndDay.day),
						first: numCycles.pos > 0 ? days[keyJ] : days[keyI],
						last: numCycles.pos < 0 ? days[keyJ] : days[keyI],
					};
					reversals.push(reversal);
					nextReversalFound = false;
				}
			}
		}
	};

	var addReversalAges = function() {
		var millisecondsPerYear = 1000*60*60*24*365;
		for (var i = 0; i < reversals.length; i++) {
			reversals[i].firstAge = Math.floor((reversals[i].start.getTime() - new Date(reversals[i].first.year, reversals[i].first.month - 1, reversals[i].first.day).getTime())/millisecondsPerYear);
			reversals[i].lastAge = Math.floor((reversals[i].start.getTime() - new Date(reversals[i].last.year, reversals[i].last.month - 1, reversals[i].last.day).getTime())/millisecondsPerYear);
		}
	};

	var compareReversalObjects = function(a, b) {
		if (a.start < b.start) return -1;
		if (a.start > b.start) return 1;
		return 0;
	};

	var displayReversalsOnUI = function() {
		$('.reversals-display-container').show();

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

		var dateObj = {
			year: parseInt(year),
			month: parseInt(month),
			day: parseInt(day),
			name: name,
		};

		bdays[nextBdayId] = dateObj;
		addNewBdayToUI(nextBdayId, dateObj);
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
		bdays[id].name = bdayName;
		bdays[id].month = parseInt(bdayMonth);
		bdays[id].day = parseInt(bdayDay);
		bdays[id].year = parseInt(bdayYear);
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

	var addNewBdayToUI = function(id, dateObj) {
		var bdayHTML = '<span class="bdayName">' + dateObj.name + '</span>' +
			' &mdash; ' + 
			'<span class="bdayMonth">' + dateObj.month + '</span>' +
			'/' +
			'<span class="bdayDay">' + dateObj.day + '</span>' +
			'/' +
			'<span class="bdayYear">' + dateObj.year + '</span>';
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
			findReversals(bdays);
			addReversalAges();
			reversals.sort(compareReversalObjects);
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
