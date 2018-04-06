import {
  StackNavigator,
} from 'react-navigation';
import ImportPage from './ImportPage';
import HistoryPage from './HistoryPage';
import SendPage from './SendPage';

const App = StackNavigator(
  {
    Import: { screen: ImportPage},
    History: { screen: HistoryPage },
    Send: { screen: SendPage },
  },
  {
    initialRouteName: 'Import',
  }
);
export default App;
