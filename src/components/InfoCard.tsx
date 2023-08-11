import React from "react";
import './styles/InfoCard.css';

export default function InfoCard({ title, data, ...props }) {
    return (
        <div className="info-card">
            <div id="info-card-title">{title}</div>
            <br></br>
            <div id="info-card-data">{data}</div>
        </div>
    )
}