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

class BirthdaySubmitButton extends React.Component {
  render() {
    if (this.props.show) {
      return React.createElement('i', { onClick: this.props.handleSubmit, id: 'btn-next', className: 'fas fa-long-arrow-alt-right' });
    }
    return null;
  }
}

class BirthdayEntryForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      month: '',
      day: '',
      year: '',
      showSubmitButton: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit(event) {
    this.props.submitBirthday(this.state.name, this.state.year, this.state.month, this.state.day);

    this.setState({
      name: '',
      month: '',
      day: '',
      year: '',
      showSubmitButton: false
    });
  }

  render() {
    const shouldShowSubmitButton = this.state.name != '' && this.state.month != '' && this.state.day != '' && this.state.year != '';

    return React.createElement(
      'div',
      { className: 'bday-entry-form' },
      React.createElement(
        'form',
        { className: 'bday-entry-field', autoComplete: 'off', onSubmit: this.handleSubmit },
        React.createElement('input', { id: 'name', placeholder: 'Name', value: this.state.name, onChange: this.handleChange }),
        React.createElement(
          'select',
          { id: 'month', value: this.state.month, onChange: this.handleChange },
          React.createElement(
            'option',
            { disabled: true, value: '' },
            'Month'
          ),
          monthOptions
        ),
        React.createElement(
          'select',
          { id: 'day', value: this.state.day, onChange: this.handleChange },
          React.createElement(
            'option',
            { disabled: true, value: '' },
            'Day'
          ),
          daysOfMonthOptions
        ),
        React.createElement(
          'select',
          { id: 'year', value: this.state.year, onChange: this.handleChange },
          React.createElement(
            'option',
            { disabled: true, value: '' },
            'Year'
          ),
          yearOptions
        ),
        React.createElement(BirthdaySubmitButton, { handleSubmit: this.handleSubmit, show: shouldShowSubmitButton })
      )
    );
  }
}

class BirthdayItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      /*
          name: '',
          day: '',
          month: '',
          year: '',
          */
      name: this.props.name,
      day: this.props.day,
      month: this.props.month,
      year: this.props.year
    };

    this.edit = this.edit.bind(this);
    this.save = this.save.bind(this);
    this.delete = this.delete.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  edit() {
    this.setState({ editing: true });
  }

  save() {
    this.setState({ editing: false });
    this.props.updateBirthday(this.props.id, this.state.name, this.state.day, this.state.month, this.state.year);
  }

  delete() {
    this.props.deleteThisBirthday(this.props.id);
  }

  render() {
    if (this.state.editing) {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          null,
          React.createElement('input', { id: 'name', value: this.state.name, onChange: this.handleChange }),
          '\u2014',
          React.createElement(
            'select',
            { id: 'month', value: this.state.month, onChange: this.handleChange },
            React.createElement(
              'option',
              { disabled: true, value: '' },
              'Month'
            ),
            monthOptions
          ),
          React.createElement(
            'select',
            { id: 'day', value: this.state.day, onChange: this.handleChange },
            React.createElement(
              'option',
              { disabled: true, value: '' },
              'Day'
            ),
            daysOfMonthOptions
          ),
          React.createElement(
            'select',
            { id: 'year', value: this.state.year, onChange: this.handleChange },
            React.createElement(
              'option',
              { disabled: true, value: '' },
              'Year'
            ),
            yearOptions
          )
        ),
        React.createElement(
          'div',
          { className: 'bdayControlBtns' },
          React.createElement('i', { className: 'bdayControlBtn saveBtn fas fa-check', onClick: this.save }),
          React.createElement('i', { className: 'bdayControlBtn deleteBtn fas fa-trash', onClick: this.delete })
        )
      );
    } else {
      const dateString = this.props.month + '/' + this.props.day + '/' + this.props.year;
      return React.createElement(
        'div',
        null,
        React.createElement(
          'span',
          null,
          this.props.name,
          ' \u2014 ',
          dateString
        ),
        React.createElement(
          'div',
          { className: 'edit-icon' },
          React.createElement('i', { className: 'fas fa-edit', onClick: this.edit })
        )
      );
    }
  }
}

class BirthdayList extends React.Component {
  render() {
    const birthdays = this.props.birthdays.map(item => React.createElement(BirthdayItem, { key: item.id,
      deleteThisBirthday: this.props.deleteBirthday,
      updateBirthday: this.props.updateBirthday,
      id: item.id,
      name: item.name,
      month: item.date.getMonth() + 1,
      day: item.date.getDate(),
      year: item.date.getFullYear() }));

    return React.createElement(
      'div',
      { id: 'bday-list' },
      birthdays
    );
  }
}

class ReversalsDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.hashString = this.hashString.bind(this);
  }

  hashString(str) {
    let hash = 0;
    if (str.length == 0) return hash;
    for (let i = 0; i < str.length; i++) {
      let char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash;
  }

  render() {
    if (this.props.numBirthdays > 1) {
      const reversalElements = this.props.reversals.map(item => React.createElement(
        'p',
        { key: this.hashString(item.toString()) },
        item.toString()
      ));

      return React.createElement(
        'div',
        { className: 'reversals-display-container' },
        React.createElement(
          'h3',
          null,
          'Age reversals'
        ),
        React.createElement(
          'div',
          { id: 'reversals-display' },
          this.props.reversals.length < 1 && React.createElement(
            'p',
            null,
            'No reversals found.'
          ),
          reversalElements
        )
      );
    }
    return null;
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      birthdays: [],
      reversals: [],
      nextId: 0
    };

    this.addBirthdayToList = this.addBirthdayToList.bind(this);
    this.deleteBirthday = this.deleteBirthday.bind(this);
    this.updateBirthday = this.updateBirthday.bind(this);
  }

  deleteBirthday(id) {
    this.setState(function (state, props) {
      const birthdays = state.birthdays.slice(0);
      for (let i = 0; i < birthdays.length; i++) {
        if (birthdays[i].id == id) {
          birthdays.splice(i, 1);
          break;
        }
      }
      return {
        birthdays: birthdays,
        reversals: ReversalFinder.findReversals(Object.values(birthdays))
      };
    });
  }

  updateBirthday(id, name, day, month, year) {
    this.setState(function (state, props) {
      const birthdays = state.birthdays.slice(0);
      for (let i = 0; i < birthdays.length; i++) {
        if (birthdays[i].id == id) {
          birthdays[i].name = name;
          birthdays[i].date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          break;
        }
      }
      return {
        birthdays: birthdays,
        reversals: ReversalFinder.findReversals(Object.values(birthdays))
      };
    });
  }

  addBirthdayToList(name, year, month, day) {
    this.setState(function (state, props) {
      const birthdays = state.birthdays.concat({
        id: state.nextId,
        name: name,
        date: new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      });
      return {
        birthdays: birthdays,
        nextId: state.nextId + 1,
        reversals: ReversalFinder.findReversals(Object.values(birthdays))
      };
    });
  }

  render() {
    return React.createElement(
      'div',
      { className: 'app' },
      React.createElement(
        'h2',
        null,
        'Age Reversal Calculator'
      ),
      this.state.birthdays.length < 2 && React.createElement(
        'p',
        null,
        'Enter at least two dates of birth below.'
      ),
      React.createElement(BirthdayEntryForm, { submitBirthday: this.addBirthdayToList }),
      React.createElement(BirthdayList, { updateBirthday: this.updateBirthday, deleteBirthday: this.deleteBirthday, birthdays: this.state.birthdays }),
      React.createElement(ReversalsDisplay, { numBirthdays: this.state.birthdays.length, reversals: this.state.reversals })
    );
  }
}

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));
