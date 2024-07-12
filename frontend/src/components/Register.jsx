import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Check, Load, Xmark } from "./FontIcons.jsx";
import Loading from "./Loading.jsx";
import config from "../config.js";
import store from "../store.js";

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const accessToken = sessionStorage.getItem("accessToken");

  useEffect(() => {
    // Set overflow hidden when loading
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [loading]);

  useEffect(() => {
    if (accessToken) {
      fetch(config.apiUrl + "users/current-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          store.addMessage({ type: "Success", content: "Login Success" });
          window.location.href = "/dashboard";
        })
        .catch((err) => {
          store.addMessage({ type: "Danger", content: err.message });
        });
    }
  }, []);

  const [formData, setFormData] = useState({
    avatar: null,
    username: "",
    fullName: "",
    email: "",
    institute: "",
    role: "Student", // Default role
    password: "",
  });

  const [checkUsernameState, setCheckUsernameState] = useState("Xmark"); // Default state for username validation
  const [typingTimeout, setTypingTimeout] = useState(null); // Timeout for username validation
  const [disableSubmit, setDisableSubmit] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { id, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: id === "avatar" ? files[0] : value,
    }));

    // Debounce username validation
    if (id === "username") {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      setTypingTimeout(
        setTimeout(() => {
          checkUsername(value.trim()); // Validate username after typing stops
        }, 500)
      );
    }
  };

  // Validate username availability
  const checkUsername = async (username) => {
    if (!username) {
      setCheckUsernameState("Xmark");
      return;
    }

    setCheckUsernameState("Load");
    try {
      const response = await fetch(
        config.apiUrl + "users/check-username-exists",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        }
      );

      if (!response.ok) {
        store.addMessage({
          type: "Danger",
          content: "Network response was not ok",
        });
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (data.data === true) {
        setCheckUsernameState("Xmark");
      } else {
        setCheckUsernameState("Check");
      }
    } catch (error) {
      console.error("Error:", error);
      setCheckUsernameState("Xmark");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisableSubmit(true);
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("avatar", formData.avatar);
      formDataToSend.append("username", formData.username.trim());
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("institute", formData.institute);
      formDataToSend.append("role", formData.role);
      formDataToSend.append("password", formData.password);

      const response = await fetch(config.apiUrl + "users/register", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        setDisableSubmit(false);
        store.addMessage({
          type: "Danger",
          content: "Network response was not ok",
        });
        throw new Error("Network response was not ok");
      }
      window.location.href = "/login";
    } catch (error) {
      setDisableSubmit(false);
      store.addMessage({ type: "Danger", content: error.message });
    }
  };

  return (
    <>
      {loading && <Loading />}
      <section className="py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
            <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
              <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl">
                Sign up
              </h2>
              <p className="mt-2 text-base text-gray-600">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="font-medium text-black transition-all duration-200 hover:underline"
                >
                  Sign In
                </a>
              </p>
              <form className="mt-8" onSubmit={handleSubmit}>
                <div className="space-y-5">
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
                        onChange={handleChange}
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
                    <div className="mt-2 flex items-center">
                      <input
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
                        type="text"
                        id="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                      />
                      {checkUsernameState === "Xmark" && <Xmark />}
                      {checkUsernameState === "Check" && <Check />}
                      {checkUsernameState === "Load" && <Load />}
                    </div>
                  </div>

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
                        id="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="text-base font-medium text-gray-900"
                    >
                      Email address
                    </label>
                    <div className="mt-2">
                      <input
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
                        type="email"
                        id="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="institute"
                      className="text-base font-medium text-gray-900"
                    >
                      Institute
                    </label>
                    <div className="mt-2">
                      <input
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
                        type="text"
                        id="institute"
                        placeholder="Institute"
                        value={formData.institute}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="role"
                      className="text-base font-medium text-gray-900"
                    >
                      Role
                    </label>
                    <div className="mt-2">
                      <select
                        id="role"
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1"
                        value={formData.role}
                        onChange={handleChange}
                      >
                        <option value="Student">Student</option>
                        <option value="Teacher">Teacher</option>
                        <option value="Others">Others</option>
                      </select>
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
                        id="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={disableSubmit}
                      className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                    >
                      Create Account <ArrowRight className="ml-2" size={16} />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="h-full w-full">
            <img
              className="mx-auto h-full w-full rounded-md object-cover"
              src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1742&q=80"
              alt="Registration background"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default RegisterForm;
