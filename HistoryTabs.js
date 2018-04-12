import * as React from 'react';
import {
  View,
  Animated,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Text,
} from 'react-native';
import { TabViewAnimated, SceneMap } from 'react-native-tab-view';

class Send extends React.Component {
  render() {
    let sentItem = this.props.item;

    let address = null;
    if (sentItem.to_address) {
      address = <Text>Sent to: {sentItem.to_address}</Text>;
    }
    let fee = <View />;
    if (sentItem.fee_BTC) {
      fee = <Text style={styles.feeAmount}>Fee: {sentItem.fee_BTC} BTC</Text>
    }
    let create_date = sentItem.create_date.replace(/T/, ' ').replace(/Z/, '');

    return (
      <View style={styles.sendContainer}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.statusText}>{sentItem.status}</Text>
          <Text style={styles.date}>{create_date}</Text>
        </View>
        <Text style={styles.amount}>{sentItem.amount_BTC} BTC</Text>
        {fee}
        {address}
      </View>
    );
  }
}

class Buy extends React.Component {
  render() {
    let sentItem = this.props.item;
    let create_date = sentItem.create_date.replace(/T/, ' ').replace(/Z/, '');
    let tag = sentItem.amount_BTC > 0 ? 'Bought': 'Sold';

    return (
      <View style={styles.sendContainer}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.statusText}>{sentItem.status}</Text>
          <Text style={styles.date}>{create_date}</Text>
        </View>
        <Text>{tag}</Text>
        <Text style={styles.amount}>{sentItem.amount_BTC} BTC</Text>
      </View>
    );
  }
}

export default class HistoryTabs extends React.Component {
  state = {
    index: 0,
    routes: [
      { key: 'first', title: 'Send/Receive' },
      { key: 'second', title: 'Buy/Sell' },
    ],
  };

  constructor(props) {
    super(props);

    this.sent_history = this.props.sent_history;
    // Looks like buy/sell is a notion of Coinbase to represent some special transactions
    // Addr does not support such transactions at the moment, for reference
    // https://developers.coinbase.com/api/v2#transaction-resource
    this.buy_history = this.props.buy_history;
  }

  _handleIndexChange = index => this.setState({ index });

  _renderHeader = props => {
    const inputRange = props.navigationState.routes.map((x, i) => i);

    return (
      <View style={styles.tabBar}>
      {props.navigationState.routes.map((route, i) => {
        const color = props.position.interpolate({
          inputRange,
          outputRange: inputRange.map(
            inputIndex => (inputIndex === i ? '#D6356C' : '#222')
          ),
        });
        return (
          <TouchableOpacity
            key={i}
            style={styles.tabItem}
            onPress={() => this.setState({ index: i })}>
            <Animated.Text style={{ color }}>{route.title}</Animated.Text>
          </TouchableOpacity>
        );
      })}
      </View>
    );
  };

  _FirstRoute = () => (
    <View style={[styles.container, { backgroundColor: '#F5FCFF' }]}>
      <FlatList
        data={this.sent_history}
        renderItem={({item}) => <Send item={item}/>}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
  
  _SecondRoute = () => (
    <View style={[styles.container, { backgroundColor: '#F5FCFF' }]} >
      <FlatList
        data={this.buy_history}
        renderItem={({item}) => <Buy item={item}/>}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );

  _renderScene = SceneMap({
    first: this._FirstRoute,
    second: this._SecondRoute,
  });

  render() {
    return (
      <TabViewAnimated
        navigationState={this.state}
        renderScene={this._renderScene}
        renderHeader={this._renderHeader}
        onIndexChange={this._handleIndexChange}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  sendContainer: {
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  date: {
    flex: 1,
    fontSize: 10,
    textAlign: 'right',
  },
  statusText: {
    flex: 1,
    fontSize: 10,
  },
  amount: {
    fontSize: 18,
  },
  feeAmount: {
    fontSize: 14,
  }
});
