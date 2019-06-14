class BirthdayEntryField extends React.Component {
  render() {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthOptions = monthNames.map((monthName, index) => React.createElement(
      'option',
      { key: index, value: index + 1 },
      monthName
    ));

    const daysOfMonth = [];
    for (let i = 0; i < 31; i++) {
      daysOfMonth.push(i + 1);
    }
    const daysOfMonthOptions = daysOfMonth.map(day => React.createElement(
      'option',
      { key: day },
      day
    ));

    const years = [];
    for (let i = new Date().getFullYear(); i >= 1900; i--) {
      years.push(i);
    }
    const yearOptions = years.map(year => React.createElement(
      'option',
      { key: year },
      year
    ));

    return React.createElement(
      'form',
      { className: 'bday-entry-field', autoComplete: 'off' },
      React.createElement('input', { id: 'name', placeholder: 'Name' }),
      React.createElement(
        'select',
        { defaultValue: '', id: 'month' },
        React.createElement(
          'option',
          { disabled: true, value: '' },
          'Month'
        ),
        monthOptions
      ),
      React.createElement(
        'select',
        { defaultValue: '', id: 'day' },
        React.createElement(
          'option',
          { disabled: true, value: '' },
          'Day'
        ),
        daysOfMonthOptions
      ),
      React.createElement(
        'select',
        { defaultValue: '', id: 'year' },
        React.createElement(
          'option',
          { disabled: true, value: '' },
          'Year'
        ),
        yearOptions
      )
    );
  }
}

class BirthdayEntryForm extends React.Component {
  render() {
    return React.createElement(
      'div',
      { className: 'bday-entry-form' },
      React.createElement(BirthdayEntryField, null),
      React.createElement(
        'div',
        { className: 'buttons-container' },
        React.createElement('i', { id: 'btn-next', className: 'fas fa-long-arrow-alt-right', style: { display: 'none' } })
      )
    );
  }
}

class BirthdayList extends React.Component {
  render() {
    return React.createElement('div', { id: 'bday-list' });
  }
}

class ReversalsDisplay extends React.Component {
  render() {
    return React.createElement(
      'div',
      { style: { display: 'none' }, className: 'reversals-display-container' },
      React.createElement(
        'h3',
        null,
        'Age reversals'
      ),
      React.createElement('div', { id: 'reversals-display' })
    );
  }
}

class App extends React.Component {
  render() {
    return React.createElement(
      'div',
      { className: 'app' },
      React.createElement(
        'h2',
        null,
        'Age Reversal Calculator'
      ),
      React.createElement(
        'p',
        null,
        'Enter at least two dates of birth below.'
      ),
      React.createElement(BirthdayEntryForm, null),
      React.createElement(BirthdayList, null),
      React.createElement(ReversalsDisplay, null)
    );
  }
}

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));
