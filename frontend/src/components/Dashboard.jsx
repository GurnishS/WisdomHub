import Navbar from "./Navbar.jsx";
import Newsletter from "./Footer.jsx";
import Herosection from "./Herosection.jsx";
import Featuresection from "./Featuresection.jsx";
import Exploresection from "./Exploresection.jsx";
import ListPage from "./ListPage.jsx";
import { useState } from "react";

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const savedPage = sessionStorage.getItem("currentPage");
  if (savedPage) {
    setCurrentPage(savedPage);
    sessionStorage.removeItem("currentPage");
  }
  const pages = ["Question Papers", "Books", "Study Materials"];
  return (
    <>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {currentPage === "Dashboard" && <Herosection />}
      {currentPage === "Dashboard" && <Featuresection />}
      {currentPage === "Dashboard" && (
        <Exploresection setCurrentPage={setCurrentPage} />
      )}
      {pages.includes(currentPage) && <ListPage heading={currentPage} />}
      <Newsletter />
    </>
  );
}
