import ItemContainer from "./ItemContainer";
import {useNavigate} from "react-router-dom";

export default function Example({ heading,link, items}) {
  const navigate = useNavigate();
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6  lg:max-w-7xl lg:px-8">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            {heading}
          </h2>
          <button
            type="button"
            onClick={()=> navigate(link)}
            className="inline-flex items-center rounded-md px-3 py-2 text-lg  text-blue-900 hover:text-blue-300"
          >
            More items
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-2 h-4 w-4"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {items.map((item) => (
            <ItemContainer heading={heading} item={item} key={item._id} />
          ))}
        </div>
      </div>
    </div>
  );
}
