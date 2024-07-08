import { pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

import { Document, Page } from "react-pdf";

function MyApp({ pdfLink }) {
  const pageNumber = 1;

  return (
    <div className="flex justify-center items-center">
      <Document width="100" file={pdfLink}>
        <Page pageNumber={pageNumber} className="w-full" width={300} />
      </Document>
    </div>
  );
}

export default MyApp;
