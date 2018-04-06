import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Button
} from 'react-native';

class Send extends Component<{}> {
  render() {
    let sentItem = this.props.item;

    let address = <Text>Sent to: Address not found!</Text>;
    if (sentItem.to_address) {
      address = <Text>Sent to: {sentItem.to_address}</Text>;
    }
    let fee = <View />;
    if (sentItem.fee_BTC) {
      fee = <Text>Fee: {sentItem.fee_BTC} BTC</Text>
    }
    let create_date = sentItem.create_date.replace(/T/, ' ').replace(/Z/, '');

    return (
      <View style={styles.sendContainer}>
        <Text>Transaction on {create_date}</Text>
        <Text>Status is {sentItem.status}</Text>
        <Text>Amount sent: {sentItem.amount_BTC} BTC</Text>
        {fee}
        {address}
      </View>
    );
  }
}

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
          <FlatList
            data={this.transaction_history}
            renderItem={({item}) => <Send item={item}/>}
            keyExtractor={(item, index) => index.toString()}
          />
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
    margin: 10,
    flex: 2,
  },
  sendContainer: {
    margin: 10,
  },
  sendButton: {
  },
  overall: {
    flex: 1,
  }
});
