
import { ViewStyle } from 'react-native'

interface RNSwiperProps {
    wrapStyle: ViewStyle
    slideStyle: ViewStyle
    onChangeIndex: () => {}
}

export default class RNSwiper extends Component <RNSwiperProps>{}
