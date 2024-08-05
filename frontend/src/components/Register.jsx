import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Check, Load, Xmark } from "./FontIcons.jsx";
import OtpBox from "./OtpBox.jsx";
import Loading from "./Loading.jsx";
import config from "../config.js";
import store from "../store.js";
import { SimpleApiHandler } from "../utils/ApiHandler.js";

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
        setCheckUsernameState(data.data ? "Xmark" : "Check");
      })
      .catch(() => {
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
          setFormData((prevData) => ({
            ...prevData,
            avatar: data._json.picture,
            fullName: data._json.name,
            email: data._json.email,
            googleId: data._json.sub,
          }));
        })
        .catch(() => {
          window.location.href = "/register";
        });
    }
  }, [tempToken]);

  const handleChange = (e) => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    setTypingTimeout(
      setTimeout(() => checkUsername(e.target.value.trim()), 500)
    );
  };

  const handleNext = async (e) => {
    e.preventDefault();
    setLoad(true);
    setFormData((prevData) => ({
      ...prevData,
      fullName: e.target.fullName.value,
      email: e.target.email.value,
      password: e.target.password.value,
    }));
    try {
      await SimpleApiHandler("users/generate-otp", "POST", {
        email: formData.email,
      });
      setModalOpen(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoad(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);
    setFormData((prevData) => ({
      ...prevData,
      institute: e.target.institute.value,
      role: e.target.role.value,
      username: e.target.username.value,
    }));
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });
    try {
      const response = await fetch(config.apiUrl + "users/register", {
        method: "POST",
        body: formDataToSend,
      });
      const data = await response.json();
      if (data.success) {
        window.location.href = "/login";
        store.addMessage({ type: "Success", content: data.message });
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      store.addMessage({ type: "Danger", content: err.message });
    } finally {
      setLoad(false);
    }
  };

  if (authenticated) {
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
                Just a few more details
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
                      alt="avatar"
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
                          className="border-none w-full bg-transparent px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-0"
                          type="text"
                          id="username"
                          placeholder="Username"
                          onChange={handleChange}
                          onFocus={() => setIsFocused(true)}
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
                        />
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
                      className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        {modalOpen && (
          <OtpBox
            modalOpen={modalOpen}
            otpTimeout={otpTimeout}
            setModalOpen={setModalOpen}
            handleSubmit={handleNext}
            email={formData.email}
          />
        )}
      </section>
    );
  } else {
    return (
      <section className="xl:py-16 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
            <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
              <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl">
                Complete your registration
              </h2>
              <form onSubmit={handleNext}>
                <div className="space-y-5 mt-4">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="text-base font-medium text-gray-900"
                    >
                      Full Name
                    </label>
                    <div className="mt-2">
                      <input
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
                        type="text"
                        placeholder="Full Name"
                        id="fullName"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="text-base font-medium text-gray-900"
                    >
                      Email
                    </label>
                    <div className="mt-2">
                      <input
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
                        type="email"
                        placeholder="Email"
                        id="email"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="text-base font-medium text-gray-900"
                    >
                      Password
                    </label>
                    <div className="mt-2">
                      <input
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
                        type="password"
                        placeholder="Password"
                        id="password"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                    >
                      Next <ArrowRight className="ml-1" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
