
import React, {Component} from 'react';
import {Text, StyleSheet, Image, View, Dimensions} from 'react-native';
import { RNSwiper } from './src/libs'
const { width, height } = Dimensions.get("window");

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={{height:250}}>
          <RNSwiper>
            <View style={[styles.wrapStyle]}>
                <Image style={[styles.wrapStyle]} source={{uri: 'http://i0.hdslb.com/bfs/article/a35ee19ab0ed6c9d339ed8a249bd04ba60bb810a.jpg'}} />
            </View>
            <View style={[styles.wrapStyle]}>
                <Image style={[styles.wrapStyle]} source={{uri: 'http://i0.hdslb.com/bfs/article/cfc269a0f43becbdde3e8766887763f393dacad2.png'}} />
            </View>
            <View style={[styles.wrapStyle]}>
                <Image style={[styles.wrapStyle]} source={{uri: 'http://i0.hdslb.com/bfs/article/d23204086da3554c7bea5dfcec8e785e8efb8c6c.jpg'}} />
            </View>
            <View style={[styles.wrapStyle]}>
                <Image style={[styles.wrapStyle]} source={{uri: 'http://attachments.gfan.com/forum/201504/15/202301silig00iwt0sgezn.jpg'}} />
            </View>
          </RNSwiper>
        </View>
        <Text style={{textAlign: 'center'}}>Other Content</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapStyle:{
    width: width,
    height: 250
  }
});
