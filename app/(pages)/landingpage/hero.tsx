import css from "./Hero.module.css"
import { useEffect, useRef } from "react";

export default function Hero() {

  // --------- Easter egg input placeholder functionality
  const easterEggInputPlaceHolders = [
    "What are you looking for?",
    "Wacha lookin 4 2day buddy o'pal?",
    "What's on the agenda, champ?",
    "What can I help ya dig up today?",
    "What's cookin', good lookin'?",
    "Initiating search protocol…",
    "Ctrl+F vibes only.",
    "Query the archives…",
    "Lost? Type something!",
    "Searching… for meaning in life?",
    "Treasure map goes here →",
    "Lay it on me, partner.",
    "Your wish is my search!",
    "Tell me your secrets…",
    "Finders keepers…",
    "Summon the knowledge, wizard!",
    "¿Qué tienes en mente, amigo?",
    "Looking for something shiny?",
    "Engage curiosity engines!",
    "Insert cool search term.",
    "Dig it up, detective!",
  ];
  let seenIndex = -1;
  function getRandomInputPlaceholder() {
    let randomIndex = -1;
    do {
      randomIndex = Math.floor(Math.random() * easterEggInputPlaceHolders.length);
    } while (randomIndex === seenIndex && easterEggInputPlaceHolders.length > 1);

    return easterEggInputPlaceHolders[randomIndex];
  }
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.placeholder = getRandomInputPlaceholder();
    }
  }, []);

  return (
    <div className={css["container"]}>
      <div className={css["hero-text-container"]}>
        <p className={css["hero-title"]}>You&LV.com</p>
        <p className={css["hero-subtitle"]}>A free college resource hub</p>
      </div>
      <div className={css["search-container"]}>
        <input ref={inputRef} className={css["search"]} />
      </div>
    </div>
  )
}