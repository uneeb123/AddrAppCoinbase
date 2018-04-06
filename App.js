import {
  StackNavigator,
} from 'react-navigation';
import ImportPage from './ImportPage';
import HistoryPage from './HistoryPage';
import SendPage from './SendPage';
import LoadingPage from './LoadingPage';

const App = StackNavigator(
  {
    Import: { screen: ImportPage},
    History: { screen: HistoryPage },
    Send: { screen: SendPage },
    Loading: { screen: LoadingPage },
  },
  {
    initialRouteName: 'Loading',
  }
);
export default App;
