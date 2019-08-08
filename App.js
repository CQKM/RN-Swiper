
import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RNSwiper from './lib'

export default class App extends Component{
  render() {
    return (
      <View style={styles.container}>
        <RNSwiper style={styles.container}>
          {
            [1,2,3].map(item => <Text key={item} style={styles.font}>{item}</Text>)
          }
        </RNSwiper>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  font: {
    color: '#fff',
    fontSize: 30
  },
});
