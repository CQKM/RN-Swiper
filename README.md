# RN-Swiper

#### ScreenShot
![image](https://github.com/CQKM/RN-Swiper/blob/master/screenshot.gif)

or
project/screenshot.gif


#### Usage

`yarn add rn-swiper` or `npm install rn-swiper`

`import RNSwiper from 'rn-swiper'`

```javascript
let data = 'HelloWord'.toUpperCase().split('')
const { width, height } = Dimensions.get("window")

<View style={styles.container}>
    <View style={{ height: 200 }}> // wrapStyle
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

```
#### Properties

Prop | Default | Type | Description
-|-|-|-
slideStyle | {} | ViewStyle | none
loop | true | boolean | Set to `false` to disable continuous loop mode.
autoPlay | true | boolean | Set to `true` enable auto play mode.
autoPlayTimeOut | 3000 | number | auto paly delay
initIndex | 0 | number | Index number of initial slide
onIndexChanged | (index) => null | function | Called with the new index when the user swiped
renderPagination | (index) => null | JSX | customize pagination
animation | (value, toValue) => Animated  | function | customize animated
