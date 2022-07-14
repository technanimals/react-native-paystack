# React Native Paystack

Paystack webview

## Installation

```sh
npm install @technanimals/react-native-paystack
```

## Usage

```tsx
import * as React from 'react';

import { StyleSheet, SafeAreaView } from 'react-native';
import { Currency, PaystackView } from '@technanimals/react-native-paystack';

export function App() {
  return (
    <SafeAreaView style={styles.container}>
      <PaystackView
        payment={{
          amount: '10000', // Amount in cents
          email: '..',
          key: '..', // Paystack public key
          channels: ['card'],
          currency: Currency.SOUTH_AFRICAN_RAND,
          lastName: '..',
          firstName: '..',
        }}
        onCancel={console.log}
        onSuccess={console.log}
        onClose={console.log}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
