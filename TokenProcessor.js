export default class TokenProcessor {
  constructor() {
    this.user = {};
    this.transaction_history = [];
    this.buy_history = [];
  }

  async processCode(access_token) {
    var userData = await this.getUser(access_token);
    var rawUser = userData.data;
    this.user.name = rawUser.name;
    this.user.id = rawUser.id;
    var accounts = await this.listAccounts(access_token);
    var rawAccount = accounts.data[0];
    this.user.account_id = rawAccount.id;
    this.user.currency_code = rawAccount.currency.code;
    this.user.balance = rawAccount.balance.amount;
    var account_id = accounts.data[0].id; // first account
    var response1 = await this.listAddresses(access_token, account_id);
    this.user.address = response1.data[0].address;
    var response2 = await this.listTransactions(access_token, account_id);
    await this.processRawTransactions(response2.data);
  }

  processRawTransactions(raw) {
    raw.forEach((raw_tx) => {
      this.processRawTransaction(raw_tx);
    });
  }

  processRawTransaction(raw) {
    // for now both buy and sell are part of buy history
    // they can be bundled together because you can differentiate
    // them by looking at the amount. they are mostly identical
    if (raw.type == 'buy' || raw.type == 'sell') {
      buy = {};
      buy.status = raw.status;
      buy.amount_BTC = raw.amount.amount;
      buy.amount_USD = raw.native_amount.amount;
      buy.create_date = raw.created_at;
      this.buy_history.push(tx);

    }
    else if (raw.type == 'send') {
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
    else {
      console.log(raw);
    }
  }

  async callApi(token, endpoint) {
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

  listAddresses(token, id) {
    return this.callApi(token, 'https://api.coinbase.com/v2/accounts/' + id + '/addresses');
  }

  getUser(token) {
    return this.callApi(token, 'https://api.coinbase.com/v2/user');
  }

  listAccounts(token) {
    return this.callApi(token, 'https://api.coinbase.com/v2/accounts');
  }

  listTransactions(token, id) {
    return this.callApi(token, 'https://api.coinbase.com/v2/accounts/' + id + '/transactions');
  }
}
