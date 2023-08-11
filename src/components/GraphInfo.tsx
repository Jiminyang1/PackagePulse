import React from "react";
import './styles/GraphInfo.css';
import InfoCard from "./InfoCard.tsx"

export default function GraphInfo() {
    return (
        <div id="graph-info">
            <div id="graph-cards">
                <InfoCard title="总依赖数" data={123} />
                <hr id="graph-info-hr" />
                <InfoCard title="循环依赖?" data="有" />
            </div>
            <div id="graph-list">
                <div>依赖包列表</div>
            </div>
        </div>
    )
}
