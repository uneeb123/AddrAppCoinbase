import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  Linking,
  AsyncStorage,
  Image
} from 'react-native';
import FormData from 'form-data';
import TokenProcessor from './TokenProcessor';

export default class ImportPage extends Component<{}> {
  static navigationOptions = {
    header: null,
  };

  _authorize = () => {
    const scope = encodeURIComponent("wallet:user:read,wallet:addresses:read,wallet:buys:read,wallet:deposits:read,wallet:sells:read,wallet:transactions:read,wallet:accounts:read,wallet:withdrawals:read");
    const auth_link = "https://www.coinbase.com/oauth/authorize?client_id=263f6916563d418f2438b4165728028481dd9058ad2ad7fff022ff36848d05c4&redirect_uri=addr-app%3A%2F%2Fcoinbase-oauth&response_type=code&scope=" + scope;
    Linking.openURL(auth_link).catch(err => console.error('An error occurred', err));
  }

  constructor(props) {
    super(props);
    this.processor = new TokenProcessor();
  }

  componentDidMount() {
    Home = this;
    Linking.addEventListener('url', (event) => {
      var url = require('url');
      var parsedUrl = url.parse(event.url);
      var query = parsedUrl.query
      var code = query.split('=')[1];
      Home._importWallet(code);
    });
  }

  async _importWallet(code) {
    var { access_token, refresh_token } = await this._getToken(code);
    await AsyncStorage.setItem('refresh_token', refresh_token);
    await this.processor._processCode(access_token); // alternatively, navigate to loading page
    // navigate to history page
    navigate('History', {
      user: this.processor.user,
      transaction_history: this.processor.transaction_history,
      buy_history: this.processor.buy_history,
      access_token: access_token
    });
  }

  async _getToken(code) {
    try {
      const form = new FormData();
      form.append('grant_type', 'authorization_code');
      form.append('code', code);
      form.append('client_id', '263f6916563d418f2438b4165728028481dd9058ad2ad7fff022ff36848d05c4');
      form.append('client_secret', 'bec712b0b2eeea68d612b0605cbf3abae91901b68cbf7d6cfbc9aa6a33771fec');
      form.append('redirect_uri', 'addr-app://coinbase-oauth');
      let response = await fetch(
        'https://api.coinbase.com/oauth/token', {
          method: 'POST',
          body: form,
        }
      );
      let data = await response.json();
      return data;
    } catch(error) {
      console.log(error);
    }
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', () => {});
  }

  render() {
    return (
      <View style={styles.container}>
        <Button
          onPress={this._authorize}
          title="Import Coinbase wallet" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
