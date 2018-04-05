import {
  StackNavigator,
} from 'react-navigation';
import HomePage from './HomePage';

const App = StackNavigator({
  Home: { screen: HomePage },
});
export default App;
