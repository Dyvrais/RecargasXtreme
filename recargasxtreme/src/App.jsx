import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import "./App.css";
import Products from "./components/ProductListing";
import Gallery from "./components/Gallery";
import Section from "./components/Section";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Navbar />
      <Gallery />
      <Products />
      {/* <Section /> */}
      <Footer />
    </>
  );
}

export default App;
