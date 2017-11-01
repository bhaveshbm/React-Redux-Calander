import { combineReducers } from 'redux'
import initialState from './initialState'
import * as types from '../actionTypes'

const reminderReducer = (state = initialState.reminders, action) => {
  let filtered;
  switch (action.type) {
    case types.CREATE_REMINDER:
      return [...state, action.response];
    case types.UPDATE_REMINDER:
      filtered = state.filter((f) => f.id !== action.response.id);
      return [...filtered, action.response];
    case types.DELETE_REMINDER:
      filtered = state.filter((f) => f.id !== action.response.id);
      return [...filtered];
    default:
      return state;
  }
}

const recordIdReducer = (state = initialState.newRecordId, action) => {
  switch(action.type) {
    case types.NEW_RECORD_ID:
      console.log(state + 1)
      return state + 1
    default:
      return state
  }
}
const rootReducer = combineReducers({
  reminders: reminderReducer,
  recordId: recordIdReducer
})

export default rootReducer