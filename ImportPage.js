import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  Linking,
  AsyncStorage,
} from 'react-native';
import FormData from 'form-data';

export default class ImportPage extends Component<{}> {
  static navigationOptions = {
    title: 'Addr',
    header: null,
  };

  _authorize = () => {
    const scope = encodeURIComponent("wallet:user:read,wallet:addresses:read,wallet:buys:read,wallet:deposits:read,wallet:sells:read,wallet:transactions:read,wallet:accounts:read,wallet:withdrawals:read");
    const auth_link = "https://www.coinbase.com/oauth/authorize?client_id=263f6916563d418f2438b4165728028481dd9058ad2ad7fff022ff36848d05c4&redirect_uri=addr-app%3A%2F%2Fcoinbase-oauth&response_type=code&scope=" + scope;
    Linking.openURL(auth_link).catch(err => console.error('An error occurred', err));
  }

  constructor(props) {
    super(props);
    this.user = {};
    this.transaction_history = [];
  }

  componentDidMount() {
    this._loadWallet();
    Home = this;
    Linking.addEventListener('url', (event) => {
      var url = require('url');
      var parsedUrl = url.parse(event.url);
      var query = parsedUrl.query
      var code = query.split('=')[1];
      Home._importWallet(code);
    });
  }

  async _loadWallet() {
    try {
      var rt = await AsyncStorage.getItem('refresh_token');
      if (rt !== null){
        var { access_token, refresh_token } = await this._refreshToken(rt);
        await AsyncStorage.removeItem('refresh_token');
        await AsyncStorage.setItem('refresh_token', refresh_token);
        this._processCode(access_token);
      }
      else {
        console.log("Refresh token not there");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async _importWallet(code) {
    var { access_token, refresh_token } = await this._getToken(code);
    await AsyncStorage.setItem('refresh_token', refresh_token);
    Home._processCode(access_token);
  }

  async _processCode(access_token) {
    var userData = await this._getUser(access_token);
    var rawUser = userData.data;
    this.user.name = rawUser.name;
    this.user.id = rawUser.id;
    var accounts = await this._listAccounts(access_token);
    var rawAccount = accounts.data[0];
    this.user.account_id = rawAccount.id;
    this.user.currency_code = rawAccount.currency.code;
    this.user.balance = rawAccount.balance.amount;
    var account_id = accounts.data[0].id; // first account
    var response1 = await this._listAddresses(access_token, account_id);
    this.user.address = response1.data[0].address;
    var response2 = await this._listTransactions(access_token, account_id);
    await this._processRawTransactions(response2.data);
    const { navigate } = this.props.navigation;
    navigate('History', {user: this.user, transaction_history: this.transaction_history, access_token: access_token});
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

  async _refreshToken(refresh_token) {
    try {
      const form = new FormData();
      form.append('grant_type', 'refresh_token');
      form.append('client_id', '263f6916563d418f2438b4165728028481dd9058ad2ad7fff022ff36848d05c4');
      form.append('client_secret', 'bec712b0b2eeea68d612b0605cbf3abae91901b68cbf7d6cfbc9aa6a33771fec');
      form.append('refresh_token', refresh_token); 
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

  async _callApi(token, endpoint) {
    try {
      var header = new Headers();
      header.append('Authorization', 'Bearer ' + token);
      header.append('CB-VERSION', '2017-07-11');
      let response = await fetch(
        endpoint, {
          headers: header,
        });
      let responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.error(error);
    }
  }

  _listAddresses(token, id) {
    return this._callApi(token, 'https://api.coinbase.com/v2/accounts/' + id + '/addresses');
  }

  _getUser(token) {
    return this._callApi(token, 'https://api.coinbase.com/v2/user');
  }

  _listAccounts(token) {
    return this._callApi(token, 'https://api.coinbase.com/v2/accounts');
  }

  _listTransactions(token, id) {
    return this._callApi(token, 'https://api.coinbase.com/v2/accounts/' + id + '/transactions');
  }

  _processRawTransactions(raw) {
    raw.forEach((raw_tx) => {
      this._processRawTransaction(raw_tx);
    });
  }

  _processRawTransaction(raw) {
    if (raw.type == 'send') {
      tx = {};
      tx.status = raw.status;
      tx.amount_BTC = raw.amount.amount;
      tx.amount_USD = raw.native_amount.amount;
      tx.create_date = raw.created_at;
      if (raw.to != null) {
        tx.to_address = raw.to? raw.to.address: null;
      }
      tx.description = raw.description;
      if (raw.network != null && raw.network.transaction_fee != null) {
        tx.fee_BTC = raw.network.transaction_fee.amount;
      }
      this.transaction_history.push(tx);
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
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
