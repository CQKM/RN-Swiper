
import { ViewStyle, Animated } from 'react-native'
interface RNSwiperProps {
    slideStyle: ViewStyle
    loop: boolean
    autoPlay: boolean
    autoPlayTimeOut: number
    initIndex: number
    animation: () => {}
    onChangeIndex: () => {}
    renderPagination: () => {}
}

export default class RNSwiper extends Component <RNSwiperProps>{}
