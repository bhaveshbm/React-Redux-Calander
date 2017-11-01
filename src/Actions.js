import * as types from './actionTypes'

export const addEventAction = (Obj) => {
  return disptach => {
    disptach({ type: types.CREATE_REMINDER, response: Obj })
    disptach({ type: types.NEW_RECORD_ID});
  }
}
export const updateEventAction = (Obj) => ({ type: types.UPDATE_REMINDER, response: Obj });
export const deleteEventAction = (Obj) => ({ type: types.DELETE_REMINDER, response: Obj });
