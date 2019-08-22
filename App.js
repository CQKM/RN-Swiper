
import React, {Component} from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import RNSwiper from 'rnezswiper'
const { width, height } = Dimensions.get("window")
let data = 'HelloWord'.toUpperCase().split('')
export default class App extends Component{
  state = {
    autoPlay: true
  }
  componentDidMount () {
    // setTimeout(() => {
    //   this.setState({
    //     autoPlay: false
    //   })
    // }, 4000)
  }
  render() {
    let { autoPlay } = this.state
    return (
      <View style={styles.container}>
        <View style={{ height: 200 }}>
          <RNSwiper
            loop
            autoPlay
            initIndex={0}
            onChangeIndex={(index) => {  }}
            slideStyle={styles.slideStyle}
            renderPagination={(index) => { // customize pagination
              return (
                <View style={[{ position: 'absolute', bottom: 0, height: 30, width, left: 0,zIndex: 1 }]}>
                  <Text style={{ color: '#fff',textAlign: 'center' }}>{`${index + 1}/${data.length}`}</Text>
                </View>
              )
            }}
          >
            {
              data.map(item => <Text key={item} style={styles.font}>{item}</Text>)
            }
          </RNSwiper>
        </View>
        <Text>other content</Text>
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
  slideStyle: { height: 200, width, backgroundColor: '#7e57c2' },
});
