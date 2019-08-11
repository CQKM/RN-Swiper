
import { ViewStyle } from 'react-native'

interface RNSwiperProps {
    wrapStyle: ViewStyle
    slideStyle: ViewStyle
    onChangeIndex: () => {}
    loop: boolean
}

export default class RNSwiper extends Component <RNSwiperProps>{}
