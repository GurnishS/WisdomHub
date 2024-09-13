import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Check, Load, Xmark } from "./FontIcons.jsx";
import OtpBox from "./OtpBox.jsx";
import Loading from "./Loading.jsx";
import config from "../config.js";
import store from "../store.js";
import { ApiHandler, SimpleApiHandler } from "../utils/ApiHandler.js";

export default function SignUp() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkUsernameState, setCheckUsernameState] = useState("Xmark");
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [otpTimeout, setOtpTimeout] = useState(60000);
  const [load, setLoad] = useState(false);

  const [searchParams] = useSearchParams();
  const tempToken = searchParams.get("token");

  const checkUsername = (username) => {
    if (!username) {
      setCheckUsernameState("Xmark");
      return;
    }
    setCheckUsernameState("Load");
    SimpleApiHandler("users/check-username-exists", "POST", { username }, false)
      .then((data) => {
        if (data.data === true) {
          setCheckUsernameState("Xmark");
        } else {
          setCheckUsernameState("Check");
        }
      })
      .catch((err) => {
        setCheckUsernameState("Xmark");
      });
  };

  const [formData, setFormData] = useState({
    avatar: null,
    username: "",
    fullName: "",
    email: "",
    institute: "",
    role: "Student",
    password: "",
    googleId: "",
  });

  useEffect(() => {
    if (tempToken) {
      SimpleApiHandler("users/fetch-user-data", "POST", { token: tempToken })
        .then((data) => {
          setAuthenticated(true);
          console.log(data);
          formData.avatar = data._json.picture;
          formData.fullName = data._json.name;
          formData.email = data._json.email;
          formData.googleId = data._json.sub;
          setFormData((prevData) => ({
            ...prevData,
          }));
        })
        .catch((error) => {
          window.location.href = "/register";
        });
    }
  }, [tempToken]);

  const handleChange = (e) => {
    //for username
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    setTypingTimeout(
      setTimeout(() => {
        checkUsername(e.target.value.trim());
      }, 500)
    );
  };

  const handleNext = async (e) => {
    e.preventDefault();
    setLoad(true);
    formData.fullName = e.target.fullName.value;
    formData.email = e.target.email.value;
    formData.password = e.target.password.value;
    setFormData((prevData) => ({
      ...prevData,
    }));
    SimpleApiHandler("users/generate-otp", "POST", {
      email: formData.email,
    })
      .then((data) => {
        setLoad(false);
        setModalOpen(true);
      })
      .catch((err) => {
        console.log(Number(err.message.split(":")[1]));
        setTimeout(Number(err.message.split(":")[1]));
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);
    formData.institute = e.target.institute.value;
    formData.role = e.target.role.value;
    formData.username = e.target.username.value;
    setFormData((prevData) => ({
      ...prevData,
    }));
    const formDataToSend = new FormData();
    formDataToSend.append("avatar", formData.avatar);
    formDataToSend.append("username", formData.username.trim());
    formDataToSend.append("fullName", formData.fullName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("institute", formData.institute);
    formDataToSend.append("role", formData.role);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("googleId", formData.googleId);
    await fetch(config.apiUrl + "users/register", {
      method: "POST",
      body: formDataToSend,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          window.location.href = "/login";
          store.addMessage({ type: "Success", content: data.message });
        } else {
          throw new Error(data.message);
        }
      })
      .catch((err) => {
        store.addMessage({ type: "Danger", content: err.message });
      })
      .finally(() => {
        setLoad(false);
      });
  };

  if (authenticated)
    return (
      <section className="xl:py-16 lg:py-10">
        {load && <Loading />}
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
            <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
              <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl">
                Sign In
              </h2>
              <p className="mt-2 text-base text-gray-600">
                Just few more details
              </p>
              <form onSubmit={handleSubmit}>
                <div className="space-y-5 mt-4">
                  <div>
                    <img
                      src={
                        formData.avatar
                          ? typeof formData.avatar === "string" &&
                            (formData.avatar.startsWith("http://") ||
                              formData.avatar.startsWith("https://"))
                            ? formData.avatar
                            : URL.createObjectURL(formData.avatar)
                          : "/upload.png"
                      }
                      className="rounded-full w-56 h-56 m-auto my-4"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="avatar"
                      className="text-base font-medium text-gray-900"
                    >
                      Avatar
                    </label>
                    <div className="mt-2">
                      <input
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
                        type="file"
                        id="avatar"
                        accept="image/*"
                        onChange={(e) => {
                          setFormData((prevData) => ({
                            ...prevData,
                            avatar: e.target.files[0],
                          }));
                        }}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="username"
                      className="text-base font-medium text-gray-900"
                    >
                      Username
                    </label>
                    <div className="mt-2">
                      <div
                        className={
                          isFocused
                            ? "mt-2 flex items-center h-10 w-full rounded-md border border-gray-300 ring-1 ring-blue-600 ring-offset-1"
                            : "mt-2 flex items-center h-10 w-full rounded-md border border-gray-300 "
                        }
                      >
                        <input
                          className="border-none w-full bg-transparent px-3 py-2 text-sm placeholder-gray-400 focues:outline-none focus:ring-0"
                          type="text"
                          id="username"
                          placeholder="Username"
                          onChange={handleChange}
                          onFocus={() => {
                            setIsFocused(true);
                          }}
                          onBlur={() => setIsFocused(false)}
                          required
                        />
                        {checkUsernameState === "Xmark" && <Xmark />}
                        {checkUsernameState === "Check" && <Check />}
                        {checkUsernameState === "Load" && <Load />}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-6 gap-3">
                    <div className="col-span-4">
                      <label
                        htmlFor="institute"
                        className="text-base font-medium text-gray-900"
                      >
                        Institute
                      </label>
                      <div className="mt-2">
                        <input
                          className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                          type="text"
                          placeholder="Institute"
                          id="institute"
                          required
                        ></input>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label
                        htmlFor="role"
                        className="text-base font-medium text-gray-900"
                      >
                        Role
                      </label>
                      <div className="mt-2">
                        <select
                          id="role"
                          className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 xs:px-1 sm:px-1 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
                        >
                          <option value="Student">Student</option>
                          <option value="Teacher">Teacher</option>
                          <option value="Others">Others</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                    >
                      Create Account <ArrowRight className="ml-2" size={16} />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="relative flex items-end px-4 pb-10 pt-60 sm:px-6 sm:pb-16 md:justify-center lg:px-8 lg:pb-24">
            <div className="absolute inset-0">
              <img
                className="h-full w-full rounded-md object-cover object-top"
                src="https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8c2lnbnVwfGVufDB8fDB8fA%3D%3D&amp;auto=format&amp;fit=crop&amp;w=800&amp;q=60"
                alt=""
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
            <div className="relative">
              <div className="w-full max-w-xl xl:mx-auto xl:w-full xl:max-w-xl xl:pr-24">
                <h3 className="text-4xl font-bold text-white">
                  No need to rely on your friends for study materials
                </h3>
                <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                  <li className="flex items-center space-x-3">
                    <div className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
                      <svg
                        className="h-3.5 w-3.5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <span className="text-lg font-medium text-white">
                      {" "}
                      Books{" "}
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
                      <svg
                        className="h-3.5 w-3.5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <span className="text-lg font-medium text-white">
                      {" "}
                      Study Materials{" "}
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
                      <svg
                        className="h-3.5 w-3.5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <span className="text-lg font-medium text-white">
                      {" "}
                      Question Papers{" "}
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
                      <svg
                        className="h-3.5 w-3.5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <span className="text-lg font-medium text-white">
                      {" "}
                      Discussions{" "}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  else {
    return (
      <section className="xl:py-16 lg:py-10">
        {load && <Loading />}
        {modalOpen && (
          <OtpBox
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            email={formData.email}
            setAuthenticated={setAuthenticated}
            otpTimeout={otpTimeout}
            setOtpTimeout={setOtpTimeout}
          />
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative flex items-end px-4 pb-10 pt-60 sm:px-6 sm:pb-16 md:justify-center lg:px-8 lg:pb-24">
            <div className="absolute inset-0">
              <img
                className="h-full w-full rounded-md object-cover object-top"
                src="https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8c2lnbnVwfGVufDB8fDB8fA%3D%3D&amp;auto=format&amp;fit=crop&amp;w=800&amp;q=60"
                alt=""
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
            <div className="relative">
              <div className="w-full max-w-xl xl:mx-auto xl:w-full xl:max-w-xl xl:pr-24">
                <h3 className="text-4xl font-bold text-white">
                  Now no need to rely on your friends for study materials
                </h3>
                <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                  <li className="flex items-center space-x-3">
                    <div className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
                      <svg
                        className="h-3.5 w-3.5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <span className="text-lg font-medium text-white">
                      {" "}
                      Books{" "}
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
                      <svg
                        className="h-3.5 w-3.5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <span className="text-lg font-medium text-white">
                      {" "}
                      Study Materials{" "}
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
                      <svg
                        className="h-3.5 w-3.5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <span className="text-lg font-medium text-white">
                      {" "}
                      Question Papers{" "}
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
                      <svg
                        className="h-3.5 w-3.5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <span className="text-lg font-medium text-white">
                      {" "}
                      Discussions{" "}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
            <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
              <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl">
                Sign up
              </h2>
              <p className="mt-2 text-base text-gray-600">
                Already have an account?{" "}
                <a
                  href="/login"
                  title=""
                  className="font-medium text-black transition-all duration-200 hover:underline"
                >
                  Sign In
                </a>
              </p>
              <form onSubmit={handleNext}>
                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="text-base font-medium text-gray-900"
                    >
                      {" "}
                      Full Name{" "}
                    </label>
                    <div className="mt-2">
                      <input
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                        type="text"
                        placeholder="Full Name"
                        id="fullName"
                        required
                      ></input>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="text-base font-medium text-gray-900"
                    >
                      {" "}
                      Email address{" "}
                    </label>
                    <div className="mt-2">
                      <input
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                        type="email"
                        placeholder="Email"
                        id="email"
                        required
                      ></input>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="text-base font-medium text-gray-900"
                      >
                        {" "}
                        Password{" "}
                      </label>
                    </div>
                    <div className="mt-2">
                      <input
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                        type="password"
                        placeholder="Password"
                        id="password"
                        pattern="(?=.*\d)(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}"
                        title="Password must contain at least one numeral, one special symbol, one uppercase letter, and be at least 8 characters long"
                        required
                      ></input>
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                    >
                      Next <ArrowRight className="ml-2" size={16} />
                    </button>
                  </div>
                </div>
              </form>
              <div className="mt-3 space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = `${config.apiUrl}users/auth/google`;
                  }}
                  className="relative inline-flex w-full items-center justify-center rounded-md border border-gray-400 bg-white px-3.5 py-2.5 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-black focus:bg-gray-100 focus:text-black focus:outline-none"
                >
                  <span className="mr-2 inline-block">
                    <svg
                      className="h-6 w-6 text-rose-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"></path>
                    </svg>
                  </span>
                  Sign up with Google
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
