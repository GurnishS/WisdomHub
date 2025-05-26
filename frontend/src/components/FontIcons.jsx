import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckSquare,
  faHeart,
  faEllipsisV,
  faEnvelope,
  faSchool,
  faUser,
  faSearch,
} from "@fortawesome/fontawesome-free-solid";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

function Check() {
  return (
    <div className="rounded-full bg-green-800 flex w-7 h-6 items-center justify-center mr-2 ml-2">
      <FontAwesomeIcon icon="fa-solid fa-check" className="text-xl" />
    </div>
  );
}

function Xmark() {
  return (
    <div className="rounded-full bg-red-700 flex w-7 h-6 items-center justify-center mr-2 ml-2">
      <FontAwesomeIcon icon={faXmark} className="text-2xl" />
    </div>
  );
}

function Load() {
  return (
    <FontAwesomeIcon
      icon="fa-solid fa-spinner"
      spinPulse
      className="text-xl mr-2 ml-2"
    />
  );
}

function Heart() {
  return <FontAwesomeIcon icon="fa-solid fa-heart" className="text-lg" />;
}

function Menu() {
  return <FontAwesomeIcon icon="fa-solid fa-ellipsis-v " />;
}

function Email() {
  return <FontAwesomeIcon icon="fa-solid fa-envelope" />;
}

function School() {
  return <FontAwesomeIcon icon="fa-solid fa-school" />;
}

function User() {
  return <FontAwesomeIcon icon="fa-solid fa-user" />;
}

function Search() {
  return <FontAwesomeIcon icon="fa-solid fa-search" />;
}

export { Check, Xmark, Load, Heart, Menu, Email, School, User, Search };
