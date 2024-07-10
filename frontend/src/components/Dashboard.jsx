import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import Newsletter from "./Newsletter.jsx";
import Herosection from "./Herosection.jsx";
import Featuresection from "./Featuresection.jsx";
import Exploresection from "./Exploresection.jsx";
import PdfContainer from "./PdfContainer.jsx";
import LoadingScreen from "./Loading.jsx";
import ListPage from "./ListPage.jsx";
import { useState } from "react";

export default function Dashboard({ page = "Dashboard" }) {
  const [currentPage, setCurrentPage] = useState(page);
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
