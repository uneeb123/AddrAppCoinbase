import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  Button
} from 'react-native';
import Keyboard from 'react-native-keyboard';

export default class SendPage extends Component<{}> {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      amount: '',
      address: '',
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
            <Button style={styles.payButton} title='Pay' onPress={()=>{}} />
          </View>
        </View>
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
  }
});
