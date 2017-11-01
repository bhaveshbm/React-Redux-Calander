import React, { Component } from 'react';
import { render } from 'react-dom';
import moment from 'moment'
import DatePicker from 'react-datepicker';
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

class ReminderForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reminder: props.record.text,
      selectedColour: props.record.color,
    };
    this.reminderTextChange = this.reminderTextChange.bind(this);
    this.dateChange = this.dateChange.bind(this);
    this.colorChange = this.colorChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.close = this.close.bind(this);
  }
  reminderTextChange(event) {
    this.setState({ reminder: event.target.value });
  }
  dateChange(date) {
    this.props.setReminderDate(date)
  }
  colorChange(event) {
    this.setState({ selectedColour: event.target.value })
  }
  handleSubmit(event) {
    const { hidePopup, addEvent, isEditRecord, record } = this.props
    const { reminder, selectedColour } = this.state
    event.preventDefault();
    const newObj = {
      text: reminder,
      date: this.props.reminderDate,
      color: selectedColour,
      id: record.id
    }
    addEvent(newObj, isEditRecord)
    hidePopup()
  }
  handleDelete(event) {
    event.preventDefault();
    this.props.deleteEvent();
  }
  close(event) {
    event.preventDefault();
    this.props.hidePopup();
  }
  render() {
    return (
      <form>
        <label>
          Reminder:
          <input type='text' maxLength='30' width='100' defaultValue={this.state.reminder} onChange={this.reminderTextChange} />
        </label>
        <label>
          Time:
            <DatePicker
            selected={this.props.reminderDate}
            onChange={this.dateChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={30}
            dateFormat="DD/MM/YYYY HH:mm"
          />
        </label>
        <label>
          Color:
            <select value={this.state.selectedColour} onChange={this.colorChange}>
            <option>blue</option>
            <option>red</option>
            <option>green</option>
            <option>yellow</option>
          </select>
        </label>
        <button className='submit' onClick={this.handleSubmit}>
          {this.props.isEditRecord
            ? 'Edit'
            : 'Save'
          }
        </button>
        {
          this.props.isEditRecord
            ? <button className='delete' onClick={this.handleDelete}>Delete</button>
            : ''
        }
        <button className='closeButton' onClick={this.close}>X</button>
      </form>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMonth: moment().get('M'),
      currentYear: moment().get('Y'),
      displayReminder: 'hidePopup',
      events: [],
      reminderDate: moment(),
      isEditRecord: false,
      record: {
        text: 'new Reminder',
        color: 'blue',
        id: 1
      },
      newRecordId: 1
    };
    this.setPrevMonth = this.setPrevMonth.bind(this);
    this.setNextMonth = this.setNextMonth.bind(this);
    this.hidePopup = this.hidePopup.bind(this);
    this.showPopup = this.showPopup.bind(this);
    this.addEvent = this.addEvent.bind(this);
    this.setReminderDate = this.setReminderDate.bind(this);
    this.edit = this.edit.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
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
  addEvent(Obj) {
    const { events, isEditRecord, newRecordId, recordId } = this.state
    if (!isEditRecord) {
      Obj.id = newRecordId
      this.setState({
        events: [...events, Obj],
        newRecordId: newRecordId + 1
      })
    } else {
      let e = this.state.events
      e = e.map((l) => {
        if (l.id === Obj.id) {
          return Obj;
        } else {
          return l;
        }
      })
      this.setState({
        events: e
      })
    }
  }
  edit(editRecord) {
    this.setState({
      displayReminder: 'showPouup',
      reminderDate: editRecord.date,
      isEditRecord: true,
      record: editRecord
    })
  }
  deleteEvent() {
    const { events, record } = this.state
    var index = events.findIndex(function (o) {
      return o.id === record.id;
    })
    if (index !== -1) {
      events.splice(index, 1);
      this.setState({ events })

    }
    this.hidePopup()
  }
  render() {
    const { currentMonth, currentYear, reminderDate, isEditRecord, record } = this.state

    return (
      <div>
        <MonthHeader currentMonth={currentMonth} currentYear={currentYear} setPrevMonth={this.setPrevMonth} setNextMonth={this.setNextMonth} />
        <MonthView currentMonth={currentMonth} currentYear={currentYear} showPopup={this.showPopup} events={this.state.events} edit={this.edit} />
        <div className={this.state.displayReminder}>
          <ReminderForm hidePopup={this.hidePopup}
            addEvent={this.addEvent}
            reminderDate={reminderDate}
            setReminderDate={this.setReminderDate}
            isEditRecord={isEditRecord}
            record={record}
            deleteEvent={this.deleteEvent}
          />
        </div>
      </div>
    )
  }
}

render(<App />, document.getElementById('root'));
