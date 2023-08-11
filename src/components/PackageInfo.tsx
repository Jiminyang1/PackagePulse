import React from "react";
import './styles/PackageInfo.css';
import InfoCard from "./InfoCard.tsx"

export default function PackageInfo() {
    return (
        <div id="package-info">
            <div id="package-cards">
                <InfoCard title="深度" data={2} />
                <hr id="package-info-hr" />
                <InfoCard title="依赖数" data={10} />
            </div>
            <div id="package-description">
                <div>包信息</div>
            </div>
        </div>
    )
}