import React, { Component } from 'react';
import {
  Image,
  View,
  StyleSheet,
  AsyncStorage
} from 'react-native';
import FormData from 'form-data';
import TokenProcessor from './TokenProcessor';

export default class LoadingPage extends Component<{}> {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props);
    this.processor = new TokenProcessor();
  }

  componentDidMount() {
    var loaded = this._loadWallet();
    if (loaded) {
        }
    else {
      // navigate to import wallet
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

  async _loadWallet() {
    const { navigate } = this.props.navigation;
    try {
      var rt = await AsyncStorage.getItem('refresh_token');
      console.log("Refresh token found!");
      if (rt !== null){
        var { access_token, refresh_token } = await this._refreshToken(rt);
        if (access_token == null) {
          console.log("Wallet not loaded, attempting import");
          navigate('Import');
        }
        console.log("Access token successfully retrieved from Refresh token");
        this.access_token = access_token;
        await AsyncStorage.removeItem('refresh_token');
        await AsyncStorage.setItem('refresh_token', refresh_token);
        await this.processor.processCode(access_token);

        console.log("Wallet loaded successfully!");
        // navigate to history page
        navigate('History', {
          user: this.processor.user,
          transaction_history: this.processor.transaction_history,
          access_token: this.access_token
        });
      }
      else {
        console.log("Refresh token not there");
        console.log("Wallet not loaded, attempting import");
        navigate('Import');
      }
    } catch (error) {
      console.log(error);
      console.log("Wallet not loaded, attempting import");
      navigate('Import');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={require('./Resources/logo.png')} style={styles.logo} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  }
});
