import React, { useEffect, useState } from "react";
import { Email } from "../components/FontIcons";
import ProfileList from "../components/ProfileList";
import Loading from "../components/Loading";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProfileEditForm from "../components/ProfileEditForm";
import { ApiHandler } from "../utils/ApiHandler";

function Profile({user:user}) {
  console.log("User: ", user);
  const [userInfo, setUserInfo] = useState(null); // State to hold user data
  const [page, setPage] = useState("Question Papers");
  const [books, setBooks] = useState([]);
  const [questionPapers, setQuestionPapers] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const { username } = useParams();
  const [modalOpen, setModalOpen] = useState(false);

  const followUser = () => {
    // try {
    //   await fetch(config.apiUrl + "users/follow/" + user.uid, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
    //     },
    //   });
    //   user.isFollowing = true;
    //   user.followerCount = user.followerCount + 1;
    //   setUser({ ...user });
    // } catch (err) {
    //   store.addMessage({ type: "Danger", content: err.message });
    // }
    ApiHandler("users/follow/" + userInfo.uid, "POST", {}, false).then((data) => {
      userInfo.isFollowing = true;
      userInfo.followerCount = userInfo.followerCount + 1;
      setUserInfo({ ...userInfo });
    });
  };

  const unfollowUser = async () => {
    // try {
    //   await fetch(config.apiUrl + "users/unfollow/" + user.uid, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
    //     },
    //   });
    //   user.isFollowing = false;
    //   user.followerCount = user.followerCount - 1;
    //   setUser({ ...user });
    // } catch (err) {
    //   store.addMessage({ type: "Danger", content: err.message });
    // }
    ApiHandler("users/unfollow/" + userInfo.uid, "POST", {}, false).then((data) => {
      userInfo.isFollowing = false;
      userInfo.followerCount = userInfo.followerCount - 1;
      setUserInfo({ ...userInfo });
    });
  };

  const normalCss =
    "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300";
  const activeCss =
    "inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500";

  useEffect(() => {
    const fetchProfileData = async () => {
      // try {
      //   const accessToken = sessionStorage.getItem("accessToken");
      //   const fetchAPI = username
      //     ? config.apiUrl + "users/" + username
      //     : config.apiUrl + "users/get-user-profile";
      //   const res = await fetch(fetchAPI, {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${accessToken}`,
      //     },
      //   });
      //   const data = await res.json();
      //   setUser(data.data.userProfile[0]);
      //   setQuestionPapers(data.data.items.questionPapers);
      //   setBooks(data.data.items.books);
      //   setStudyMaterials(data.data.items.studyMaterials);
      //   setLoading(false);
      // } catch (err) {
      //   store.addMessage({ type: "Danger", content: err.message });
      //   setLoading(false);
      // }
      const fetchAPI = username
        ? "users/" + username
        : "users/get-user-profile";
      ApiHandler(fetchAPI, "POST", {})
        .then((data) => {
          setUserInfo(data.data.userProfile[0]);
          setQuestionPapers(data.data.items.questionPapers);
          setBooks(data.data.items.books);
          setStudyMaterials(data.data.items.studyMaterials);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    };
    fetchProfileData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {modalOpen && (
        <ProfileEditForm
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          userProfile={userInfo}
        />
      )}
      <Navbar user={user} />
      <div className="p-8 lg:p-16">
        <div className="p-8 bg-gray-100 shadow mt-24 rounded-lg ">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0">
              <div>
                <p className="font-bold text-gray-700 text-xl">
                  {userInfo.followingCount}
                </p>
                <p className="text-gray-400 text-sm">Following</p>
              </div>
              <div>
                <p className="font-bold text-gray-700 text-xl">
                  {userInfo.followerCount}
                </p>
                <p className="text-gray-400 text-sm">Followers</p>
              </div>
              <div>
                <p className="font-bold text-gray-700 text-xl">
                  {books.length + questionPapers.length + studyMaterials.length}
                </p>
                <p className="text-gray-400 text-sm">Posts</p>
              </div>
            </div>
            <div className="relative">
              <div className="w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500">
                <img
                  src={userInfo?.avatar || "default-avatar.png"}
                  alt="User Avatar"
                  className="w-44 h-44 rounded-full"
                />
              </div>
            </div>
            <div className="space-x-8 flex justify-center mt-32 md:mt-0 md:justify-center">
              <button
                className={
                  userInfo.isFollowing
                    ? "text-white py-2 px-4 uppercase rounded bg-gray-400 hover:bg-gray-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
                    : "text-white py-2 px-4 uppercase rounded bg-blue-400 hover:bg-blue-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
                }
                onClick={userInfo.isFollowing ? unfollowUser : followUser}
                hidden={userInfo.disableButton}
              >
                {userInfo.isFollowing ? "Unfollow" : "Follow"}
              </button>
              <button
                className="text-white py-2 px-4 uppercase rounded bg-blue-400 hover:bg-blue-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
                hidden={!userInfo.disableButton}
                onClick={() => {
                  setModalOpen(true);
                }}
              >
                Edit
              </button>
            </div>
          </div>
          <div className="mt-20 text-center pb-12">
            <p className="font-light text-gray-600 mt-3">{userInfo?.username}</p>
            <h1 className="text-4xl font-medium text-gray-700">
              {userInfo?.fullName}
            </h1>
            <p className="font-light text-gray-800">
              <Email />
              {userInfo?.email}
            </p>
            <p className="mt-8 text-gray-500">{userInfo?.role + " at"}</p>
            <p className="mt-2 text-gray-500">{userInfo?.institute}</p>
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
            heading="Qestion Papers"
            itemsCopy={questionPapers}
            setItemsCopy={setQuestionPapers}
          />
        )}
        {page === "Books" && (
          <ProfileList
            heading="Books"
            itemsCopy={books}
            setItemsCopy={setBooks}
          />
        )}
        {page === "Study Materials" && (
          <ProfileList
            heading="Study Materials"
            itemsCopy={studyMaterials}
            setItemsCopy={setStudyMaterials}
          />
        )}
      </div>
      <Footer />
    </>
  );
};

export default Profile;
