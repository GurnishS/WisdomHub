import React, { useEffect, useState } from "react";
import config from "../config";
import { SimpleApiHandler, ApiHandler } from "../utils/ApiHandler";
const Modal = ({
  modalOpen = false,
  setModalOpen,
  email,
  setAuthenticated,
  otpTimeout,
  setOtpTimeout,
}) => {
  const [timer, setTimer] = useState(otpTimeout / 1000);

  const verifyOTP = async (e) => {
    e.preventDefault();
    const otp = e.target.otp.value;
    SimpleApiHandler("users/verify-otp", "POST", {
      email,
      otp,
    }).then((data) => {
      if (data.data.status) {
        setAuthenticated(true);
      }
    });
  };

  useEffect(() => {
    if (otpTimeout > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      const resend = document.getElementById("resend");
      if (resend) {
        resend.classList.add("cursor-pointer", "font-bold");
        resend.disabled = false;
      }
    }
  }, [otpTimeout]);

  useEffect(() => {
    if (timer === 0) {
      setOtpTimeout(0);
    }
  }, [timer, setOtpTimeout]);

  const handleClose = () => {
    const modal = document.getElementById("modal-otp-form");
    const backFilm = document.getElementById("back-film");
    if (modal) {
      modal.classList.add("hidden");
      backFilm.classList.add("hidden");
      modal.setAttribute("aria-hidden", "true");
      setModalOpen(false);
    }
  };

  const handleOpen = () => {
    const modal = document.getElementById("modal-otp-form");
    const backFilm = document.getElementById("back-film");
    if (modal) {
      modal.classList.remove("hidden");
      backFilm.classList.remove("hidden");
      modal.setAttribute("aria-hidden", "false");
    }
  };

  const resendOTP = async () => {
    if (timer == 0) {
      SimpleApiHandler("users/generate-otp", "POST", {
        email: email,
      })
        .then((data) => {
          setOtpTimeout(60000); // Reset the OTP timeout
          setTimer(60000 / 1000); // Reset the timer
          const resend = document.getElementById("resend");
          if (resend) {
            resend.classList.remove("cursor-pointer", "font-bold");
            resend.disabled = true;
          }
        })
        .catch((err) => {
          console.log(Number(err.message.split(":")[1]));
          setTimeout(Number(err.message.split(":")[1]));
        });
    }
  };

  useEffect(() => {
    if (modalOpen === true) {
      handleOpen();
    }
  }, [modalOpen]);

  return (
    <>
      <div
        id="back-film"
        className="w-screen h-screen fixed bg-opacity-55 bg-gray-500 hidden z-40"
      >
        <div
          id="modal-otp-form"
          className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full flex items-center"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="relative p-4 w-full max-w-md max-h-full m-auto">
            <div className="relative bg-white rounded-lg shadow">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                <h3 className="text-xl font-semibold text-gray-900 ">
                  Verify Email
                </h3>
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
                <form onSubmit={verifyOTP}>
                  <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                      <div className="col-span-4">
                        <label
                          htmlFor="otp"
                          className="text-base font-medium text-gray-900"
                        >
                          Enter OTP
                        </label>
                        <div className="mt-2">
                          <input
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                            type="number"
                            placeholder="Eg. 123456"
                            id="otp"
                            required
                          />
                          <p className="mt-4 text-sm ml-2">
                            Enter OTP sent to {email}
                          </p>
                          <p className="text-md mt-2 ml-2">
                            Didn't receive OTP?
                            <a
                              id="resend"
                              className="ml-2"
                              onClick={resendOTP}
                              disabled
                            >
                              Resend
                            </a>
                          </p>
                          {otpTimeout > 0 && (
                            <p className="ml-2 mt-2 text-sm">
                              Resend available in {timer} seconds
                            </p>
                          )}
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
                      Verify
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
