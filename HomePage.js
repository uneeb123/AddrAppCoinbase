import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  Linking
} from 'react-native';
import FormData from 'form-data';

export default class HomePage extends Component<{}> {
  static navigationOptions = {
    title: 'Addr',
  };

  _authorize = () => {
    const auth_link = "https://www.coinbase.com/oauth/authorize?client_id=263f6916563d418f2438b4165728028481dd9058ad2ad7fff022ff36848d05c4&redirect_uri=addr-app%3A%2F%2Fcoinbase-oauth&response_type=code&scope=wallet%3Auser%3Aread"
    Linking.openURL(auth_link).catch(err => console.error('An error occurred', err));
  }

  componentDidMount() {
    Home = this;
    Linking.addEventListener('url', (event) => {
      var url = require('url');
      var parsedUrl = url.parse(event.url);
      var query = parsedUrl.query
      var code = query.split('=')[1];
      Home._processCode(code);
    });
  }

  async _processCode(code) {
    var { access_token, refresh_token } = await this._getToken(code);
    var response = await this._getAccount(access_token);
    var account = response.data
    console.log(Object.keys(account));
    console.log(account.name);
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
      console.log(data);
      return data;
    } catch(error) {
      console.log(error);
    }
  }

  async _getAccount(token) {
    try {
      var header = new Headers();
      header.append('Authorization', 'Bearer ' + token);
      header.append('CB-VERSION', '2017-07-11');
      let response = await fetch(
        'https://api.coinbase.com/v2/user', {
          headers: header,
        });
      let responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error(error);
    }
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', () => {});
  }

  _handleOpenURL(event, callback) {
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
      <Button
        onPress={this._authorize}
        title="Auth"
        color="#841584" />
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
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
