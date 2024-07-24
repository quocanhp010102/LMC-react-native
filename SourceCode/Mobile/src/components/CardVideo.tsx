import {FastImage} from "components-base";
import {ResizeMode, Video} from "expo-av";
import React, {useEffect, useRef} from "react";
import {Box} from "../rebass";

export const CardVideo = (props: {
    id?: string;
    title?: string;
    createdDate?: any;
    link?: string;
    image?: string;
    choose?: any;
    navigation?: any;
    isHomeVideo?: boolean
    setState?: (value: any) => void
}) => {
    const video = useRef<Video | null>(null);

    const linkVideo = encodeURI(props.link || "");
    useEffect(() => {
        if (video.current && props.choose) {
            video.current.playAsync();
            // setTimeout(() => {
            //     video.current?._setFullscreen(true)
            // }, 300)

        }
    }, [props.choose]);

    React.useEffect(() => {
        const unsubscribe = props.navigation.addListener("blur", () => {
            if (video.current) {
                video.current.pauseAsync();
                // video.current?._setFullscreen(false)
            }
        });
        return unsubscribe;
    }, [props.navigation]);
    return (
        <Box alignItems="center">
            {props.choose != props.id ? (
                <Box height={props.isHomeVideo ? 98 : 200} width={"100%"}>
                    <FastImage
                        style={{
                            alignSelf: "center",
                            width: "100%",
                            height: props.isHomeVideo ? 98 : 200,
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8,
                        }}
                        source={{
                            uri: props.image,
                        }}
                    />
                </Box>
            ) : (
                <Box height={props.isHomeVideo ? 98 : 200} width={"100%"}>
                    <Video
                        ref={video}
                        style={{
                            alignSelf: "center",
                            width: "100%",
                            height: props.isHomeVideo ? 98 : 200,
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8,
                        }}
                        source={{
                            uri: linkVideo,
                        }}
                        onLoad={() => {
                            props.isHomeVideo && video.current?._setFullscreen(true)
                        }}
                        resizeMode={ResizeMode.CONTAIN}
                        isLooping
                        useNativeControls
                        onFullscreenUpdate={(e) => {
                            if (e.fullscreenUpdate === 3) {
                                props.isHomeVideo && props.setState?.({choose: null})
                            }
                        }}
                    />
                </Box>
            )}
        </Box>
    );
};
