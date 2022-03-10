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
                    : (
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
                            <rect x="400" y="90" rx="2" ry="2" width="200" height="20" />
                            <rect x="400" y="120" rx="2" ry="2" width="200" height="10" />
                            <rect x="400" y="140" rx="2" ry="2" width="200" height="10" />
                        </ContentLoader>
                    )
            }
        </div>
    );
};

export default Skeleton;