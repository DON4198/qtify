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
  const title = album.title || "Untitled";
  const image = album.image || album.cover || "";
  const follows = album.follows;
  const likes = album.likes;
  const chipLabel = itemType === "song" ? `${likes ?? 0} likes` : `${follows ?? 0} follows`;

  // stable test id (use slug if available, else id)
  const idForTest = (album.slug && album.slug) || album.id || title;

  return (
    <div
      className={styles.card}
      role="article"
      aria-label={`${itemType} ${title}`}
      data-testid={`card-${idForTest}`}
    >
      <div className={styles.imageWrapper}>
        <img
          src={image || "/assets/album-placeholder.png"}
          alt={title}
          className={styles.image}
          data-testid={`card-img-${idForTest}`}
        />
        <div className={styles.chipWrapper} data-testid={`card-chip-${idForTest}`}>
          <Chip label={chipLabel} size="small" />
        </div>
      </div>

      <div className={styles.bottom}>
        <p className={styles.title} data-testid={`card-title-${idForTest}`}>{title}</p>
      </div>
    </div>
  );
}

Card.propTypes = {
  album: PropTypes.object.isRequired,
  itemType: PropTypes.oneOf(["album", "song"]),
};
