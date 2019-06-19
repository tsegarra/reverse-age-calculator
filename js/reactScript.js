const monthNames = ['January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August', 'September', 'October',
  'November', 'December'];
const monthOptions = monthNames.map((monthName, index) =>
  <option key={index} value={index + 1}>{monthName}</option>
);

const daysOfMonth = [];
for (let i = 0; i < 31; i++) { daysOfMonth.push(i + 1); }
const daysOfMonthOptions = daysOfMonth.map((day) =>
  <option key={day}>{day}</option>
);

const years = [];
for (let i = new Date().getFullYear(); i >= 1900; i--) { years.push(i); }
const yearOptions = years.map((year) =>
  <option key={year}>{year}</option>
);

class BirthdaySubmitButton extends React.Component {
  render() {
    if (this.props.show) {
      return (
        <i onClick={this.props.handleSubmit} id="btn-next" className="fas fa-long-arrow-alt-right"></i>
      );
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
      showSubmitButton: false,
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
    this.props.submitBirthday(this.state.name, this.state.year,
      this.state.month, this.state.day);

    this.setState({
      name: '',
      month: '',
      day: '',
      year: '',
      showSubmitButton: false,
    });
  }

  render() {
    const shouldShowSubmitButton = this.state.name != '' && this.state.month != '' &&
          this.state.day != '' && this.state.year != '';

    return (
      <div className="bday-entry-form">
        <form className="bday-entry-field" autoComplete="off" onSubmit={this.handleSubmit}>
          <input id="name" placeholder="Name" value={this.state.name} onChange={this.handleChange} />
          <select id="month" value={this.state.month} onChange={this.handleChange}>
            <option disabled value="">Month</option>
            { monthOptions }
          </select>

          <select id="day" value={this.state.day} onChange={this.handleChange}>
            <option disabled value="">Day</option>
            { daysOfMonthOptions }
          </select>

          <select id="year" value={this.state.year} onChange={this.handleChange}>
            <option disabled value="">Year</option>
            { yearOptions }
          </select>

          <BirthdaySubmitButton handleSubmit={this.handleSubmit} show={shouldShowSubmitButton} />
        </form>
      </div>
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
      year: this.props.year,
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
    this.props.updateBirthday(this.props.id, this.state.name,
      this.state.day, this.state.month, this.state.year);
  }

  delete() {
    this.props.deleteThisBirthday(this.props.id);
  }

  render() {
    if (this.state.editing) {
      return (
        <div>
          <div>
            <input id="name" value={this.state.name} onChange={this.handleChange} />&mdash;
            <select id="month" value={this.state.month} onChange={this.handleChange}>
              <option disabled value="">Month</option>
              { monthOptions }
            </select>

            <select id="day" value={this.state.day} onChange={this.handleChange}>
              <option disabled value="">Day</option>
              { daysOfMonthOptions }
            </select>

            <select id="year" value={this.state.year} onChange={this.handleChange}>
              <option disabled value="">Year</option>
              { yearOptions }
            </select>
          </div>
          <div className="bdayControlBtns">
            <i className="bdayControlBtn saveBtn fas fa-check" onClick={this.save}></i>
            <i className="bdayControlBtn deleteBtn fas fa-trash" onClick={this.delete}></i>
          </div>
        </div>
      );
    } else {
      const dateString = this.props.month + '/' + this.props.day + '/' + this.props.year;
      return (
        <div>
          <span>{this.props.name} &mdash; {dateString}</span>
          <div className="edit-icon">
            <i className="fas fa-edit" onClick={this.edit}></i>
          </div>
        </div>
      );
    }
  }
}

class BirthdayList extends React.Component {
  render() {
    const birthdays = this.props.birthdays.map((item) =>
      <BirthdayItem key={item.id}
        deleteThisBirthday={this.props.deleteBirthday}
        updateBirthday={this.props.updateBirthday}
        id={item.id}
        name={item.name}
        month={item.date.getMonth() + 1}
        day={item.date.getDate()}
        year={item.date.getFullYear()} />
    );

    return (
      <div id="bday-list">{birthdays}</div>
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
      hash = ((hash<<5)-hash)+char;
      hash = hash & hash;
    }
    return hash;
  }

  render() {
    if (this.props.numBirthdays > 1) {
      const reversalElements = this.props.reversals.map((item) =>
        <p key={ this.hashString(item.toString()) }>{item.toString()}</p>
      );

      return (
        <div className="reversals-display-container">
          <h3>Age reversals</h3>
          <div id="reversals-display">
            { this.props.reversals.length < 1 && <p>No reversals found.</p> }
            { reversalElements }
          </div>
        </div>
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
      nextId: 0,
    };

    this.addBirthdayToList = this.addBirthdayToList.bind(this);
    this.deleteBirthday = this.deleteBirthday.bind(this);
    this.updateBirthday = this.updateBirthday.bind(this);
  }

  deleteBirthday(id) {
    this.setState(function(state, props) {
      const birthdays = state.birthdays.slice(0);
      for (let i = 0; i < birthdays.length; i++) {
        if (birthdays[i].id == id) {
          birthdays.splice(i, 1);
          break;
        }
      }
      return {
        birthdays: birthdays,
        reversals: ReversalFinder.findReversals(Object.values(birthdays)),
      };
    });
  }

  updateBirthday(id, name, day, month, year) {
    this.setState(function(state, props) {
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
        reversals: ReversalFinder.findReversals(Object.values(birthdays)),
      };
    });
  }

  addBirthdayToList(name, year, month, day) {
    this.setState(function (state, props) {
      const birthdays = state.birthdays.concat({
        id: state.nextId,
        name: name,
        date: new Date(parseInt(year), parseInt(month) - 1, parseInt(day)),
      });
      return {
        birthdays: birthdays,
        nextId: state.nextId + 1,
        reversals: ReversalFinder.findReversals(Object.values(birthdays)),
      };
    });
  }

  render() {
    return (
      <div className="app">
        <h2>Age Reversal Calculator</h2>
        { this.state.birthdays.length < 2 && <p>Enter at least two dates of birth below.</p> }
        <BirthdayEntryForm submitBirthday={this.addBirthdayToList} />
        <BirthdayList updateBirthday={this.updateBirthday} deleteBirthday={this.deleteBirthday} birthdays={this.state.birthdays} />
        <ReversalsDisplay numBirthdays={this.state.birthdays.length} reversals={this.state.reversals} />
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
