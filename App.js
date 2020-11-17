import React, { useState } from 'react';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import { composeWithDevTools } from 'redux-devtools-extension';
import ReduxThunk from 'redux-thunk';
import * as firebase from 'firebase';
import * as facebook from 'expo-facebook';
import { Root } from 'native-base';

import JoboNavigator from './navigation/JoboNavigator';
import authReducer from './store/reducers/user/auth';
import ordersReducer from './store/reducers/orders';
import profileReducer from './store/reducers/user/profile';
import locationReducer from './store/reducers/location';
import currentJobReducer from './store/reducers/currentJob';
import settingsReducer from './store/reducers/settings';

const firebaseConfig = {
  apiKey: "AIzaSyAbvDxfinWTNM5cBoZoppej3L6N0pCM13s",
  authDomain: "jobo-3a84b.firebaseapp.com",
  databaseURL: "https://jobo-3a84b.firebaseio.com/",
  storageBucket: "gs://jobo-3a84b.appspot.com"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

facebook.initializeAsync({ appId: '918386268604007', appName: 'Jobo' });

const fetchFonts = () => {
  return Font.loadAsync({
    'poppins-regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'poppins-bold': require('./assets/fonts/Poppins-Bold.ttf')
  });
}

const rootReducer = combineReducers({
  auth: authReducer,
  orders: ordersReducer,
  profile: profileReducer,
  location: locationReducer,
  currentJob: currentJobReducer,
  settings: settingsReducer
});

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(ReduxThunk)));

export default function App () {
  const [dataLoaded, setDataLoaded] = useState(false);

  if (!dataLoaded) {
    return (
        <AppLoading
          startAsync={fetchFonts}
          onFinish={() => setDataLoaded(true)}
          onError={(err) => console.log(err)}
        />
    )
  }

  return (
    <Provider store={store}>
      <Root>
        <JoboNavigator />
      </Root>
    </Provider>
  );
}
