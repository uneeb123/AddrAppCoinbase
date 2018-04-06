import {
  StackNavigator,
} from 'react-navigation';
import ImportPage from './ImportPage';
import HistoryPage from './HistoryPage';

const App = StackNavigator(
  {
    Import: { screen: ImportPage},
    History: { screen: HistoryPage },
  },
  {
    initialRouteName: 'Import',
  }
);
export default App;
