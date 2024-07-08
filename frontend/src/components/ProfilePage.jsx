import React, { useEffect, useState } from "react";
import { Email } from "./FontIcons";
import ProfileList from "./ProfileList";
import Loading from "./Loading";
import config from "../config";

const Profile = () => {
  const [user, setUser] = useState(null); // State to hold user data
  const [page, setPage] = useState("Question Papers");
  const [books, setBooks] = useState([]);
  const [questionPapers, setQuestionPapers] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const normalCss =
    "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300";
  const activeCss =
    "inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500";

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await fetch(config.apiUrl + "users/get-user-profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies
        });
        const data = await res.json();
        setUser(data.data.userProfile[0]);
        setQuestionPapers(data.data.items.questionPapers);
        setBooks(data.data.items.books);
        setStudyMaterials(data.data.items.studyMaterials);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="p-16">
      <div className="p-8 bg-gray-100 shadow mt-24 rounded-lg ">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0">
            <div>
              <p className="font-bold text-gray-700 text-xl">22</p>
              <p className="text-gray-400 text-sm">Following</p>
            </div>
            <div>
              <p className="font-bold text-gray-700 text-xl">10</p>
              <p className="text-gray-400 text-sm">Followers</p>
            </div>
            <div>
              <p className="font-bold text-gray-700 text-xl">89</p>
              <p className="text-gray-400 text-sm">Posts</p>
            </div>
          </div>
          <div className="relative">
            <div className="w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500">
              <img
                src={user?.avatar || "default-avatar.png"}
                alt="User Avatar"
                className="w-44 h-44 rounded-full"
              />
            </div>
          </div>
          <div className="space-x-8 flex justify-center mt-32 md:mt-0 md:justify-center">
            <button className="text-white py-2 px-4 uppercase rounded bg-blue-400 hover:bg-blue-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">
              Connect
            </button>
          </div>
        </div>
        <div className="mt-20 text-center pb-12">
          <p className="font-light text-gray-600 mt-3">{user?.username}</p>
          <h1 className="text-4xl font-medium text-gray-700">
            {user?.fullName}
          </h1>
          <p className="font-light text-gray-800">
            <Email />
            {user?.email}
          </p>
          <p className="mt-8 text-gray-500">{user?.role + " at"}</p>
          <p className="mt-2 text-gray-500">{user?.institute}</p>
        </div>
      </div>
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px justify-around">
          <li className="me-2">
            <a
              onClick={() => setPage("Books")}
              className={page === "Books" ? activeCss : normalCss}
            >
              Books
            </a>
          </li>
          <li className="me-2">
            <a
              onClick={() => setPage("Question Papers")}
              className={page === "Question Papers" ? activeCss : normalCss}
            >
              Question Papers
            </a>
          </li>
          <li className="me-2">
            <a
              onClick={() => setPage("Study Materials")}
              className={page === "Study Materials" ? activeCss : normalCss}
            >
              Study Materials
            </a>
          </li>
        </ul>
      </div>
      {page === "Question Papers" && (
        <ProfileList
          itemsCopy={questionPapers}
          setItemsCopy={setQuestionPapers}
        />
      )}
      {page === "Books" && (
        <ProfileList itemsCopy={books} setItemsCopy={setBooks} />
      )}
      {page === "Study Materials" && (
        <ProfileList
          itemsCopy={studyMaterials}
          setItemsCopy={setStudyMaterials}
        />
      )}
    </div>
  );
};

export default Profile;
