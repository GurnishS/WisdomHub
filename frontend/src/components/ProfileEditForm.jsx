import React, { useState, useEffect } from "react";
import Loading from "./Loading";
import { Check, Load, Xmark } from "./FontIcons.jsx";
import config from "../config";
import OtpBox from "./OtpBox.jsx";
import store from "../store";
import { SimpleApiHandler } from "../utils/ApiHandler";

const Modal = ({ modalOpen = false, setModalOpen, userProfile }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    avatar: userProfile.avatar,
    username: userProfile.username,
    fullName: userProfile.fullName,
    email: userProfile.email,
    institute: userProfile.institute,
    role: userProfile.role,
  });
  const [checkUsernameState, setCheckUsernameState] = useState("Xmark");
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(userProfile.avatar); // State for image preview
  const [modalOpenOTP, setModalOpenOTP] = useState(false);
  const [otpTimeout, setOtpTimeout] = useState(60000);
  const [authenticated, setAuthenticated] = useState(false);

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (id === "avatar") {
      setFormData((prevData) => ({
        ...prevData,
        avatar: files[0], // Update form data with file object
      }));

      // Update image preview
      if (files.length > 0) {
        const reader = new FileReader();
        reader.onload = () => {
          setAvatarPreview(reader.result); // Set image preview URL
        };
        reader.readAsDataURL(files[0]);
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }

    if (id === "username") {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      setTypingTimeout(
        setTimeout(() => {
          checkUsername(value.trim());
        }, 500)
      );
    }
  };

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
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setCheckUsernameState(data.data ? "Xmark" : "Check");
    } catch (error) {
      console.error("Error:", error);
      setCheckUsernameState("Xmark");
    }
  };

  const handleClose = () => {
    const modal = document.getElementById("modal-edit-form");
    const backFilm = document.getElementById("back-film");
    if (modal) {
      modal.classList.add("hidden");
      backFilm.classList.add("hidden");
      modal.setAttribute("aria-hidden", "true");
      setModalOpen(false);
    }
  };

  const handleOpen = () => {
    const modal = document.getElementById("modal-edit-form");
    const backFilm = document.getElementById("back-film");
    if (modal) {
      modal.classList.remove("hidden");
      backFilm.classList.remove("hidden");
      modal.setAttribute("aria-hidden", "false");
    }
  };
    
  const handleSubmit = async () => {
    // e.preventDefault();
    setLoading(true);
    try {
      // const form = e.target;
      // const formData = new FormData();
      // formData.append("avatar", form.avatar.files[0] || null);
      // formData.append("username", form.username.value);
      // formData.append("fullName", form.fullName.value);
      // formData.append("email", form.email.value);
      // formData.append("institute", form.institute.value);
      // formData.append("role", form.role.value);
      const formDataToSend = new FormData();
      if(formData.avatar)formDataToSend.append("avatar", formData.avatar);
      else formDataToSend.append("avatar", null);
      console.log(formData.avatar);
      formDataToSend.append("username", formData.username);
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("institute", formData.institute);
      formDataToSend.append("role", formData.role);


      const response = await fetch(config.apiUrl + "users/update-profile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      store.addMessage({ type: "Success", content: data.message });
      handleClose();
      // window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      store.addMessage({ type: "Danger", content: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(authenticated) {
      handleSubmit();
    }
  }, [authenticated]);


  const handleOTP = async (e) => {
    e.preventDefault();
    // setModalOpenOTP(true);
    setLoading(true);
    const form = e.target;
    // const formData = new FormData();
    // formData.append("avatar", form.avatar.files[0] || null);
    // formData.append("username", form.username.value);
    // formData.append("fullName", form.fullName.value);
    // formData.append("email", form.email.value);
    // formData.append("institute", form.institute.value);
    // formData.append("role", form.role.value);
    // formData.fullName = e.target.fullName.value;
    // formData.email = e.target.email.value;
    // formData.password = e.target.password.value;
    setFormData({
      avatar: form.avatar.files[0] || null,
      username: form.username.value,
      fullName: form.fullName.value,
      email: form.email.value,
      institute: form.institute.value,
      role: form.role.value,
    });
    // console.log(formData.email);
    
    SimpleApiHandler("users/generate-otp", "POST", {
      email: form.email.value,
    })
      .then((data) => {
        setLoading(false);
        setModalOpenOTP(true);
      })
      .catch((err) => {
        console.log(Number(err.message.split(":")[1]));
        setTimeout(Number(err.message.split(":")[1]));
      });
  };


  useEffect(() => {
    if (modalOpen) {
      handleOpen();
    }
  }, [modalOpen]);

  useEffect(() => {
    document.body.style.overflow = loading ? "hidden" : "auto";
  }, [loading]);

  return (
    <>
      {modalOpenOTP && (
          <OtpBox
            modalOpen={modalOpenOTP}
            setModalOpen={setModalOpenOTP}
            email={formData.email}
            setAuthenticated={setAuthenticated}
            otpTimeout={otpTimeout}
            setOtpTimeout={setOtpTimeout}
          />
        )}
      {loading && <Loading />}
      <div
        id="back-film"
        className="w-screen h-screen fixed bg-opacity-55 bg-gray-500 hidden z-30"
      >
        <div
          id="modal-edit-form"
          className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-30 justify-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full flex items-center"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="relative p-4 w-full max-w-xl max-h-full m-auto">
            <div className="relative bg-white rounded-lg shadow">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                <h3 className="text-xl font-semibold text-gray-900">Edit</h3>
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
                <form onSubmit={handleOTP}>
                  <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                      <img
                        src={avatarPreview}
                        alt="Avatar Preview"
                        className="w-60 h-60 rounded-full m-auto mb-4"
                      />
                      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="col-span-3">
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
                        <div className="col-span-4">
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
                              required
                            />
                            {checkUsernameState === "Xmark" && <Xmark />}
                            {checkUsernameState === "Check" && <Check />}
                            {checkUsernameState === "Load" && <Load />}
                          </div>
                        </div>
                        <div className="col-span-5">
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
                              required
                            />
                          </div>
                        </div>
                        <div className="col-span-4">
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
                              required
                            />
                          </div>
                        </div>
                        <div className="col-span-4">
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
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="text-sm font-semibold leading-6 text-gray-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
