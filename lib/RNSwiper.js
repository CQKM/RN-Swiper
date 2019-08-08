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
        // 最近一次的移动距离为gestureState.move{X,Y}
        console.log('onPanResponderTerminate',gestureState.dx)
        // console.log('onPanResponderTerminate',gestureState.moveX)
        // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
        this.onPanResponderMove(gestureState.dx)
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // console.log('onPanResponderRelease',evt,gestureState)
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
    console.log(activeIndex * childrenWidth)
    this.state.scrollValue.setValue(-activeIndex * childrenWidth + dx)
    // this.props.animation(this.state.scrollValue, -dx).start();
    // this.props.animation(dx, )
  }
  computeNextOrPrev = (gestureState) =>{
    console.log(gestureState.dx)
    let dx = gestureState.dx
    // > 0 Prev  < 0 Next
    if (dx === 0) return
    return dx > 0 ? 'Prev' : 'Next';
  }
  resetPosi = () => {

  }
  goPage = (gestureState) => {
    let nextStatu = this.computeNextOrPrev(gestureState)
    let { activeIndex } = this.state
    let pageNum = this.getPageNumber();
    let childrenWidth = styles.slideStyle.width;
    if (nextStatu === 'Prev') {
      let prevIndex = --activeIndex;
      this.setState({ activeIndex: prevIndex < 0 ? pageNum - 1 : prevIndex }, () => {
        console.log('prev', activeIndex)
        // this.props.animation(this.state.scrollValue, this.state.index * childrenWidth).start(() => {
        //     this.state.scrollValue.setValue(this.state.index * childrenWidth)
        // });
        // this.scrollViewRef.scrollTo({ x: this.state.index * childrenWidth, y: 0, animate: true })
      })
    } 
    if (nextStatu === 'Next') {
      let nextIndex = ++activeIndex;
      this.setState({ activeIndex: nextIndex }, () => {
        console.log('Next', activeIndex)
        this.props.animation(this.state.scrollValue, -this.state.activeIndex * childrenWidth).start(() => {
          if(nextIndex >= pageNum - 1){
            this.setState({
              activeIndex: 1,
            }, () => {
              this.state.scrollValue.setValue(-childrenWidth)
            })
            return
          }
          this.state.scrollValue.setValue(-this.state.activeIndex * childrenWidth)
        });
        // this.scrollViewRef.scrollTo({ x: this.state.index * childrenWidth, y: 0, animate: true })
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
  onScrollBeginDrag = (event) => {
    console.log('onScrollBeginDrag', event)
  }
  onScrollEndDrag = (event) => {
    console.log('onScrollEndDrag', event)
  }
  render (){
    const { children } = this.props
    const { activeIndex } = this.state
    let pageArr = this.getPageArr();
    let pageNum = this.getPageNumber();
    // console.log('index', index)
    const transform = [
      {
        translateX: this.state.scrollValue
      }
    ]
    const content = (
      <Animated.View
        style={[styles.wrapStyle,styles.flex_start,{ width: pageNum * width, transform}]}
        {...this._panResponder.panHandlers}
      >
        {
          pageArr.map((item,index) => {
            return (
              <View key={index} style={[styles.slideStyle, styles.flex_center, { backgroundColor: randomColor() }]}>
                {item}
              </View>
            )
          })
        }
      </Animated.View>
    )
    return (
      <View>
        <ScrollView
          ref={(ref) => {this.scrollViewRef = ref}}
          horizontal
          scrollEnabled={false}
          onScroll = {(event)=>{{
              // console.log(event.nativeEvent.contentOffset.x);//水平滚动距离
              // console.log(event.nativeEvent.contentOffset.y);//垂直滚动距离 
          }}}
          scrollEventThrottle = {200}
          // pagingEnabled
          // keyboardDismissMode='on-drag'
          // keyboardShouldPersistTaps='never'
          // contentContainerStyle={}
          // onMomentumScrollBegin={this.onMomentumScrollBegin}
          // onMomentumScrollEnd={this.onMomentumScrollEnd}
          // onScrollBeginDrag={this.onScrollBeginDrag}
          // onScrollEndDrag={this.onScrollEndDrag}
        >
          {
            content
          }
        </ScrollView>
      </View>
    )
  }
}
const styles = StyleSheet.create({
    flex_start: { justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center'},
    flex_center: { justifyContent: 'center', alignItems: 'center' },
    wrapStyle: { },
    slideStyle: { height: 200, width, backgroundColor: 'red' },
    
})