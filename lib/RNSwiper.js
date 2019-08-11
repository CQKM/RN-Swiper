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
    onChangeIndex: () => {  },
    loop: true,
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

        this.getLoopStatus(gestureState) ? this.onPanResponderMove(gestureState.dx) : null
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        this.getLoopStatus(gestureState) ? this.goPage(gestureState) : null
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
    let nextStatu = this.computeNextOrPrev(gestureState)

    let nextIndex = nextStatu === 'Prev' ? --activeIndex : ++activeIndex;
    if (nextStatu === 'Prev') {
      this.getNowIndex('Prev', nextIndex)
      this.startGoPageAnimated(nextStatu, nextIndex)
    }
    if (nextStatu === 'Next') {
        this.getNowIndex('Next', nextIndex)
        this.startGoPageAnimated(nextStatu, nextIndex)
    }
  }
  startGoPageAnimated = (nextStatu, nextIndex) => {
    let pageNum = this.getPageNumber();
    let childrenWidth = styles.slideStyle.width;
    this.setState({ activeIndex: nextIndex }, () => {
      this.props.animation(this.state.scrollValue, -nextIndex * childrenWidth).start(() => {
         // 上一页
        nextIndex <= 0 && nextStatu === 'Prev'
          ? this.setState({ activeIndex: pageNum - 2 }, () => { this.state.scrollValue.setValue(-childrenWidth * ( pageNum - 2 )) }) // 滑动动画
          : this.state.scrollValue.setValue(-nextIndex * childrenWidth); // 超出边界重置位置
         // 下一页
        nextIndex >= pageNum - 1 && nextStatu === 'Next'
          ? this.setState({ activeIndex: 1 }, () => { this.state.scrollValue.setValue(-childrenWidth) })
          :this.state.scrollValue.setValue(-nextIndex * childrenWidth)
      });
    })
  }
  getLoopStatus = (gestureState) => {
    let { activeIndex } = this.state
    let { loop } = this.props
    let nextStatu = this.computeNextOrPrev(gestureState)
    let nextIndex = nextStatu === 'Prev' ? --activeIndex : ++activeIndex;
    let pageNum = this.getPageNumber();
    let isLastPage = (nextIndex <= 0 || nextIndex >= pageNum - 1);
    console.log('isLastPage', isLastPage)
    return isLastPage ? isLastPage && loop : true;
  }
  getNowIndex = (status, index) => {
    const { onChangeIndex } = this.props
    const childLength = this.getPageNumber() - 2;
    status === 'Prev'
      ? onChangeIndex(index <= 0 ? childLength - 1 : index - 1)
      : onChangeIndex(index > childLength ? 0 : index - 1)
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