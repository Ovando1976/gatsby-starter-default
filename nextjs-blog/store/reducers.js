import { combineReducers } from 'redux';

// User reducer
const userInitialState = null;
const userReducer = (state = userInitialState, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.payload;
    case 'LOGOUT_USER':
      return null;
    default:
      return state;
  }
};

// Error reducer
const errorInitialState = null;
const errorReducer = (state = errorInitialState, action) => {
  switch (action.type) {
    case 'SET_ERROR':
      return action.payload;
    case 'CLEAR_ERROR':
      return null;
    default:
      return state;
  }
};

// Combine the reducers
const rootReducer = combineReducers({
  user: userReducer,
  error: errorReducer
});

export default rootReducer;
