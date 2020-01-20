import Reactotron from 'reactotron-react-native';
import {AsyncStorage} from 'react-native';

if (__DEV__) {
  const tron = Reactotron.setAsyncStorageHandler(AsyncStorage)
    .configure({host: '192.168.15.7'})
    .useReactNative()
    .connect();

  console.tron = tron;

  tron.clear();
}
