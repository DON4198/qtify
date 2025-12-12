import React from "react";
import styles from "./Button.module.css";

export default function Button({ text = "Button", onClick, type = "button", className = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.button} ${className}`}
    >
      {text}
    </button>
  );
}
