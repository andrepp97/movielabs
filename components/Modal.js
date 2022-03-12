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
                <div className="modalContent" onKeyPress={e => console.log(e.key)}>
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
                                <>
                                    <button
                                        onClick={handleClose}
                                        className="btn-main modalBtn"
                                    >
                                        <MdOutlineClose size={20} />
                                    </button>
                                    <div className="gallery">
                                        <div className="flex-1 p-1">
                                            <p>Poster</p>
                                            <img
                                                loading="lazy"
                                                alt="Poster Image"
                                                className="galleryPoster img-responsive"
                                                src={gallery.posterURL + gallery.poster}
                                            />
                                        </div>
                                        <div className="flex-2 p-1">
                                            <p>Backdrop</p>
                                            <img
                                                loading="lazy"
                                                alt="Backdrop Image"
                                                className="galleryBackdrop  img-responsive"
                                                src={gallery.backdropURL + gallery.backdrop}
                                            />
                                        </div>
                                    </div>
                                </>
                            )
                    }
                </div>
            </motion.div>
        </Backdrop>
    );
};


export default Modal;