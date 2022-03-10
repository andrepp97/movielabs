import Link from 'next/link'

const NotFound = () => {
    return (
        <div className="pageContainer notFound">
            <h2>Ooopss...</h2>
            <h3>The page you're looking was not found</h3>
            <br />
            <Link href="/">
                <button className="btn-main">
                    Return to Home
                </button>
            </Link>
        </div>
    );
}

export default NotFound;