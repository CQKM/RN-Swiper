import React, { Component } from 'react'
import { ScrollView,Text,StyleSheet,View,Dimensions,PanResponder,Animated } from 'react-native'
const { width, height } = Dimensions.get("window");

export default class RNSwiper extends Component {
    static defaultProps = {
        horizontal: true,
        style: {},
        animation: (animate, toValue) => {
            return Animated.spring(animate, {
                toValue: toValue,
                useNativeDriver: true
            });
        }
    }

    static _panResponder = null
    pageNum;
    pageIndex = 0;
    state = {
        scrollValue: new Animated.Value(0)
    }
    componentWillMount () {
        this._panResponder = PanResponder.create({
          // 要求成为响应者：
          onStartShouldSetPanResponder: (evt, gestureState) => true,
          onMoveShouldSetPanResponder: (evt, gestureState) => true,
    
          onPanResponderGrant: (evt, gestureState) => {
            // 开始手势操作
            console.log('onPanResponderGrant手势开始')
          },
          onPanResponderMove: (evt, gestureState) => {
            // 最近一次的移动距离为gestureState.move{X,Y}
            // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
            console.log('onPanResponderMove,当前手势X位置',gestureState.moveX)
            console.log('onPanResponderMove,当前手势Y位置',gestureState.moveY)
            console.log('onPanResponderMove,当前手势离开始点X位置',gestureState.dx)
            console.log('onPanResponderMove,当前手势离开始点Y位置',gestureState.dy)
            this.onPanResponderMove(gestureState)
          },
          onPanResponderTerminationRequest: (evt, gestureState) => true, // 触碰其他组件时候，放权
          onPanResponderRelease: (evt, gestureState) => {
            // 一般来说这意味着一个手势操作已经成功完成。
            this.onPanResponderRelease(gestureState)
          },
          onPanResponderTerminate: (evt, gestureState) => {
            // 另一个组件已经成为了新的响应者，所以当前手势将被取消。
            this.onPanResponderTerminate()
          }
        });
    }
    // 手势完成
    onPanResponderRelease = (gestureState) => {
        console.log('onPanResponderRelease手势完成')
        // 获取下一个动作
        let nextAction = this.computedOffset(gestureState)
        console.log(nextAction.nextStatus === -1 ? '上一张': '下一张')
        nextAction.nextStatus === -1 ? this.prevPage(nextAction.offset): this.nextPage(nextAction.offset) ;
    }
    // 手势滑动
    onPanResponderMove = (gestureState) => {
        let offset = gestureState.dx
        console.log('this.getNowOffset()',this.getNowOffset())        
        this.props.animation(this.state.scrollValue,this.getNowOffset() + offset).start()
    }
    // 手势取消
    onPanResponderTerminate = () => {
        console.log('onPanResponderTerminate手势取消')
    }
    // 计算向前还是向后
    computedOffset = (gestureState) => {
        // 距离大于0 为上一张，反之
        return gestureState.dx > 0 ? { nextStatus: -1,offset: gestureState.dx } : { nextStatus: 1,offset: gestureState.dx };
    }
    prevPage = (offset) => {
        this.props.animation(this.state.scrollValue, this.getNowOffset('prev')).start(() => { --this.pageIndex })
    }
    nextPage = (offset) => {
        this.props.animation(this.state.scrollValue, this.getNowOffset('next')).start(() => { ++this.pageIndex })
    }
    // 获取偏移值
    getNowOffset = (action = 'now') => {
        switch (action) {
            case 'prev': return -((this.pageIndex - 1) * width);
            case 'now': return -((this.pageIndex) * width)
            case 'next': return -((this.pageIndex + 1) * width)
        }
        
    }
    renderChildren = () => {
        let content = React.Children.toArray(this.props.children);
        this.pageNum = content.length
        let translateX = this.state.scrollValue
        return (
            <Animated.View {...this._panResponder.panHandlers} style={{width: this.pageNum * width,flexDirection: 'row',transform: [{ translateX }] }}>
                {content}
            </Animated.View>
        )
    }

    render () {
        const { horizontal, style } = this.props
        return (
            <ScrollView
            style={style}
            horizontal={horizontal}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            >
                {/* 获取渲染的子元素 */}
                {
                    this.renderChildren()
                }
            </ScrollView>
        )
    }
}
const styles = StyleSheet.create({
    style: {
        flex: 1,
        backgroundColor: '#e8dcdc'
    },
})