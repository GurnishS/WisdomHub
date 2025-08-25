import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword,GoogleAuthProvider,signInWithPopup } from "firebase/auth";
import auth from "../utils/firebase";
import Loading from "../components/Loading";
import store from "../store";
import { useSearchParams } from "react-router-dom";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      // Attempt to sign in user with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if(!user) {
        throw new Error("User not found");
      }

      console.log('User logged in successfully:', user);
      store.addMessage({
        type: "success",
        message: "User logged in successfully",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error('Error logging in user:', error.code, error.message);
      
      // Handle specific Firebase auth errors with user-friendly messages
      let errorMessage = error.message;
      
      switch (error.code) {
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled. Please contact support.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed login attempts. Please try again later.';
          break;
        default:
          errorMessage = 'Login failed. Please try again.';
      }
      
      store.addMessage({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }

  const provider = new GoogleAuthProvider();

  function signInWithGooglePopup() {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        
        // Handle successful sign-in (e.g., redirect to dashboard, update UI)
        console.log("Successfully signed in with Google (Popup)!", user);
        store.addMessage({
          type: "success",
          message: "User logged in successfully",
        });

        navigate("/dashboard");

      }).catch((error) => {
        // Handle errors
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData ? error.customData.email : null;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);

        console.error("Error during Google sign-in (Popup):", errorMessage);
        
        // Handle specific Google sign-in errors with user-friendly messages
        let userFriendlyMessage = errorMessage;
        
        switch (errorCode) {
          case 'auth/popup-closed-by-user':
            userFriendlyMessage = 'Sign-in was cancelled. Please try again.';
            break;
          case 'auth/popup-blocked':
            userFriendlyMessage = 'Popup was blocked by your browser. Please allow popups and try again.';
            break;
          case 'auth/account-exists-with-different-credential':
            userFriendlyMessage = 'An account with that email already exists with a different sign-in method. Please use that method instead.';
            break;
          case 'auth/invalid-credential':
            userFriendlyMessage = 'Google sign-in failed. Please try again.';
            break;
          default:
            userFriendlyMessage = 'Google sign-in failed. Please try again.';
        }
        
        store.addMessage({
          type: "error",
          message: userFriendlyMessage,
        });

        if (errorCode === 'auth/account-exists-with-different-credential') {
          alert('An account with that email already exists with a different sign-in method. Sign in with that method instead.');
        }
      });
  }


  return (
    <>
      {loading && <Loading />}
      <section className="grid grid-cols-1 lg:grid-cols-2 lg:py-32 lg:pl-4">
        {/* Left side content (image and features) */}
        <div className="relative flex items-end px-4 pb-10 pt-60 sm:px-6 sm:pb-16 md:justify-center lg:px-8 lg:pb-24">
          <div className="absolute inset-0">
            <img
              className="h-full w-full rounded-md object-cover object-top"
              src="https://images.pexels.com/photos/4560076/pexels-photo-4560076.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt=""
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
          <div className="relative">
            <div className="w-full max-w-xl xl:mx-auto xl:w-full xl:max-w-xl xl:pr-24">
              <h3 className="text-4xl font-bold text-white">
                Sign to kickstart your exam preparation with our
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
                    Question Papers
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
                    Free Books
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
                    Study Materials
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
                    Expert Guidance
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right side content (sign-in form) */}
        <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
          <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
            <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl">
              Sign in
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <a
                href="/register"
                className="font-semibold text-black transition-all duration-200 hover:underline"
              >
                Create a free account
              </a>
            </p>
            <form onSubmit={handleSubmit} className="mt-8">
              <div className="space-y-5">
                {/* Email input */}
                <div>
                  <label
                    htmlFor="email"
                    className="text-base font-medium text-gray-900"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      type="email"
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Email"
                      required
                    />
                  </div>
                </div>

                {/* Password input */}
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-base font-medium text-gray-900"
                    >
                      Password
                    </label>
                    <a
                      href="#"
                      className="text-sm font-semibold text-black hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className="mt-2">
                    <input
                      id="password"
                      type="password"
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder-text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Password"
                      required
                    />
                  </div>
                </div>

                {/* Sign in button */}
                <div>
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                  >
                    Get started <ArrowRight className="ml-2" size={16} />
                  </button>
                </div>
                <div className="mt-3 space-y-3">
                  <button
                    type="button"
                    onClick={signInWithGooglePopup}
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
                    Sign in with Google
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
