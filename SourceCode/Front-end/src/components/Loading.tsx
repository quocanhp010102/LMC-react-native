import React from 'react'
// import 'antd/dist/antd.css';
// import './index.css';
import { LoadingOutlined } from '@ant-design/icons'

type Props = {
    size?: number
    color?: string
}

export default function Loading({ size, color }: Props) {
    return <LoadingOutlined style={{ fontSize: size || 24, color: color || 'blue_bg' }} spin />
}
