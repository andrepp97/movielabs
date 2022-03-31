import { MdOutlineClose } from "react-icons/md"
import { motion } from "framer-motion"
import Backdrop from "./Backdrop"
import styles from "../styles/Modal.module.css"

const slideUp = {
    hidden: {
        y: "100vh",
        opacity: 0,
    },
    visible: {
        y: "0",
        opacity: 1,
        transition: {
            duration: 0.1,
            type: "spring",
            damping: 40,
            stiffness: 400,
        },
    },
    exit: {
        y: "100vh",
        opacity: 0,
    },
}

const backdropURL = "https://image.tmdb.org/t/p/w500"

const Modal = ({ handleClose, type, video, gallery }) => {
    return (
        <Backdrop onClick={handleClose}>
            <motion.div
                onClick={e => e.stopPropagation()}
                className={styles.modal}
                variants={slideUp}
                animate="visible"
                initial="hidden"
                exit="exit"
            >
                <div className={type === "trailer" ? styles.trailerContent : styles.modalContent}>
                    <div className={styles.modalHeader}>
                        <p>
                            {type === "trailer" ? "Trailer" : "Gallery"}
                        </p>
                        <button
                            onClick={handleClose}
                            className={styles.modalBtn}
                        >
                            <MdOutlineClose size={24} />
                        </button>
                    </div>
                    {
                        type === "trailer"
                            ? (
                                <iframe
                                    allowFullScreen
                                    className={styles.trailer}
                                    title="YouTube video player"
                                    src={`https://www.youtube.com/embed/${video.length && video[0].key}`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                />
                            )
                            : (
                                <div className={styles.gallery}>
                                    {gallery && gallery.map(item => (
                                        <img
                                            loading="lazy"
                                            key={item.file_path}
                                            alt="Backdrop Image"
                                            src={backdropURL + item.file_path}
                                        />
                                    ))}
                                </div>
                            )
                    }
                </div>
            </motion.div>
        </Backdrop>
    );
};


export default Modal;