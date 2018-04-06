import React, { Component } from 'react';
import {
  Text,
} from 'react-native';

export default class HistoryPage extends Component<{}> {
  static navigationOptions = {
    header: null,
  }

  render() {
    const { params } = this.props.navigation.state;
    const user = params ? params.user : null;

    return (
      <Text>Hello, {user.name}!</Text>
    );
  }
}
