// import React, { useState } from 'react';
// import { Document, Page, pdfjs  } from 'react-pdf';
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

// export default function TestFile() {
//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState<number>(1);
//   pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;
//   function onDocumentLoadSuccess({ numPages }:any) {
//     setNumPages(numPages);
//   }

//   const prePage = ()=> {
//       if(pageNumber > 1) {
//         setPageNumber((pageNumber:number) => pageNumber - 1)
//       }
//   }

//   const nextPage = ()=> {
//       if(pageNumber < numPages) {
//         setPageNumber((pageNumber:number) => pageNumber + 1);
//       }
//   }

//   return (
//     <div>
//         <a href='\img\ltmt1.pdf' download="file">Link bài giảng</a>
//       <Document file="/img/ltmt1.pdf" onLoadSuccess={onDocumentLoadSuccess}>
//         <Page pageNumber={pageNumber} />
//       </Document>
//       <p>
//         Page {pageNumber} of {numPages}
//       </p>

//       <div>
//           <button className='' onClick={prePage}>pre</button>
//           <button className=''  onClick={nextPage}>next</button>
//       </div>
//     </div>
//   );
// }

// import WebViewer from '@pdftron/webviewer'
import { useEffect, useRef } from 'react'

export default function TestFile() {
    const refView = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // WebViewer({ path: 'lib', initialDoc: '/img/Book1.xlsx' }, refView.current).then((instance) => {
        //   const { documentViewer } = instance.Core;
        //   documentViewer.setWatermark({
        //     // Draw diagonal watermark in middle of the document
        //     diagonal: {
        //       fontSize: 25, // or even smaller size
        //       fontFamily: 'sans-serif',
        //       color: 'red',
        //       opacity: 50, // from 0 to 100
        //       text: 'Watermark'
        //     },
        //     // Draw header watermark
        //     header: {
        //       fontSize: 10,
        //       fontFamily: 'sans-serif',
        //       color: 'red',
        //       opacity: 70,
        //       left: 'left watermark',
        //       center: 'center watermark',
        //       right: ''
        //     }
        // })
        // })
    }, [])

    return <div>{/* <div className="viewWeb h-[100vh]" ref={refView}></div> */}</div>
}
