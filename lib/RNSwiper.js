import React, { Component, PureComponent } from 'react'

import { View, Text, Animated, ScrollView, PanResponder, Dimensions, StyleSheet} from 'react-native'

const { width, height } = Dimensions.get("window")

function randomColor(){
  var r = Math.floor(Math.random()*256);
  var g = Math.floor(Math.random()*256);
  var b = Math.floor(Math.random()*256);
  var a = 0.5;
  return `rgba(${r},${g}, ${b}, ${a})`
};
export default class RNSwiper extends Component {
  static defaultProps = {
    animation: (value, toValue) => {
      return Animated.spring(value, {
        toValue: toValue,
        friction: 10,
        tension: 50,
        useNativeDriver: true
      });
    },
    wrapStyle: {},
    slideStyle: {},
    onChangeIndex: () => {  }
  }
  scrollViewRef;
  state = {
    activeIndex: 1,
    scrollValue: new Animated.Value(-styles.slideStyle.width),
  }
  dx = 0;
  componentWillMount() {
    this._panResponder = PanResponder.create({
      // 要求成为响应者：
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        console.log('onPanResponderGrant')
      },
      onPanResponderMove: (evt, gestureState) => {
        console.log('onPanResponderTerminate',gestureState.dx)
        this.onPanResponderMove(gestureState.dx)
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        this.goPage(gestureState)
      },
      onPanResponderTerminate: (evt, gestureState) => {
        console.log('onPanResponderTerminate',evt,gestureState.dx)
        console.log('onPanResponderTerminate',evt,gestureState.moveX)
        // 另一个组件已经成为了新的响应者，所以当前手势将被取消。
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        return true;
      },
    });
  }
  onPanResponderMove = (dx) => {
    let childrenWidth = styles.slideStyle.width;
    const { activeIndex } = this.state
    this.state.scrollValue.setValue(-activeIndex * childrenWidth + dx)
  }
  computeNextOrPrev = (gestureState) =>{
    let dx = gestureState.dx
    if (dx === 0) return // 单纯的点击事件
    return dx > 0 ? 'Prev' : 'Next';
  }
  goPage = (gestureState) => {
    let { activeIndex } = this.state
    let { onChangeIndex } = this.props
    let nextStatu = this.computeNextOrPrev(gestureState)
    let pageNum = this.getPageNumber();
    let childrenWidth = styles.slideStyle.width;
    if (nextStatu === 'Prev') {
      let prevIndex = --activeIndex;
      this.setState({ activeIndex: prevIndex }, () => {
        this.props.animation(this.state.scrollValue, -prevIndex * childrenWidth).start(() => {
          if(prevIndex <= 0){ // 第一张的时候，重新回到最后一张
            this.setState({ activeIndex: pageNum - 2 }, () => { this.state.scrollValue.setValue(-childrenWidth * ( pageNum - 2 )) })
            return
          }
          this.state.scrollValue.setValue(-prevIndex * childrenWidth)
        });
      })
    } 
    if (nextStatu === 'Next') {
      let nextIndex = ++activeIndex;
      console.log('nextIndex', nextIndex)
        this.setState({ activeIndex: nextIndex }, () => {
        this.props.animation(this.state.scrollValue, -nextIndex * childrenWidth).start(() => {
          if(nextIndex >= pageNum - 1){ // 最后一张的时候，重新回到第一张
            this.setState({ activeIndex: 1 }, () => { this.state.scrollValue.setValue(-childrenWidth) })
            return
          }
          this.state.scrollValue.setValue(-nextIndex * childrenWidth)
        });
      })
    }
  }
  getPageArr = () => {
    const { children } = this.props
    let childArr = React.Children.toArray(children)
    childArr.unshift(childArr[childArr.length - 1]);
    childArr.push(childArr[1]);
    return childArr
  }
  getPageNumber = () => {
    return this.getPageArr().length
  }
  componentDidMount () {

  }
  render (){
    const { slideStyle } = this.props
    let pageArr = this.getPageArr();
    let pageNum = this.getPageNumber();
    const transform = [{ translateX: this.state.scrollValue }]
    const content = (
      <Animated.View
        style={[styles.wrapStyle,styles.flex_start,{ width: pageNum * width, transform}]}
        {...this._panResponder.panHandlers}
      >
        {
          pageArr.map((item,index) => {
            return (
              <View key={index} style={[styles.slideStyle, styles.flex_center, { backgroundColor: randomColor() }, slideStyle]}>
                {item}
              </View>
            )
          })
        }
      </Animated.View>
    )
    return (
      <ScrollView
        ref={(ref) => {this.scrollViewRef = ref}}
        horizontal
        scrollEnabled={false}
        scrollEventThrottle = {200}
      >
        {
          content
        }
      </ScrollView>
    )
  }
}
const styles = StyleSheet.create({
    flex_start: { justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center'},
    flex_center: { justifyContent: 'center', alignItems: 'center' },
    wrapStyle: { },
    slideStyle: { height: 200, width, backgroundColor: 'red' },
})