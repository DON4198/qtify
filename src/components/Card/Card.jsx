// src/components/Card/Card.jsx
import React from "react";
import styles from "./Card.module.css";
import Chip from "@mui/material/Chip";
import PropTypes from "prop-types";

/**
 * Reusable Card component for albums and songs.
 *
 * Props:
 *  - album: the data object (album or song)
 *  - itemType: "album" | "song" (default "album")
 */
export default function Card({ album = {}, itemType = "album" }) {
  // album param could be actually a song when itemType==='song'
  const title = album.title || "Untitled";
  const image = album.image || album.cover || "";
  const follows = album.follows; // albums have follows
  const likes = album.likes; // songs have likes

  const chipLabel =
    itemType === "song" ? `${likes ?? 0} likes` : `${follows ?? 0} follows`;

  return (
    <div className={styles.card} role="article" aria-label={`${itemType} ${title}`}>
      <div className={styles.imageWrapper}>
        <img
          src={image || "/assets/album-placeholder.png"}
          alt={title}
          className={styles.image}
        />
        <div className={styles.chipWrapper}>
          <Chip label={chipLabel} size="small" />
        </div>
      </div>

      <div className={styles.bottom}>
        <p className={styles.title}>{title}</p>
      </div>
    </div>
  );
}

Card.propTypes = {
  album: PropTypes.object.isRequired,
  itemType: PropTypes.oneOf(["album", "song"]),
};
