var ReversalFinder = ReversalFinder || {};

function Reversal () {
  var startDate;
  var endDate;
  var ages;

  this.setStartDate = function (startDate) {
    this.startDate = startDate;
  };

  this.setEndDate = function (endDate) {
    this.endDate = endDate;
  };

  this.setAges = function (ages) {
    this.ages = ages;
  };

  this.getStartDate = function() { return this.startDate; }
  this.getEndDate = function() { return this.endDate; }
  this.getAges = function() { return this.ages; }

  this.toString = function() {
    return 'From ' +
      (this.start.getMonth() + 1) + '/' +
      (this.start.getDate()) + '/' +
      (this.start.getFullYear()) +
      ' to ' +
      (this.end.getMonth() + 1) + '/' +
      (this.end.getDate()) + '/' +
      (this.end.getFullYear()) +
      ', ' +
      this.ages[0].name + ' will be ' + this.ages[0].age +
      ' and ' +
      this.ages[1].name + ' will be ' + this.ages[1].age +
      '.';
  };
}

(function() {
  const millisecondsPerYear = 1000*60*60*24*365;

  this.reversals = [];

  /*
   * Given two birthday objects, return a reversal object, or null if none exists.
   */
  this.getReversalDates = function (dayI, dayJ) {
    let yearsDiff = Math.abs((dayJ.date - dayI.date)/millisecondsPerYear),
      reversalExists = yearsDiff%9 <= 1 || yearsDiff%9 >= 8;

    if (!reversalExists) return null;

    let closestMultipleOf9 = yearsDiff%9 <= 1 ?
        Math.floor(Math.abs(dayJ.date - dayI.date)/millisecondsPerYear) :
        Math.ceil(Math.abs(dayJ.date - dayI.date)/millisecondsPerYear);
    let cycle = Math.sign(dayJ.date - dayI.date) * closestMultipleOf9/9;

    // If the ages are the same, reject as trivial.
    if (cycle == 0) return null;

    let lookBackwards = yearsDiff%9 < 1;
    let first = !lookBackwards ? dayJ : dayI,
      last = lookBackwards ? dayJ : dayI;
    
    let reversalStartDay = new Date(first.date.getTime());
    if (first < last) {
      reversalStartDay.setFullYear(dayI.date.getFullYear() + cycle);
    } else {
      reversalStartDay.setFullYear(dayI.date.getFullYear() + cycle*10);
    }

    let now = new Date();
    while (reversalStartDay < now) {
      reversalStartDay.setFullYear(reversalStartDay.getFullYear() + 11);
    }

    let reversalEndDay = new Date(last.date.getTime());
    let firstAge = reversalStartDay.getFullYear() - first.date.getFullYear();
    let ageDelta = lookBackwards ? cycle*-9 : cycle*9;
    reversalEndDay.setFullYear(last.date.getFullYear() + firstAge + ageDelta + 1);

    let reversal = new Reversal();
    reversal.setStartDate(reversalStartDay);
    reversal.setEndDate(reversalEndDay);
    reversal.setAges([
      { name: first.name, age: firstAge },
      { name: last.name, age: firstAge + ageDelta },
    ]);
    return reversal;
  };

  /*
   * Given an array of birthday objects, update and sort the internal array of Reversal objects.
   */
  this.findReversals = function (days) {
    var reversalDates;
    var dayI, dayJ;
    let reversal;
    this.reversals = [];

    for (var i = 0; i < days.length; i++) {
      dayI = days[i];
      for (var j = i + 1; j < days.length; j++) {
        dayJ = days[j];

        if (reversal = this.getReversalDates(dayI, dayJ)) {
          this.reversals.push(reversal);
        }
      }
    }
    this.reversals.sort(function (a, b) {
      if (a.startDate < b.startDate) return -1;
      if (a.startDate > b.startDate) return 1;
      return 0;
    });
  };
}).call(ReversalFinder);

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = ReversalFinder;
}
