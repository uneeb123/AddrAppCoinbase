import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet
} from 'react-native';

export default class HistoryPage extends Component<{}> {
  static navigationOptions = {
    header: null,
  }

  render() {
    const { params } = this.props.navigation.state;
    const user = params ? params.user : null;

    return (
      <View>
        <View style={styles.account_container}>
          <Text>Hello, {user.name}!</Text>
          <Text>Current balance: {user.balance} {user.currency_code}</Text>
          <Text>Address: {user.address}</Text>
        </View>
        <View style={styles.history_container}>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  account_container: {
    margin: 10,
    flex: 1,
  },
  history_container: {
    margin: 10,
    flex: 2,
  }
});
