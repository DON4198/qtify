// src/App.jsx
import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Section from "./components/Section/Section";

function App() {
  return (
    <div>
      <Navbar searchData={[]} />
      <Hero />

      {/* Top Albums */}
      <Section
        title="Top Albums"
        endpoint="https://qtify-backend.labs.crio.do/albums/top"
        mode="albums"
      />

      {/* New Albums */}
      <Section
        title="New Albums"
        endpoint="https://qtify-backend.labs.crio.do/albums/new"
        mode="albums"
      />

      {/* Songs section (uses Tabs, always Carousel, no Show All button) */}
      <Section
        title="Songs"
        endpoint="https://qtify-backend.labs.crio.do/songs"
        mode="songs"
        tabsEndpoint="https://qtify-backend.labs.crio.do/genres"
      />
    </div>
  );
}

export default App;
