// src/components/Section/Section.jsx
import React, { useEffect, useState } from "react";
import styles from "./Section.module.css";
import axios from "axios";
import Card from "../Card/Card";
import Carousel from "../Carousel/Carousel";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

/**
 * Reusable Section component.
 *
 * Props:
 *  - title: string
 *  - endpoint: data endpoint to fetch items (albums or songs)
 *  - mode: "albums" (default) | "songs"
 *  - tabsEndpoint: (optional) endpoint to fetch genres for mode="songs" (e.g. /genres)
 */
export default function Section({
  title = "Section",
  endpoint,
  mode = "albums",
  tabsEndpoint,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Only used for songs mode:
  const [genres, setGenres] = useState([]); // each { key, label }
  const [selectedGenreKey, setSelectedGenreKey] = useState("all"); // "all" or genre.key

  // UI toggle: only used for albums mode (collapse/showAll)
  const [showCarousel, setShowCarousel] = useState(false);

  // Fetch items (albums or songs) from endpoint
  useEffect(() => {
    if (!endpoint) return;
    let cancelled = false;
    setLoading(true);
    axios
      .get(endpoint)
      .then((res) => {
        if (!cancelled) {
          // for albums endpoint the API returns an array; for songs same
          setItems(res.data || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [endpoint]);

  // If songs mode, fetch genres from tabsEndpoint
  useEffect(() => {
    if (mode !== "songs" || !tabsEndpoint) return;
    let cancelled = false;
    axios
      .get(tabsEndpoint)
      .then((res) => {
        if (!cancelled) {
          // API returns { data: [{key, label}, ...] }
          const g = (res.data && res.data.data) || [];
          setGenres(g);
          setSelectedGenreKey("all"); // default to All
        }
      })
      .catch(() => {
        if (!cancelled) {
          setGenres([]); // fallback
        }
      });
    return () => {
      cancelled = true;
    };
  }, [mode, tabsEndpoint]);

  // Filter items for songs when a specific genre is selected
  const filteredItems =
    mode === "songs" && selectedGenreKey && selectedGenreKey !== "all"
      ? items.filter((s) => (s.genre && s.genre.key) === selectedGenreKey)
      : items;

  return (
    <section className={styles.section}>
      {/* Header: title + controls (Collapse/Show All for albums; Tabs for songs) */}
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>

        {mode === "songs" ? (
          // Render Tabs (All + fetched genres)
          <div className={styles.tabsWrapper}>
            <Tabs
              value={selectedGenreKey}
              onChange={(e, value) => setSelectedGenreKey(value)}
              aria-label={`${title} genres`}
              variant="scrollable"
              scrollButtons="auto"
              TabIndicatorProps={{ style: { display: "none" } }} // hide default indicator
              className={styles.tabs}
            >
              <Tab
                label="All"
                value="all"
                className={`${styles.tabItem} ${
                  selectedGenreKey === "all" ? styles.tabItemActive : ""
                }`}
              />
              {genres.map((g) => (
                <Tab
                  key={g.key}
                  label={g.label}
                  value={g.key}
                  className={`${styles.tabItem} ${
                    selectedGenreKey === g.key ? styles.tabItemActive : ""
                  }`}
                />
              ))}
            </Tabs>
          </div>
        ) : (
          // Albums mode: show Collapse / Show All toggle button
          <button
            className={styles.collapseButton}
            type="button"
            onClick={() => setShowCarousel((v) => !v)}
          >
            {showCarousel ? "Show All" : "Collapse"}
          </button>
        )}
      </div>

      <div className={styles.content}>
        {loading ? (
          <div className={styles.message}>Loading...</div>
        ) : error ? (
          <div className={styles.message}>Failed to load data.</div>
        ) : (
          <>
            {/* Albums mode: either grid or carousel */}
            {mode !== "songs" && !showCarousel && (
              <div className={styles.grid}>
                {items.map((itm) => (
                  <Card key={itm.id} album={itm} itemType="album" />
                ))}
              </div>
            )}

            {mode !== "songs" && showCarousel && (
              <Carousel
                items={items}
                renderItem={(album) => <Card album={album} itemType="album" />}
              />
            )}

            {/* Songs mode: NO grid. Always carousel. filteredItems respects selected genre */}
            {mode === "songs" && (
              <Carousel
                items={filteredItems}
                renderItem={(song) => <Card album={song} itemType="song" />}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}