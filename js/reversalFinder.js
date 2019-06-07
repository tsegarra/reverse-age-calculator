var ReversalFinder = ReversalFinder || {};

(function() {
  this.reversals = [];

	var compareReversalObjects = function(a, b) {
		if (a.start < b.start) return -1;
		if (a.start > b.start) return 1;
		return 0;
	};

	var isReversal = function (a, b) {
		var earliest = new Date(a.date.getTime()),
      mid = new Date(a.date.getTime()),
      latest = new Date(a.date.getTime());
    var cycleYear;
		for (var cycle = -10; cycle <= 10; cycle++) {
      cycleYear = (a.date.getYear() + 1900 + cycle*9) - 1;

			earliest.setFullYear(cycleYear);
			mid.setFullYear(cycleYear + 1);
			latest.setFullYear(cycleYear + 2);

      earliest.setDate(earliest.getDate() + 1);
      latest.setDate(latest.getDate() - 1);

      if (b.date >= earliest && b.date <= mid)
				return { cycle: cycle, pos: -1 };
      if (b.date >= mid && b.date <= latest)
				return { cycle: cycle, pos: 1 };
		}

		return null;
	};

  this.findReversals = function (days) {
    var dayKeys = Object.keys(days);
    var numCycles, startYear;
    var nextReversalFound = false;
    var reversalStartDay, reversalEndDay;
    var reversal;
    var keyI, keyJ;
    var first, last;
    var millisecondsPerYear = 1000*60*60*24*365;
    this.reversals = [];
    for (var i = 0; i < dayKeys.length; i++) {
      keyI = dayKeys[i];
      for (var j = i + 1; j < dayKeys.length; j++) {
        keyJ = dayKeys[j];
        if (numCycles = isReversal(days[keyI], days[keyJ])) {
          if (numCycles.cycle == 0) continue;

          reverse = false;
          if (days[keyJ].date.getMonth() > days[keyI].date.getMonth() || ((days[keyJ].date.getMonth() == days[keyI].date.getMonth()) && days[keyJ].date.getDate() > days[keyI].date.getDate())) {
            reverse = true;
          }

          reversalStartDay = new Date();
          reversalEndDay = new Date();

          if (numCycles.pos < 0) {
            reversalStartDay.setMonth(days[keyI].date.getMonth());
            reversalStartDay.setDate(days[keyI].date.getDate());
            reversalEndDay.setMonth(days[keyJ].date.getMonth());
            reversalEndDay.setDate(days[keyJ].date.getDate());
            if (reverse) {
              reversalStartDay.setFullYear((days[keyJ].date.getYear() + 1900) + numCycles.cycle + 1);
            } else {
              reversalStartDay.setFullYear((days[keyJ].date.getYear() + 1900) + numCycles.cycle);
            }
          } else {
            reversalStartDay.setMonth(days[keyJ].date.getMonth());
            reversalStartDay.setDate(days[keyJ].date.getDate());
            reversalEndDay.setMonth(days[keyI].date.getMonth());
            reversalEndDay.setDate(days[keyI].date.getDate());
            reversalStartDay.setFullYear((days[keyI].date.getYear() + 1900) + numCycles.cycle);
            if (reverse) {
              reversalStartDay.setFullYear((days[keyJ].date.getYear() + 1900) + numCycles.cycle);
            } else {
              reversalStartDay.setFullYear((days[keyJ].date.getYear() + 1900) + numCycles.cycle);
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

          first = numCycles.pos > 0 ? days[keyJ] : days[keyI];
          last = numCycles.pos < 0 ? days[keyJ] : days[keyI];
          reversal = {
            start: reversalStartDay,
            end: reversalEndDay,
            first: first,
            last: last,
            firstAge: Math.floor((reversalStartDay.getTime() - first.date.getTime())/millisecondsPerYear),
            lastAge: Math.floor((reversalStartDay.getTime() - last.date.getTime())/millisecondsPerYear),
          };
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
