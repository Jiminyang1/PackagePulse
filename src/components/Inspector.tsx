import React from "react";
import "./Inspector.css";
import { useState } from 'react';
import GraphInfo from "./GraphInfo";
import PackageInfo from "./PackageInfo";

function Tab({ active, children, ...props }) {
    return (
        <div className={`tab ${active ? 'active' : ''}`} {...props}>
            {children}
        </div>
    );
}

export default function Inspector(props) {
    const [pane, setPane] = useState("graph");
    return (
        <div id="inspector" {...props}>
            <div id="tabs">
                <Tab active={pane === 'graph'} onClick={() => setPane('graph')}>
                    依赖图信息
                </Tab>
                <Tab active={pane === 'package'} onClick={() => setPane('package')}>
                    包信息
                </Tab>
            </div>
        </div>
    )
}