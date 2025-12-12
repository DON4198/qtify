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
 *  - tabsEndpoint: (optional) endpoint to fetch genres for mode="songs"
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
  const [genres, setGenres] = useState([]); // array of { key, label }
  const [selectedGenreKey, setSelectedGenreKey] = useState("all"); // "all" or genre.key

  // UI toggle: only used for albums mode (grid <-> carousel)
  const [showCarousel, setShowCarousel] = useState(false);

  // Normalize title to a test-friendly id (lowercase, dashed)
  const sectionId = title.toLowerCase().replace(/\s+/g, "-");

  // Fetch items (albums or songs)
  useEffect(() => {
    if (!endpoint) return;
    let cancelled = false;
    setLoading(true);
    axios
      .get(endpoint)
      .then((res) => {
        if (!cancelled) {
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

  // If songs mode, fetch genres
  useEffect(() => {
    if (mode !== "songs" || !tabsEndpoint) return;
    let cancelled = false;
    axios
      .get(tabsEndpoint)
      .then((res) => {
        if (!cancelled) {
          // some APIs return { data: [...] } while others might return [...]
          const g = res.data && res.data.data ? res.data.data : res.data || [];
          setGenres(g);
          setSelectedGenreKey("all");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setGenres([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [mode, tabsEndpoint]);

  // Filter songs by selected genre (for songs mode)
  const filteredItems =
    mode === "songs" && selectedGenreKey && selectedGenreKey !== "all"
      ? items.filter((s) => (s.genre && s.genre.key) === selectedGenreKey)
      : items;

  // Render
  return (
    <section className={styles.section} data-testid={`${sectionId}-section`}>
      <div className={styles.header}>
        <h2 className={styles.title} data-testid={`${sectionId}-title`}>{title}</h2>

        {mode === "songs" ? (
          <div className={styles.tabsWrapper} data-testid={`${sectionId}-tabs`}>
            <Tabs
              value={selectedGenreKey}
              onChange={(e, value) => setSelectedGenreKey(value)}
              aria-label={`${title} genres`}
              variant="scrollable"
              scrollButtons="auto"
              TabIndicatorProps={{ style: { display: "none" } }}
              className={styles.tabs}
            >
              <Tab
                label="All"
                value="all"
                className={`${styles.tabItem} ${selectedGenreKey === "all" ? styles.tabItemActive : ""}`}
                data-testid={`${sectionId}-tab-all`}
              />
              {genres.map((g) => (
                <Tab
                  key={g.key}
                  label={g.label}
                  value={g.key}
                  className={`${styles.tabItem} ${selectedGenreKey === g.key ? styles.tabItemActive : ""}`}
                  data-testid={`${sectionId}-tab-${g.key}`}
                />
              ))}
            </Tabs>
          </div>
        ) : (
          <button
            className={styles.collapseButton}
            type="button"
            onClick={() => setShowCarousel((v) => !v)}
            data-testid={`${sectionId}-toggle-button`}
          >
            {showCarousel ? "Show All" : "Collapse"}
          </button>
        )}
      </div>

      <div className={styles.content}>
        {loading ? (
          <div className={styles.message} data-testid={`${sectionId}-loading`}>Loading...</div>
        ) : error ? (
          <div className={styles.message} data-testid={`${sectionId}-error`}>Failed to load data.</div>
        ) : (
          <>
            {/* Albums mode: grid (default) */}
            {mode !== "songs" && !showCarousel && (
              <div className={styles.grid} data-testid={`${sectionId}-grid`}>
                {items.map((itm) => (
                  <Card key={itm.id} album={itm} itemType="album" />
                ))}
              </div>
            )}

            {/* Albums mode: carousel */}
            {mode !== "songs" && showCarousel && (
              <div data-testid={`${sectionId}-carousel`}>
                <Carousel items={items} renderItem={(album) => <Card album={album} itemType="album" />} />
              </div>
            )}

            {/* Songs mode: always carousel (filtered by selected genre) */}
            {mode === "songs" && (
              <div data-testid={`${sectionId}-carousel`}>
                <Carousel items={filteredItems} renderItem={(song) => <Card album={song} itemType="song" />} />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
