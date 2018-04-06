import React, { Component } from 'react';
import {
  Text,
  View
} from 'react-native';

export default class SendPage extends Component<{}> {
  static navigationOptions = {
    header: null,
  }

  render() {
    return (
      <Text>Send page!</Text>
    );
  }
}
