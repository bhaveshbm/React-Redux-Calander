import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import moment from 'moment'
import ReminderForm from './ReminderForm'
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';

const week = [
  'Sun',
  'Mon',
  'Tue',
  'Wen',
  'Thu',
  'Fri',
  'Sat'
]


let currentmonth, addNew, eventList, editRec;

const calendar = (month, year) => {
  const firstDay = moment([year, month, 1])
  const lastDay = moment([year, month, 1]).add('months', 1).date(0);
  const startWeek = firstDay.week()
  const endWeek = lastDay.week()
  let weeks = []
  const length = endWeek === 1 ? 53 : endWeek
  for (var week = startWeek; week <= length; week++) {
    weeks.push({
      week: week,
      days: Array(7).fill(0).map((n, i) => {
        const d = firstDay.week(week).startOf('week').clone().add(n + i, 'day')
        if (d.month() === month && d.year() === year)
          return d;
        else
          return undefined;
      })
    })
  }
  return weeks
}

const tableHeader = (day) => {
  return <th key={day}>{day}</th>
}

const tableBody = (week, i) => {

  return <tr key={week.week}>
    {week.days.map(tableCell)}
  </tr>
}

const tableCell = (day, index) => {
  if (day) {
    let list = eventList.filter((e) => e.date.format('DD-MM-YYYY') === day.format('DD-MM-YYYY'))
    if (list.length) {
      list = list.sort((a, b) => a.date - b.date)
    }
    return <td key={'td' + index} className='calendarCell'>
      {day.date()}
      <button onClick={() => addNew(day)}>+</button>
      <div className='reminderList'>
        {list.map((l, i) => <div key={'record' + l.id} style={{ color: l.color }} onClick={() => editRec(l)}>
          {l.date.format('HH:MM')} : {l.text}
        </div>)}
      </div>
    </td>
  } else {
    return <td key={'td' + index} className='calendarCell notCurrentMonth' />
  }
}

class MonthView extends Component {
  render() {
    const { currentMonth, currentYear, showPopup, events, edit } = this.props
    currentmonth = currentMonth
    addNew = showPopup
    eventList = events
    editRec = edit
    return (
      <table>
        <thead>
          <tr>
            {week.map(tableHeader)}
          </tr>
        </thead>
        <tbody>
          {calendar(currentMonth, currentYear).map(tableBody)}
        </tbody>
      </table>
    );
  }
}

class MonthHeader extends Component {
  render() {
    const { currentMonth, currentYear, setPrevMonth, setNextMonth } = this.props
    const dd = moment([currentYear, currentMonth, 1])
    return (
      <div>
        <button onClick={setPrevMonth}>Prev</button>
        <span className='monthTitle'>{dd.format('MMMM')} {currentYear}</span>
        <button onClick={setNextMonth}>Next</button>
      </div>
    )
  }
}



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMonth: moment().get('M'),
      currentYear: moment().get('Y'),
      displayReminder: 'hidePopup',
      reminderDate: moment(),
      isEditRecord: false,
      record: {
        text: 'new Reminder',
        color: 'blue',
        id: props.newRecordId
      }
    };
    this.setPrevMonth = this.setPrevMonth.bind(this);
    this.setNextMonth = this.setNextMonth.bind(this);
    this.hidePopup = this.hidePopup.bind(this);
    this.showPopup = this.showPopup.bind(this);
    this.setReminderDate = this.setReminderDate.bind(this);
    this.edit = this.edit.bind(this);
  }
  setPrevMonth() {
    const { currentMonth, currentYear } = this.state
    if (currentMonth === 0) {
      this.setState({ currentMonth: 11, currentYear: currentYear - 1 })
    } else {
      this.setState({ currentMonth: currentMonth - 1 })
    }
  }
  setNextMonth() {
    const { currentMonth, currentYear } = this.state
    if (currentMonth === 11) {
      this.setState({ currentMonth: 0, currentYear: currentYear + 1 })
    } else {
      this.setState({ currentMonth: currentMonth + 1 })
    }
  }
  setReminderDate(newDate) {
    this.setState({ reminderDate: newDate })
  }
  showPopup(selectedDate) {
    this.setState({ displayReminder: 'showPopup', reminderDate: selectedDate, isEditRecord: false })
  }
  hidePopup() {
    this.setState({ displayReminder: 'hidePopup' })
  }
  edit(editRecord) {
    this.setState({
      displayReminder: 'showPouup',
      reminderDate: editRecord.date,
      isEditRecord: true,
      record: editRecord
    })
  }
  render() {
    const { currentMonth, currentYear, reminderDate, isEditRecord, record } = this.state

    return (
      <div>
        <MonthHeader currentMonth={currentMonth} currentYear={currentYear} setPrevMonth={this.setPrevMonth} setNextMonth={this.setNextMonth} />
        <MonthView currentMonth={currentMonth} currentYear={currentYear} showPopup={this.showPopup} events={this.props.reminders} edit={this.edit} />
        <div className={this.state.displayReminder}>
          <ReminderForm hidePopup={this.hidePopup}
            reminderDate={reminderDate}
            setReminderDate={this.setReminderDate}
            isEditRecord={isEditRecord}
            record={record}
          />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    reminders: state.reminders
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App)