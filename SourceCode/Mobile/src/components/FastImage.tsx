import {  Image, ImageProps } from 'react-native'
import React from 'react'
import FastImage, { FastImageProps } from 'react-native-fast-image';


const FastImageItem = (props: ImageProps) => {

  
    
  return <Image {...props}></Image>;
};
// const FastImageItem = (props: FastImageProps) => {
    
//   return <FastImage {...props}></FastImage>;
// };


export default FastImageItem;

