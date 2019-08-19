# RN-Swiper

#### ScreenShot
![image](https://github.com/CQKM/RN-Swiper/blob/master/screenshot.gif)

or
project/screenshot.gif


#### Usage

`yarn add rn-swiper` or `npm install rn-swiper`

```javascript
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
```
#### Properties

Prop | Default | Type | Description
-|-|-|-
slideStyle | {} | ViewStyle | 
loop | true | boolean | 
autoPlay | true | boolean |
autoPlayTimeOut | 3000 | number |
initIndex | 0 | number |
onIndexChanged | (index) => null | function |
renderPagination | (index) => null | JSX |
animation | (value, toValue) => Animated  | function |
