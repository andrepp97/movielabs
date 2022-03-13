import { MdChevronLeft, MdChevronRight } from "react-icons/md"

export const DotButton = ({ selected, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={`embla__dot ${selected ? "is-selected" : ""}`}
    />
);

export const PrevButton = ({ enabled, onClick }) => (
    <button
        className="embla__button embla__button--prev"
        disabled={!enabled}
        onClick={onClick}
    >
        <MdChevronLeft size={48} color="#F7F7F7" />
    </button>
);

export const NextButton = ({ enabled, onClick }) => (
    <button
        className="embla__button embla__button--next"
        disabled={!enabled}
        onClick={onClick}
    >
        <MdChevronRight size={48} color="#F7F7F7" />
    </button>
);
