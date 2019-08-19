
import { ViewStyle, Animated } from 'react-native'

interface RNSwiperProps {
    wrapStyle: ViewStyle
    slideStyle: ViewStyle
    onChangeIndex: () => {}
    loop: boolean
    autoPlay: boolean
    autoPlayTimeOut: number
    initIndex: number
    animation: Animated
    renderPagination: () => {};
}

export default class RNSwiper extends Component <RNSwiperProps>{}
