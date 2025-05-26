import React, { useEffect, useState } from "react";
import { ApiHandler } from "../utils/ApiHandler";

const Modal = ({ modalOpenSearch = false, setModalOpenSearch }) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleClose = () => {
    const modal = document.getElementById("modal-upload-form");
    const backFilm = document.getElementById("back-film");
    if (modal) {
      modal.classList.add("hidden");
      backFilm.classList.add("hidden");
      modal.setAttribute("aria-hidden", "true");
      setModalOpenSearch(false);
    }
  };

  const handleOpen = () => {
    const modal = document.getElementById("modal-upload-form");
    const backFilm = document.getElementById("back-film");
    if (modal) {
      modal.classList.remove("hidden");
      backFilm.classList.remove("hidden");
      modal.setAttribute("aria-hidden", "false");
    }
  };

  const handleChange = (e) => {
    const keyword = e.target.value;
    if (keyword.length < 3) {
      return;
    }
    const payload = { keyword };
    setResults([]);
    setLoading(true);
    ApiHandler("users/search-user", "POST", payload, false)
      .then((data) => {
        setResults(data.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (modalOpenSearch === true) {
      handleOpen();
    }
  }, [modalOpenSearch]);

  return (
    <>
      <div
        id="back-film"
        className="w-screen h-screen fixed bg-opacity-55 bg-gray-500 hidden z-20"
      >
        <div
          id="modal-upload-form"
          className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-20 justify-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full flex items-center"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="relative p-4 w-full max-w-xl max-h-full m-auto">
            <div className="relative bg-white rounded-lg shadow">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                <h3 className="text-xl font-semibold text-gray-900 ">Search</h3>
                <button
                  type="button"
                  onClick={handleClose}
                  className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="p-4 md:p-5">
                <form className="flex items-center max-w-sm mx-auto">
                  <label htmlFor="simple-search" className="sr-only">
                    Search
                  </label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 18 20"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="simple-search"
                      onChange={handleChange}
                      className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
                      placeholder="Search username..."
                      required
                    />
                  </div>
                </form>
                <div className="flex-col mt-8 mb-4 px-4">
                  {results == [] && <p>Type Something..</p>}

                  {loading && (
                    <div className="flex items-center justify-between w-full p-4 bg-gray-100 rounded-lg my-2 animate-pulse">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                        <div className="flex-1 space-y-4 py-1">
                          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                        </div>
                      </div>
                      <div className="w-24 h-8 bg-blue-500 rounded"></div>
                    </div>
                  )}
                  {results.map((result) => (
                    <div
                      key={result?._id}
                      className="flex items-center justify-between w-full p-4 bg-gray-100 rounded-lg my-2 cursor-pointer"
                      onClick={() => {
                        window.location.href = "/user/" + result.username;
                      }}
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={result.avatar}
                          alt="avatar"
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="text-lg font-semibold text-gray-900">
                            {result.username}
                          </p>
                          <p className="text-sm text-gray-500">
                            {result.fullName}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className={
                          result.isFollowing
                            ? "text-white rounded-lg px-4 py-2 bg-gray-500 hover:bg-gray-600"
                            : "text-white rounded-lg px-4 py-2 bg-blue-500 hover:bg-blue-600"
                        }
                      >
                        {result.isFollowing ? "UnFollow" : "Follow"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
