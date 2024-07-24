import {View} from 'react-native'
import React from 'react'
import {useSafeAreaInsets} from 'react-native-safe-area-context';


const HeaderLogo = () => {
    const {top: statusBarHeight} = useSafeAreaInsets()


    return (
        <View
            style={{
                marginTop: statusBarHeight + 5,
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 15,
            }}
        >
            {/*<ICLogoHCM height={40} width={40}></ICLogoHCM>*/}
            {/*<Text style={{ flex: 1 }}>*/}
            {/*  ĐỀ ÁN XÂY DỰNG TRƯỜNG ĐẠI HỌC TRỌNG ĐIỂM VỀ HÀN QUỐC HỌC TẠI VIỆT NAM*/}
            {/*</Text>*/}
        </View>
    );
}

export default HeaderLogo