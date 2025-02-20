import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import HomeScreen from './src/screens/HomeScreen/HomeScreen';

const App = (): React.JSX.Element => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.lighter} />
      <HomeScreen />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lighter,
  },
});

export default App;
