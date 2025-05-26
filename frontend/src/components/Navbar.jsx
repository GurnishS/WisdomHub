import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";

import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import UploadForm from "./UploadForm.jsx";
import SearchModal from "./SearchModal.jsx";
import { Search } from "./FontIcons.jsx";
import { signOut } from "firebase/auth";
import auth from "../utils/firebase"; // Ensure firebase exports auth
import store from "../store.js";

const navigation = [
  { name: "Dashboard", link: "/dashboard" },
  { name: "Question Papers", link: "/question-papers" },
  { name: "Books", link: "/books" },
  { name: "Study Materials", link: "/study-materials" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar({ user }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenSearch, setModalOpenSearch] = useState(false);
  const navigate = useNavigate();

  console.log("User in Navbar: ", user);

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
      store.addMessage({
        message: "Logged out successfully",
        type: "success",
      });
    } catch (error) {
      console.error("Error signing out: ", error);
      store.addMessage({
        message: "Error signing out",
        type: "error",
      });
    }
  };

  return (
    <Disclosure as="nav" className="bg-gray-900">
      {({ open }) => (
        <>
          {modalOpenSearch && (
            <SearchModal
              modalOpenSearch={modalOpenSearch}
              setModalOpenSearch={setModalOpenSearch}
            />
          )}
          {modalOpen && (
            <UploadForm modalOpen={modalOpen} setModalOpen={setModalOpen} />
          )}

          <div className="mx-auto max-w-7xl px-2 sm:px-2 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              {/* Mobile menu button */}
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <DisclosureButton className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>

              {/* Logo */}
              <div className="flex flex-shrink-0 items-center">
                <img
                  className="h-12 ml-8 sm:ml-0 lg:ml-0 hidden lg:block"
                  src="/logo.png"
                  alt="Your Company"
                />
                <img
                  className="h-12 ml-10 sm:ml-0 lg:ml-0 lg:hidden"
                  src="/cap.png"
                  alt="Your Company"
                />
              </div>

              {/* Navigation links */}
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.link}
                      className={({ isActive }) =>
                        classNames(
                          isActive
                            ? "bg-black text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium flex items-center cursor-pointer"
                        )
                      }
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </div>

              {/* Right side buttons */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                  type="button"
                  onClick={() => setModalOpenSearch(true)}
                  className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-4"
                >
                  <Search />
                </button>

                {user ? (
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => setModalOpen(true)}
                      className="mr-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80"
                    >
                      New
                    </button>

                    <Menu as="div" className="relative ml-3">
                      <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="sr-only">Open user menu</span>
                        {user.photoURL ? (
                          <img
                            className="h-8 w-8 rounded-full"
                            src={user.photoURL}
                            alt="User avatar"
                          />
                        ) : (
                          <img
                            className="h-8 w-8 rounded-full"
                            src="/default-avatar.png"
                            alt="Default avatar"
                          />
                        )}

                      </MenuButton>

                      <Transition
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <MenuItem>
                            {({ focus }) => (
                              <a
                                href={"/user/"+user.username  }
                                className={classNames(
                                  focus ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                Your Profile
                              </a>
                            )}
                          </MenuItem>
                          <MenuItem>
                            {({ focus }) => (
                              <a
                                href="#"
                                className={classNames(
                                  focus ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                Settings
                              </a>
                            )}
                          </MenuItem>
                          <MenuItem>
                            {({ focus }) => (
                              <button
                                onClick={logout}
                                className={classNames(
                                  focus ? "bg-gray-100" : "",
                                  "block w-full text-left px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                Sign out
                              </button>
                            )}
                          </MenuItem>
                        </MenuItems>
                      </Transition>
                    </Menu>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="mx-6 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as={NavLink}
                  to={item.link}
                  className={({ isActive }) =>
                    classNames(
                      isActive
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "block rounded-md px-3 py-2 text-base font-medium"
                    )
                  }
                  aria-current={({ isActive }) => (isActive ? "page" : undefined)}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
