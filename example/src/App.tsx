import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import { Currency, PaystackView } from '@technanimals/react-native-paystack';

export default function App() {
  return (
    <View style={styles.container}>
      <PaystackView
        payment={{
          amount: '10000',
          email: 'lebogang.midas@gmail.com',
          key: 'pk_test_ca099121c0d4094ae0b9c12995ef4536d80ab6ee',
          channels: ['card'],
          currency: Currency.SOUTH_AFRICAN_RAND,
          lastName: 'Mabala',
          firstName: 'Lebogang',
        }}
        onCancel={console.log}
        onSuccess={console.log}
        autoStart={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
