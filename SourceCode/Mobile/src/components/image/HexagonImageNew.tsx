import React from "react";
import {Box} from "../../rebass";
import ClipImage from "./ClipImageHexagon";
import {WithSkiaWeb} from "@shopify/react-native-skia/lib/module/web";
import FastImage from "../FastImage";
import SkiaRoot from "./CheckImage";
import {Canvas, Skia, Group, Path, Image, useImage} from '@shopify/react-native-skia';
import { Image as ImageNative } from "react-native";

export function makeHexagonPath(size : number, offset : number[]) {
   
    const path = Skia.Path.Make();
    let [xOffset, yOffset] = offset || [0, 0];
    if (!size) size = 10;
    const halfed = size / 2;
    const sqrt = (Math.sqrt(3) * size) / 2;
    const points = [
        [size, 0], //a
        [halfed, sqrt], //b
        [-halfed, sqrt], //c
        [-size, 0], //d
        [-halfed, -sqrt], //e
        [halfed, -sqrt], //f
    ].map(([x, y]) => [x + xOffset, y + yOffset]);
    //@ts-ignore
    path.moveTo(...points[0]);

    //@ts-ignore
    points.forEach((point) => path.lineTo(...point));
    path.close();
    return path;
}

const ImageNewBackground = require('../../../assets/BackImageNew.png');

interface HexagonImageNewProps {
    height: number,
    width: number,
    uri: string,
    paddingLeft?: number
    paddingTop?: number
}

export const HexagonImageNew = (props: HexagonImageNewProps) => {
    const image = useImage(props.uri)
    const HexagonSize = props.height/2
    const path = makeHexagonPath(HexagonSize, [HexagonSize, HexagonSize]);
    return (
        <Box>
            <Box position={'absolute'}
                 style={{
                     top: props.paddingTop || 10,
                     left: props.paddingLeft || 20
                 }}>
                <ImageNative
                    source={ImageNewBackground}
                    style={{
                        height: props.height,
                        width: props.width,
                        resizeMode: 'contain',
                    }}
                />
            </Box>
            {/*{  props.uri &&    <DstATopComposition*/}
            {/*    dstImage={*/}
            {/*        props.uri ?*/}
            {/*            <Box position={'relative'}>*/}
            {/*                <FastImage*/}
            {/*                    style={{*/}
            {/*                        height: props.height,*/}
            {/*                        width: props.width,*/}
            {/*                        resizeMode: 'contain',*/}
            {/*                    }}*/}
            {/*                    source={{uri: props.uri}}*/}
            {/*                />*/}
            {/*            </Box>*/}
            {/*            : <Box></Box>*/}
            {/*    }*/}
            {/*    srcImage={*/}
            {/*        <Box>*/}
            {/*            <FastImage*/}
            {/*                source={ImageNewBackground}*/}
            {/*                style={{*/}
            {/*                    height: props.height,*/}
            {/*                    width: props.width,*/}
            {/*                    overflow: 'hidden',*/}
            {/*                }}*/}
            {/*                resizeMode={'stretch'}*/}
            {/*            />*/}
            {/*        </Box>*/}
            {/*    }*/}
            {/*/> }*/}
            <Canvas style={{ width : props.height, height : props.height , borderRadius : 30 }}>
                <Group clip={path}>
                    {(image)  ? (
                        <Image
                            image={image}
                            fit="cover"
                            x={0}
                            y={0}
                            width={props.height}
                            height={props.height}
                        />
                    ):(
                        <Path path={path} color="lightblue" />
                    )}
                </Group>
            </Canvas>


        </Box>
    )
}

