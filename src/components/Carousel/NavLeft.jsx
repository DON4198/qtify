// src/components/Carousel/NavLeft.jsx
import React from "react";

export default function NavLeft({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="previous"
      style={{
        border: "none",
        background: "transparent",
        cursor: "pointer",
        padding: 6,
      }}
    >
      {/* Placeholder SVG — replace with Figma-exported left nav icon */}
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" role="img" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#ffffff" opacity="0.9" />
        <path d="M13.5 7.5L9 12l4.5 4.5" stroke="#000" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}
