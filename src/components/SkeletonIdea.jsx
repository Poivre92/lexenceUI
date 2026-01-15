import React from 'react';
import './SkeletonIdea.css';

const SkeletonIdea = ({ type = "list" }) => {
    if (type === "card") {
        return (
            <div className="skeleton-idea-card">
                <div className="skeleton-card-main">
                    <div className="skeleton-line title"></div>
                    <div className="skeleton-line desc"></div>
                    <div className="skeleton-meta">
                        <div className="skeleton-tag"></div>
                        <div className="skeleton-text"></div>
                    </div>
                </div>
                <div className="skeleton-badge"></div>
            </div>
        );
    }

    return (
        <div className="skeleton-idea-item">
            <div className="skeleton-info">
                <div className="skeleton-line title"></div>
                <div className="skeleton-line status"></div>
            </div>
            <div className="skeleton-votes"></div>
        </div>
    );
};

export default SkeletonIdea;
