import PdfContainer from "./PdfContainer";
import { Heart, Menu } from "./FontIcons";
export default function ItemContainer({ item }) {
  return (
    <div className="group relative">
      <button
        type="button"
        className="z-20 bg-gray-700 bg-opacity-70  w-8 h-8 absolute rounded-md border text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black top-4 right-4"
      >
        <Menu />
      </button>
      <button
        type="button"
        className="z-20 bg-gray-700 bg-opacity-70 w-8 h-8 absolute rounded-md border  text-sm font-semibold text-blue-500 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black top-14 right-4"
      >
        <Heart />
      </button>
      <p className="z-20 absolute  top-4 left-4 text-lg group-hover:text-blue-600 group-hover:text-xl">
        Likes:0
      </p>
      <p className="z-20 absolute top-14 left-4 text-lg group-hover:text-blue-600 group-hover:text-xl">
        Views:0
      </p>
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
        <a href={item.pdfLink} className="flex justify-center items-center">
          <PdfContainer
            className="h-full w-full object-cover object-center lg:h-full lg:w-full"
            pdfLink={item.pdfLink}
          />
        </a>
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <img src={item.avatar} className="rounded-full w-8" />
            <a href={item.pdfLink}>{item.title}</a>
          </h3>
          <p className="mt-1 text-sm text-gray-500">{item.institute}</p>
        </div>
        <div>
          <h3 className="text-right mt-2 mb-2">{item.fullName}</h3>
          <p className="text-sm font-medium text-gray-900 text-right">
            {item.yearOfExam}
          </p>
          <p className="text-sm font-medium text-gray-900 text-right">
            {item.subject}
          </p>
        </div>
      </div>
    </div>
  );
}
