import React, { Component, PureComponent } from 'react'
import { View, Text, Animated, ScrollView, PanResponder, Dimensions, StyleSheet,} from 'react-native'
const { width, height } = Dimensions.get("window")

export default class RNSwiper extends Component {
  static defaultProps = {
    slideStyle: {},
    loop: true,
    autoPlay: true,
    autoPlayTimeOut: 3000,
    initIndex: 0,
    onChangeIndex: () => {  },
    renderPagination: () => {},
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
  dx = 0;
  autoPlayTimer;
  state = {
    activeIndex: 1,
    scrollValue: new Animated.Value(-styles.slideStyle.width),
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      // 要求成为响应者：
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => { },
      onPanResponderMove: (evt, gestureState) => {
        this.getLoopStatus(gestureState) ? this.onPanResponderMove(gestureState.dx) : null
        this.stopAutoPlay();
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        let nextStatu = this.computeNextOrPrev(gestureState)
        this.getLoopStatus(gestureState) ? nextStatu ? this.goPage(nextStatu) : null : null;
        this.props.autoPlay
        ? (this.stopAutoPlay(),
          this.startAutoPlay())
        : null;
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // 另一个组件已经成为了新的响应者，所以当前手势将被取消。
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        return true;
      },
    });
  }
  
  componentWillReceiveProps (nextProps, nextState) {
    if (nextProps.autoplay) {
      this.startAutoPlay();
    } else {
        this.stopAutoPlay();
    }
  }

  componentDidMount () {
    const { autoPlay, initIndex } = this.props
    let index = (initIndex > this.getPageNumber() - 2 || initIndex < 0)
    ? (this.getPageNumber() - 2, this.console('warn', 'The props “initIndex” is out of range！'))
    : initIndex;
    console.log('index', index)
    if (autoPlay) {
      this.startAutoPlay()
    } else {
      this.stopAutoPlay()
    }
    this.goPage('Next', index, false)
  }
  startAutoPlay = () => {
    this.stopAutoPlay();
    this.autoPlayTimer = setInterval(() => {
      this.goPage('Next')
    }, this.props.autoPlayTimeOut)
  }
  stopAutoPlay = () => {
    if (this.autoPlayTimer) {
      clearInterval(this.autoPlayTimer)
    }
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
  goPage = (nextStatu = 'Next', index = undefined, animate = true) => {
    let { activeIndex } = this.state
    let childrenWidth = styles.slideStyle.width;
    let nextIndex = index !== undefined ? index : nextStatu === 'Prev' ? --activeIndex : ++activeIndex;
    this.getNowIndex(nextStatu, nextIndex)
    if (animate) {
      this.startGoPageAnimated(nextStatu, nextIndex)
    } else {
      let initIndex = nextIndex === 0 ? 1 : nextIndex === this.getPageNumber() - 2 ? 0 : ++nextIndex;
      this.setState({ activeIndex: initIndex }, () => { this.state.scrollValue.setValue(-initIndex * childrenWidth) })
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
          ? this.setState({ activeIndex: 1 }, () => { this.state.scrollValue.setValue(-childrenWidth); })
          : this.state.scrollValue.setValue(-nextIndex * childrenWidth)
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
  console = (type = 'log', msg = '') => {
    console[type](msg);
  }
  render (){
    const { slideStyle, renderPagination } = this.props
    const { activeIndex } = this.state
    let pageArr = this.getPageArr();
    let pageNum = this.getPageNumber();
    const transform = [{ translateX: this.state.scrollValue }]
    let pageIndex = activeIndex > this.getPageNumber() - 2 ? 0 : activeIndex <= 0 ? this.getPageNumber() - 3 : activeIndex - 1;
    const content = (
      <Animated.View
        style={[styles.flex_start,{ width: pageNum * width, transform}]}
        {...this._panResponder.panHandlers}
      >
        {
          pageArr.map((item,index) => {
            return (
              <View key={index} style={[styles.slideStyle, styles.flex_center, slideStyle]}>
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
        { content }
        <View style={[styles.slideStyle, { position: 'absolute',backgroundColor: 'transparents' }]}>
          {
            renderPagination(pageIndex)
          }
        </View>
      </ScrollView>
    )
  }
}
const styles = StyleSheet.create({
    flex_start: { justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center'},
    flex_center: { justifyContent: 'center', alignItems: 'center' },
    slideStyle: { height: 200, width, backgroundColor: 'red' },
})