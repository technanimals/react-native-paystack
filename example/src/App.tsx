import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import { Currency, Paystack } from 'rn-paystack';

export default function App() {
  return (
    <View style={styles.container}>
      <Paystack
        amount={100}
        email="lebogang.midas@gmail.com"
        publicKey="pk_test_ca099121c0d4094ae0b9c12995ef4536d80ab6ee"
        onCancel={console.log}
        onSuccess={console.log}
        autoStart={true}
        channels={['card']}
        currency={Currency.SOUTH_AFRICAN_RAND}
        label="Lebogang Mabala"
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
