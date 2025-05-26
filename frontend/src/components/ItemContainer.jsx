import PdfContainer from "./PdfContainer";
import { Heart, Menu } from "./FontIcons";
import { useState } from "react";
import store from "../store";
import { SimpleApiHandler, ApiHandler } from "../utils/ApiHandler";

export default function ItemContainer({ heading, item }) {
  const userId = sessionStorage.getItem("userId");
  const [liked, setLiked] = useState(
    userId ? item.likes.includes(userId) : false
  );
  const [views, setViews] = useState(item.views);
  const [likes, setLikes] = useState(item.likes.length);

  const incrementViews = () => {
    setViews(views + 1);
    SimpleApiHandler(
      "files/view",
      "POST",
      {
        id: item._id,
        type: heading,
      },
      false
    ).then(window.open(item.pdfLink, "_blank"));
  };

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setLiked(!liked);
    ApiHandler(
      "files/like",
      "POST",
      {
        id: item._id,
        type: heading,
      },
      false
    ).catch((err) => {
      setLiked(!liked);
      if (!liked) {
        setLikes(likes - 1);
      } else {
        setLikes(likes + 1);
      }
    });
  };

  return (
    <div className="group relative">
      <button
        type="button"
        className="z-20 bg-gray-700 bg-opacity-70  w-8 h-8 absolute rounded-md border text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black top-4 right-4"
      >
        <Menu />
      </button>
      {userId && (
        <button
          type="button"
          onClick={handleLike}
          className={
            "z-20 bg-gray-700 bg-opacity-70 w-8 h-8 absolute rounded-md border  text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black top-14 right-4" +
            (liked ? " text-blue-500" : " text-white")
          }
        >
          <Heart />
        </button>
      )}
      <p className="z-20 absolute  top-4 left-4 text-lg group-hover:text-blue-600 group-hover:text-xl">
        Likes:{likes}
      </p>
      <p className="z-20 absolute top-14 left-4 text-lg group-hover:text-blue-600 group-hover:text-xl">
        Views:{views}
      </p>
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
        <a
          className="flex justify-center items-center"
          onClick={incrementViews}
        >
          <PdfContainer
            className="h-full w-full object-cover object-center lg:h-full lg:w-full"
            pdfLink={item.pdfLink}
            thumbLink={item.thumbLink}
          />
        </a>
      </div>
      <div className="mt-4 flex-col">
        <div className="flex items-center justify-between">
          <img
            src={item.avatar}
            className="rounded-full w-8 cursor-pointer mr-2"
            onClick={() => {
              window.location.href = "/user/" + item.username;
            }}
          />
          <a
            className="text-right text-lg overflow-hidden text-nowrap mt-2 mb-2 cursor-pointer"
            href={"/user/" + item.username}
          >
            {item.fullName}
          </a>
        </div>
        <div className="flex items-center justify-between">
          <a
            className="overflow-hidden text-nowrap w-1/2 cursor-pointer text-gray-900 font-medium"
            href={item.pdfLink}
          >
            {item.title}
          </a>
          <p className="text-sm font-medium text-gray-800 text-right text-clip">
            {item.yearOfExam || item.author}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="overflow-hidden text-nowrap">
            {item.publisher || item.description || item.institute}
          </p>
          <p className="text-sm text-right overflow-hidden text-nowrap">
            {item.subject}
          </p>
        </div>
      </div>
    </div>
  );
}
