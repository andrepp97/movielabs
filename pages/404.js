import Link from 'next/link'

const NotFound = () => {
    return (
        <div className="pageContainer notFound">
            <h2>Ooopss...</h2>
            <h3>The page you are looking was not found</h3>
            <br />
            <Link href="/" passHref={true}>
                <button className="btn-main">
                    Return to Home
                </button>
            </Link>
        </div>
    );
}

export default NotFound;