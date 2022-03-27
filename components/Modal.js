import { MdOutlineClose } from 'react-icons/md'
import { motion } from 'framer-motion'
import Backdrop from './Backdrop'

const dropIn = {
    hidden: {
        y: "-100vh",
        opacity: 0,
    },
    visible: {
        y: "0",
        opacity: 1,
        transition: {
            duration: 0.1,
            type: "spring",
            damping: 25,
            stiffness: 500,
        },
    },
    exit: {
        y: "100vh",
        opacity: 0,
    },
}

const backdropURL = 'https://image.tmdb.org/t/p/w500'

const Modal = ({ handleClose, type, video, gallery }) => {
    return (
        <Backdrop onClick={handleClose}>
            <motion.div
                onClick={e => e.stopPropagation()}
                className="modal"
                variants={dropIn}
                animate="visible"
                initial="hidden"
                exit="exit"
            >
                <div className={type === "trailer" ? "trailerContent" : "modalContent"}>
                    <div className="modalHeader">
                        <p>
                            {type === "trailer" ? "Trailer" : "Gallery"}
                        </p>
                        <button
                            onClick={handleClose}
                            className="modalBtn"
                        >
                            <MdOutlineClose size={24} />
                        </button>
                    </div>
                    {
                        type === "trailer"
                            ? (
                                <iframe
                                    allowFullScreen
                                    className="trailer"
                                    title="YouTube video player"
                                    src={`https://www.youtube.com/embed/${video.length && video[0].key}`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                />
                            )
                            : (
                                <div className="gallery">
                                    {gallery && gallery.map(item => (
                                        <img
                                            key={item.file_path}
                                            loading="lazy"
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