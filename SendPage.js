import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  Button,
  Alert,
  TouchableOpacity
} from 'react-native';
import Modal from "react-native-modal";
import Keyboard from 'react-native-keyboard';

export default class SendPage extends Component<{}> {
  static navigationOptions = {
    header: null,
  }

  _toggleModal() {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }

  constructor(props) {
    super(props);
    this.state = {
      amount: '',
      address: '',
      isModalVisible: false,
      confirmation: '',
    };

    const { params } = this.props.navigation.state;
    if (params) {
      this.user = params.user;
      this.access_token = params.access_token;
    }
  }

  componentDidMount() {
    model.onChange((model) => {
      this.setState({amount: model.getKeys().join('')});
    });
  }

  _handleClear() {
    model.clearAll();
  }

  _handleDelete() {
    model.delKey();
  }

  _handleKeyPress(key) {
    model.addKey(key);
  }

  async _sendMoney() {
    try {
      const endpoint = 'https://api.coinbase.com/v2/accounts/' + this.user.account_id + '/transactions';
      const header = new Headers();
      header.append('Authorization', 'Bearer ' + this.access_token);
      header.append('CB-VERSION', '2017-07-11');
      const form = new FormData();
      form.append('type', 'send');
      form.append('to','3L5zW2rAcvV6CaypFBM2F7ZGCqMyZE4i89');
      //form.append('to', this.state.address);
      form.append('amount', this.state.amount);
      form.append('currency', 'BTC');
      let response = await fetch(
        endpoint, {
          method: 'POST',
          body: form,
          headers: header
        }
      );
      let data = await response.json();
      console.log(data);
      if (data.errors[0].id == 'invalid_request') {
        Alert.alert(
          'Error',
          data.errors[0].message,
          [
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          { cancelable: false }
        );
      }
      else {
        this._toggleModal();
      }
     } catch(error) {
      console.log(error);
    }
  }

  async _confirmTransaction() {
    const endpoint = 'https://api.coinbase.com/v2/accounts/' + this.user.account_id + '/transactions';
    const header = new Headers();
    header.append('Authorization', 'Bearer ' + this.access_token);
    header.append('CB-VERSION', '2017-07-11');
    header.append('CB-2FA-TOKEN', this.state.confirmation);
    const form = new FormData();
    form.append('type', 'send');
    form.append('to','3L5zW2rAcvV6CaypFBM2F7ZGCqMyZE4i89');
//    form.append('to', this.state.address);
    form.append('amount', this.state.amount);
    form.append('currency', 'BTC');
    let response = await fetch(
      endpoint, {
        method: 'POST',
        body: form,
        headers: header
      }
    );
    let data = await response.json();
    console.log(data);
    if (data.errors!=null && data.errors[0].id == 'validation_error') {
      this._toggleModal();
      Alert.alert(
        'Error',
        data.errors[0].message,
        [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        { cancelable: false }
      );
    }
    else {
      Alert.alert(
        'Alert Title',
        'Transaction requested',
        [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        { cancelable: false }
      );
      const { navigate } = this.props.navigation;
      navigate('Loading');
    }
  }

  render() {
    return (
      <View style={styles.overall}>
        <View style={styles.addressSection}>
          <Text>Type in the destination address</Text>
          <View style={styles.addressInputContainer}>
            <TextInput style={styles.addressInput}
              onChangeText={(text) => this.setState({address: text})}
              value={this.state.address}
            />
          </View>
        </View>
        <View style={styles.paySection}>
          <View style={styles.viewPort}>
            <Text>Type in the amount to send</Text>
            <View style={styles.amountContainer}>
              <Text style={styles.amount}>{this.state.amount}</Text>
            </View>
          </View>
          <View style={styles.keyboardContainer}>
            <Keyboard
              keyboardType="decimal-pad"
              onClear={this._handleClear.bind(this)}
              onDelete={this._handleDelete.bind(this)}
              onKeyPress={this._handleKeyPress.bind(this)}
            />
            <Button style={styles.payButton} title='Pay' onPress={() => {this._sendMoney()}} />
          </View>
        </View>
        <Modal isVisible={this.state.isModalVisible}>
          <View style={styles.modalContainer}>
            <Text>Enter verification code</Text>
            <TextInput style={styles.confirmationCode}
              onChangeText={(text) => this.setState({confirmation: text})}
              value={this.state.confirmation}
            />
            <Button style={styles.modalConfirmationButton} title='Confirm' onPress={() => {this._confirmTransaction()}} />
          </View>
        </Modal>
      </View>
    );
  }
}



let model = {
  _keys: [],
  _listeners: [],
  addKey(key) {
    this._keys.push(key);
    this._notify();
  },
  delKey() {
    this._keys.pop();
    this._notify();
  },
  clearAll() {
    this._keys = [];
    this._notify();
  },
  getKeys() {
    return this._keys;
  },
  onChange(listener) {
    if (typeof listener === 'function') {
      this._listeners.push(listener);
    }
  },
  _notify() {
    this._listeners.forEach((listner) => {
      listner(this);
    });
  }
};

const styles = StyleSheet.create({
  overall: {
    flex: 1,
  },
  addressSection: {
    flex: 1,
    backgroundColor: '#fff',
  },
  paySection: {
    flex: 1,
    justifyContent: 'space-between'
  },
  amount: {
    fontSize: 30,
  },
  amountContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewPort: {
    flex: 1,
  },
  keyboardContainer: {
  },
  payButton: {
  },
  addressInput: {
  },
  addressInputContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    margin: 50,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#FFF'
  },
  modalConfirmationButton: {
  },
  confirmationCode: {
  }
});
