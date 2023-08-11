import React from "react";
import "./styles/Inspector.css";
import { useState } from 'react';
import GraphInfo from "./GraphInfo.tsx";
import PackageInfo from "./PackageInfo.tsx";

function Tab({ active, children, ...props }) {
    return (
        <div className={`tab ${active ? 'active' : ''}`} {...props}>
            {children}
        </div>
    );
}

export default function Inspector(props) {
    const [pane, setPane] = useState("graph");

    let paneComponent;
    switch (pane) {
        case 'package':
            paneComponent = <PackageInfo />;
            break;
        case 'graph':
            paneComponent = <GraphInfo />;
            break;
    }

    return (
        <div id="inspector" {...props}>
            <div id="tabs">
                <Tab active={pane === 'graph'} onClick={() => setPane('graph')}>
                    图信息
                </Tab>
                <Tab active={pane === 'package'} onClick={() => setPane('package')}>
                    包信息
                </Tab>
            </div>

            {paneComponent}

        </div>
    )
}