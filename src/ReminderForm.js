import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import DatePicker from 'react-datepicker';
import * as Actions from './Actions'

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
    console.log(this.props.newRecordId)
    const Obj = {
      text: reminder,
      date: this.props.reminderDate,
      color: selectedColour,
      id: isEditRecord 
        ? record.id
        : this.props.newRecordId
    }
    if (isEditRecord)
      this.props.updateEvent(Obj);
    else
      this.props.addEvent(Obj);
    hidePopup()
  }
  handleDelete(event) {
    event.preventDefault();
    const { record } = this.props
    this.props.deleteEvent(record);
    this.props.hidePopup();

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

function mapStateToProps(state) {
  return {
    newRecordId: state.recordId
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    addEvent: Actions.addEventAction,
    updateEvent: Actions.updateEventAction,
    deleteEvent: Actions.deleteEventAction
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ReminderForm)