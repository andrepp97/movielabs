import { MdChevronLeft, MdChevronRight } from "react-icons/md";

export const DotButton = ({ selected, onClick, style }) => (
  <button
    type="button"
    onClick={onClick}
    className={`carousel__dot ${selected ? "is-selected" : ""}`}
    // Merges custom active background color dynamically
    style={style}
  />
);

export const PrevButton = ({ enabled, onClick, style }) => (
  <button
    className="carousel__button carousel__button--prev"
    disabled={!enabled}
    onClick={onClick}
  >
    {/* Uses style.color if passed, otherwise falls back to a clean default */}
    <MdChevronLeft size={48} color={style?.color || "#F7F7F7"} />
  </button>
);

export const NextButton = ({ enabled, onClick, style }) => (
  <button
    className="carousel__button carousel__button--next"
    disabled={!enabled}
    onClick={onClick}
  >
    {/* Uses style.color if passed, otherwise falls back to a clean default */}
    <MdChevronRight size={48} color={style?.color || "#F7F7F7"} />
  </button>
);