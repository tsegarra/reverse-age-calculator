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

  // Given two dates, return null if no reversal, else return
  // { cycle: yearDiff%9, pos: +-1 }
	var isReversal = function (a, b) {
    var msPerYear = 1000*60*60*24*365;

    var modNum = Math.abs((b - a)/msPerYear)%9,
      reversalExists = modNum < 1 || modNum > 8;
    var pos = modNum < 1 ? -1 : 1;

    var cycle = modNum < 1 ? Math.sign(b - a) * Math.floor(Math.abs(b - a)/msPerYear)/9 :
        Math.sign(b - a) * Math.ceil(Math.abs(b - a)/msPerYear)/9;

    return reversalExists ? { cycle: cycle, pos: pos } : null;
	};

  // Given 2 bday objects, return a reversal obj if a reversal is found, else null.
  this.getReversal = function (dayI, dayJ) {
    var nextReversalFound = false;
    var millisecondsPerYear = 1000*60*60*24*365;
    var numCycles, startYear;
    var reversalStartDay, reversalEndDay;
    var reversal;
    var first, last;

    if (numCycles = isReversal(dayI.date, dayJ.date)) {
      // Given the number of cycles and the configuration, construct a Reversal object w
      // start/end date, ages, and names.

      if (numCycles.cycle == 0) return null;

      // --- start finding start/endDays ---

      reversalStartDay = new Date();
      reversalEndDay = new Date();

      // True iff J comes after I (year invariant)
      reverse = dayJ.date.getMonth() > dayI.date.getMonth() ||
        ((dayJ.date.getMonth() == dayI.date.getMonth()) && dayJ.date.getDate() > dayI.date.getDate());

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

      // --- end finding start/endDays ---

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
      return reversal;
    }
    return null;
  };

  // Given an array of birthday objects, update and sort the internal array of Reversal objects.
  this.findReversals = function (days) {
    var reversal;
    var dayI, dayJ;
    this.reversals = [];

    for (var i = 0; i < days.length; i++) {
      dayI = days[i];
      for (var j = i + 1; j < days.length; j++) {
        dayJ = days[j];

        if (reversal = this.getReversal(dayI, dayJ)) {
          this.reversals.push(reversal);
        }
      }
    }
    this.reversals.sort(function (a, b) {
      if (a.start < b.start) return -1;
      if (a.start > b.start) return 1;
      return 0;
    });
  };
}).call(ReversalFinder);

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = ReversalFinder;
}
