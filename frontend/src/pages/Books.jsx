import Navbar from "../components/Navbar.jsx";
import Newsletter from "../components/Footer.jsx";
import Herosection from "../components/Herosection.jsx";
import Featuresection from "../components/Featuresection.jsx";
import Exploresection from "../components/Exploresection.jsx";
import ListPage from "../components/ListPage.jsx";
import { useState } from "react";

export default function Dashboard({ user: user }) {

  const pages = ["Question Papers", "Books", "Study Materials"];
  return (
    <>
      <Navbar user={user} />
      <ListPage
        heading="Books"
        />
      <Newsletter />
    </>
  );
}