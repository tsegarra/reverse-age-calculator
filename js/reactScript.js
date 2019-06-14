class BirthdayEntryField extends React.Component {
  render() {
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

    return (
      <form className="bday-entry-field" autoComplete="off">
        <input id="name" placeholder="Name" />
        <select defaultValue="" id="month">
          <option disabled value="">Month</option>
          { monthOptions }
        </select>

        <select defaultValue="" id="day">
          <option disabled value="">Day</option>
          { daysOfMonthOptions }
        </select>

        <select defaultValue="" id="year">
          <option disabled value="">Year</option>
          { yearOptions }
        </select>
      </form>
    );
  }
}

class BirthdayEntryForm extends React.Component {
  render() {
    return (
      <div className="bday-entry-form">
        <BirthdayEntryField />
        <div className="buttons-container">
          <i id="btn-next" className="fas fa-long-arrow-alt-right" style={{ display:'none' }}></i>
        </div>
      </div>
    );
  }
}

class BirthdayList extends React.Component {
  render() {
    return (
      <div id="bday-list"></div>
    );
  }
}

class ReversalsDisplay extends React.Component {
  render() {
    return (
      <div style={{display:'none'}} className="reversals-display-container">
        <h3>Age reversals</h3>
        <div id="reversals-display"></div>
      </div>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <h2>Age Reversal Calculator</h2>
        <p>Enter at least two dates of birth below.</p>
        <BirthdayEntryForm />
        <BirthdayList />
        <ReversalsDisplay />
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
