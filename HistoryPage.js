import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Button
} from 'react-native';
import HistoryTabs from './HistoryTabs';

export default class HistoryPage extends Component<{}> {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props);
    
    const { params } = this.props.navigation.state;
    if (params) {
      this.user = params.user;
      this.transaction_history = params.transaction_history;
      this.buy_history = params.buy_history;
      this.access_token = params.access_token;
    }
  }

  _goToSendPage = () => {
    const { navigate } = this.props.navigation;
    navigate('Send', {access_token: this.access_token, user: this.user});
  }

  render() {
    return (
      <View style={styles.overall}>
        <View style={styles.account_container}>
          <Text>Hello, {this.user.name}!</Text>
          <Text>Current balance: {this.user.balance} {this.user.currency_code}</Text>
          <Text>Address: {this.user.address}</Text>
        </View>
        <View style={styles.history_container}>
          <HistoryTabs sent_history={this.transaction_history} buy_history={this.buy_history} />
        </View>
        <Button style={styles.sendButton} title='Send money' onPress={this._goToSendPage} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  account_container: {
    padding: 10,
    flex: 1,
    backgroundColor: '#fff',
    elevation: 5,
  },
  history_container: {
    flex: 4,
  },
  sendButton: {
  },
  overall: {
    flex: 1,
  }
});
