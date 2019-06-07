var ReversalFinder = ReversalFinder || {};

// @TODO Make this object cleaner, explicitly define properties
function Reversal () {
  this.toString = function() {
    return 'From ' +
      (this.start.getMonth() + 1) + '/' +
      (this.start.getDate()) + '/' +
      (this.start.getYear() + 1900) +
      ' to ' +
      (this.end.getMonth() + 1) + '/' +
      (this.end.getDate()) + '/' +
      (this.end.getYear() + 1900) +
      ', ' +
      this.ages[0].name + ' will be ' + this.ages[0].age +
      ' and ' +
      this.ages[1].name + ' will be ' + this.ages[1].age +
      '.';
  };
}

(function() {
  this.reversals = [];

	var compareReversalObjects = function(a, b) {
		if (a.start < b.start) return -1;
		if (a.start > b.start) return 1;
		return 0;
	};

	var isReversal = function (a, b) {
		var earliest = new Date(a.getTime()),
      mid = new Date(a.getTime()),
      latest = new Date(a.getTime());
    var cycleYear;
		for (var cycle = -10; cycle <= 10; cycle++) {
      cycleYear = (a.getYear() + 1900 + cycle*9) - 1;

			earliest.setFullYear(cycleYear);
			mid.setFullYear(cycleYear + 1);
			latest.setFullYear(cycleYear + 2);

      earliest.setDate(earliest.getDate() + 1);
      latest.setDate(latest.getDate() - 1);

      if (b >= earliest && b <= mid)
				return { cycle: cycle, pos: -1 };
      if (b >= mid && b <= latest)
				return { cycle: cycle, pos: 1 };
		}

		return null;
	};

  // Take an array of birthday objects
  // & use it to update and sort the module's internal array of Reversal objects.
  this.findReversals = function (days) {
    var numCycles, startYear;
    var nextReversalFound = false;
    var reversalStartDay, reversalEndDay;
    var reversal;
    var dayI, dayJ;
    var first, last;
    var millisecondsPerYear = 1000*60*60*24*365;
    this.reversals = [];
    for (var i = 0; i < days.length; i++) {
      dayI = days[i];
      for (var j = i + 1; j < days.length; j++) {
        dayJ = days[j];
        if (numCycles = isReversal(dayI.date, dayJ.date)) {
          if (numCycles.cycle == 0) continue;

          reverse = false;
          if (dayJ.date.getMonth() > dayI.date.getMonth() || ((dayJ.date.getMonth() == dayI.date.getMonth()) && dayJ.date.getDate() > dayI.date.getDate())) {
            reverse = true;
          }

          reversalStartDay = new Date();
          reversalEndDay = new Date();

          if (numCycles.pos < 0) {
            reversalStartDay.setMonth(dayI.date.getMonth());
            reversalStartDay.setDate(dayI.date.getDate());
            reversalEndDay.setMonth(dayJ.date.getMonth());
            reversalEndDay.setDate(dayJ.date.getDate());
            if (reverse) {
              reversalStartDay.setFullYear((dayJ.date.getYear() + 1900) + numCycles.cycle + 1);
            } else {
              reversalStartDay.setFullYear((dayJ.date.getYear() + 1900) + numCycles.cycle);
            }
          } else {
            reversalStartDay.setMonth(dayJ.date.getMonth());
            reversalStartDay.setDate(dayJ.date.getDate());
            reversalEndDay.setMonth(dayI.date.getMonth());
            reversalEndDay.setDate(dayI.date.getDate());
            reversalStartDay.setFullYear((dayI.date.getYear() + 1900) + numCycles.cycle);
            if (reverse) {
              reversalStartDay.setFullYear((dayJ.date.getYear() + 1900) + numCycles.cycle);
            } else {
              reversalStartDay.setFullYear((dayJ.date.getYear() + 1900) + numCycles.cycle);
            }
          }
          while (!nextReversalFound) {
            if (reversalStartDay >= new Date()) {
              nextReversalFound = true;
            } else {
              reversalStartDay.setFullYear(reversalStartDay.getYear() + 1900 + 11);
            }
          }

          reversalEndDay.setFullYear(reversalStartDay.getYear() + 1900);
          if (reverse) {
            if (numCycles.pos > 0) {
              reversalEndDay.setFullYear(reversalEndDay.getYear() + 1900 + 1);
            }
          } else {
            if (numCycles.pos < 0) {
              reversalEndDay.setFullYear(reversalEndDay.getYear() + 1900 + 1);
            }
          }

          first = numCycles.pos > 0 ? dayJ : dayI;
          last = numCycles.pos < 0 ? dayJ : dayI;
          reversal = new Reversal();
          reversal.start = reversalStartDay;
          reversal.end = reversalEndDay;
          reversal.ages = [
            {
              name: first.name,
              age: Math.floor((reversalStartDay.getTime() - first.date.getTime())/millisecondsPerYear)
            },
            {
              name: last.name,
              age: Math.floor((reversalStartDay.getTime() - last.date.getTime())/millisecondsPerYear)
            },
          ];
          this.reversals.push(reversal);
          nextReversalFound = false;
        }
      }
    }
    this.reversals.sort(compareReversalObjects);
  };
}).call(ReversalFinder);

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = ReversalFinder;
}
