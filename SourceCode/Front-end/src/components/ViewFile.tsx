// import WebViewer from '@pdftron/webviewer'
import { useEffect, useRef } from 'react'

type Props = {
    url: string
}

export default function ViewFile({ url }: Props) {
    // const refView = useRef<HTMLDivElement>()
    // useEffect(() => {
    //     WebViewer(
    //         { path: '/node_modules/@pdftron/webviewer/public', initialDoc: '/img/assignment_24px.png' },
    //         refView.current,
    //     ).then((instance) => {})
    // }, [])

    return <div>{/* <div className="viewWeb h-[100vh]" ref={refView}></div> */}</div>
}
