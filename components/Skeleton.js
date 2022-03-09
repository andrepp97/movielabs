import React from 'react';
import ContentLoader from "react-content-loader"

const Skeleton = () => {
    return (
        <div style={{ display: 'grid', margin: '48px 0' }}>
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
        </div>
    );
};

export default Skeleton;