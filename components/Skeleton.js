import ContentLoader from "react-content-loader"

const Skeleton = ({ type }) => {
    return (
        <div style={{ display: 'grid', margin: '48px 0' }}>
            {
                type === "slider"
                    ? (
                        <ContentLoader
                            speed={1}
                            width={500}
                            height={200}
                            viewBox="0 0 500 200"
                            backgroundColor="#f3f3f3"
                            foregroundColor="#cccccc"
                        >
                            <rect x="0" y="0" rx="2" ry="2" width="150" height="10" />
                            <rect x="0" y="25" rx="2" ry="2" width="150" height="180" />
                            <rect x="170" y="25" rx="2" ry="2" width="150" height="180" />
                            <rect x="340" y="25" rx="2" ry="2" width="150" height="180" />
                        </ContentLoader>
                    )
                    : type === "movie"
                        ? (
                            <ContentLoader
                                speed={1}
                                width={1080}
                                height={480}
                                viewBox="0 0 1080 480"
                                backgroundColor="#f3f3f3"
                                foregroundColor="#cccccc"
                            >
                                <rect x="400" y="0" rx="2" ry="2" width="200" height="30" />
                                <rect x="0" y="0" rx="2" ry="2" width="360" height="480" />
                                <rect x="400" y="40" rx="2" ry="2" width="200" height="10" />
                                <rect x="400" y="180" rx="2" ry="2" width="100" height="20" />
                                <rect x="400" y="210" rx="2" ry="2" width="200" height="10" />
                                <rect x="400" y="230" rx="2" ry="2" width="200" height="10" />
                                <rect x="400" y="80" rx="2" ry="2" width="100" height="20" />
                                <circle cx="420" cy="130" r="20" />
                                <circle cx="470" cy="130" r="20" />
                                <circle cx="520" cy="130" r="20" />
                                <circle cx="570" cy="130" r="20" />
                            </ContentLoader>
                        )
                        : (
                            <ContentLoader
                                speed={2}
                                width={1000}
                                height={360}
                                viewBox="0 0 1000 360"
                                backgroundColor="#f3f3f3"
                                foregroundColor="#cccccc"
                            >
                                <rect x="0" y="0" rx="2" ry="2" width="720" height="360" />
                            </ContentLoader>
                        )
            }
        </div>
    );
};

export default Skeleton;