const ReversalFinder = require('./reversalFinder');

test('No reversals for one date', () => {
  var date = new Date();
  var dates = [{date: date, name: ''}];
  ReversalFinder.findReversals(dates);
  expect(ReversalFinder.reversals.length).toBe(0);
});

test('One reversal for two dates', () => {
  var day1 = {
    name: 'Tom',
    date: new Date(1994, 5 - 1, 25),
  },
  day2 = {
    name: 'Sadie',
    date: new Date(2012, 5 - 1, 22),
  };
  ReversalFinder.findReversals([day1, day2]);
  expect(ReversalFinder.reversals.length).toBe(1);

  var reversal = ReversalFinder.reversals[0];
  var expectedStart = new Date(2025, 4, 25);
  var expectedEnd = new Date(2026, 4, 22);
  reversal.startDate.setHours(0,0,0,0);
  reversal.endDate.setHours(0,0,0,0);
  expect(reversal.startDate).toEqual(expectedStart);
  expect(reversal.endDate).toEqual(expectedEnd);
  expect(reversal.ages.map(a => a.age).sort()).toEqual([{ name: 'Tom', age: 31 }, { name: 'Sadie', age: 13 }].map(a => a.age).sort());
});

test('One reversal for two dates II', () => {
  var day1 = {
    name: 'Dan',
    date: new Date(1993, 7 - 1, 26),
  },
  day2 = {
    name: 'Elena',
    date: new Date(1957, 9 - 1, 8),
  };
  ReversalFinder.findReversals([day1, day2]);
  expect(ReversalFinder.reversals.length).toBe(1);

  var reversal = ReversalFinder.reversals[0];
  var expectedStart = new Date(2019, 9 - 1, 8);
  var expectedEnd = new Date(2020, 7 - 1, 26);
  reversal.startDate.setHours(0,0,0,0);
  reversal.endDate.setHours(0,0,0,0);
  expect(reversal.startDate).toEqual(expectedStart);
  expect(reversal.endDate).toEqual(expectedEnd);
  expect(reversal.ages.map(a => a.age).sort()).toEqual([{ name: 'Dan', age: 26 }, { name: 'Elena', age: 62 }].map(a => a.age).sort());
});

test('No reversal for two dates', () => {
  var day1 = {
    name: 'Elena',
    date: new Date(1957, 9 - 1, 8),
  },
  day2 = {
    name: 'Christina',
    date: new Date(1994, 9 - 1, 27),
  };
  ReversalFinder.findReversals([day1, day2]);
  expect(ReversalFinder.reversals.length).toBe(0);
});

test('Three reversals for three dates', () => {
  var day1 = {
    name: 'Tom',
    date: new Date(1994, 5 - 1, 25),
  },
  day2 = {
    name: 'Sadie',
    date: new Date(2012, 5 - 1, 22),
  },
  day3 = {
    name: 'Julie',
    date: new Date(1975, 8 - 1, 12),
  };
  ReversalFinder.findReversals([day1, day2, day3]);
  expect(ReversalFinder.reversals.length).toBe(3);

  var reversal = ReversalFinder.reversals[0];
  var expectedStart = new Date(2025, 4, 25);
  var expectedEnd = new Date(2026, 4, 22);
  reversal.startDate.setHours(0,0,0,0);
  reversal.endDate.setHours(0,0,0,0);
  expect(reversal.startDate).toEqual(expectedStart);
  expect(reversal.endDate).toEqual(expectedEnd);
  expect(reversal.ages.map(a => a.age).sort()).toEqual([{ name: 'Tom', age: 31 }, { name: 'Sadie', age: 13 }].map(a => a.age).sort());

  reversal = ReversalFinder.reversals[1];
  expectedStart = new Date(2027, 4, 22);
  expectedEnd = new Date(2027, 7, 12);
  reversal.startDate.setHours(0,0,0,0);
  reversal.endDate.setHours(0,0,0,0);
  expect(reversal.startDate).toEqual(expectedStart);
  expect(reversal.endDate).toEqual(expectedEnd);
  expect(reversal.ages.map(a => a.age).sort()).toEqual([{ name: 'Sadie', age: 15 }, { name: 'Julie', age: 51 }].map(a => a.age).sort());

  reversal = ReversalFinder.reversals[2];
  expectedStart = new Date(2029, 4, 25);
  expectedEnd = new Date(2029, 7, 12);
  reversal.startDate.setHours(0,0,0,0);
  reversal.endDate.setHours(0,0,0,0);
  expect(reversal.startDate).toEqual(expectedStart);
  expect(reversal.endDate).toEqual(expectedEnd);
  expect(reversal.ages.map(a => a.age).sort()).toEqual([{ name: 'Tom', age: 35 }, { name: 'Julie', age: 53 }].map(a => a.age).sort());
});
