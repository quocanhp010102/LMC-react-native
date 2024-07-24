import { Group, Image, Path, useImage, Skia } from '@shopify/react-native-skia';
import React from 'react';
const defaultImageSize = 200;

export function makeHexagonPath(size, offset) {
    const path = Skia.Path.Make();
    let [xOffset, yOffset] = offset || [0, 0];
    if (!size) size = 10;
    // https://www.quora.com/How-can-you-find-the-coordinates-in-a-hexagon
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
    path.moveTo(...points[0]);
    points.forEach((point) => path.lineTo(...point));
    path.close();
    return path;
}

export default function ClipImage({ imageSrc, skiaImage, imageSize = defaultImageSize,imagePosition=[0,0] } : any) {
    const hexagonSize = imageSize / 2;
    const path = makeHexagonPath(hexagonSize, [hexagonSize+imagePosition[0], hexagonSize+imagePosition[1]]);
    const [x,y] = imagePosition
    // I've tried allowing for urls/uris to be passed and converted to Skia Images within this component
    // but it doesn't work
    const image = useImage(imageSrc);
    console.log("eeee" ,image,skiaImage)

    return (
        <Group clip={path}>
            {(image || skiaImage)  ? (
                <Image
                    image={skiaImage || image}
                    fit="cover"
                    x={x}
                    y={y}
                    width={imageSize}
                    height={imageSize}
                />
            ):(
                <Path path={path} color="lightblue" />
            )}
        </Group>
    );
}
