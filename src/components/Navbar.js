import React, { useState, useContext } from "react";
import ImageModal from "./ImageModal.js";
import GameContext from "../GameContext";

import "../styles/Navbar.scss";

function Navbar() {
  const {
    imageURL,
    gameState: { chronicleStickersUrl },
  } = useContext(GameContext);
  const [isVisible, setIsVisible] = useState(false);
  const [imagePath, setImagePath] = useState("");

  function navClick(e) {
    e.preventDefault();

    if (e.target.id === "rules") {
      const url =
        "https://www.dropbox.com/s/5r4tvqpg7obi698/KID_RULEBOOK_v35_20191009.pdf?dl=0";
      window.open(url, "_blank");
    } else {
      setImagePath(imageURL + "images/" + e.target.id);
      if (e.target.id === "stickers") {
        setImagePath(chronicleStickersUrl);
      }
      setIsVisible(true);
    }
  }

  function closeModal(e) {
    e.preventDefault();
    setIsVisible(false);
  }

  return (
    <>
      <div className="navbar-container">
        <button className="navbar-button" id="map" onClick={navClick}>
          Map
        </button>
        <button className="navbar-button" id="lore" onClick={navClick}>
          Lore
        </button>
        <button className="navbar-button" id="rules" onClick={navClick}>
          Rules
        </button>
        <button className="navbar-button" id="stickers" onClick={navClick}>
          Chronicle Stickers
        </button>
        <button className="navbar-button" id="symbols" onClick={navClick}>
          Symbols Legend
        </button>
      </div>
      <ImageModal
        isVisible={isVisible}
        closeModal={closeModal}
        showClose="true"
        class="image-modal-container"
        images={[
          {
            path: imagePath,
            onClick: (e) => e.preventDefault(),
            alt: "",
            class: "image-modal",
          },
        ]}
      />
    </>
  );
}

export default Navbar;
