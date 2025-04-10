import { useState,useEffect } from "react";
import "./btn-to-top.css";
export default function BtnToTop() {
  const [isVisible, setIsVisible] = useState(false);
  function handleClick() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
  useEffect(() => {
    const scroll = () => {
      if (window.scrollY > 250) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    document.addEventListener("scroll", scroll);
    return () => {
      document.removeEventListener("scroll", scroll);
    };
  }, []);

  return (
    <>
      <button
        onClick={handleClick}
        className="btn-to-top"
        style={{ visibility: isVisible ? "visible" : "hidden" }}
      >
        ⬆
      </button>
    </>
  );
}
