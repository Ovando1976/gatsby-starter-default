import { createStore } from 'redux';
import { Provider } from 'react-redux';

// Your root reducer (combine reducers if you have multiple)
import rootReducer from './reducers';

// Create your store
const store = createStore(rootReducer);

export default store;