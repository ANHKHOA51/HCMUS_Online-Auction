import React from 'react'
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function MainLayout() {
    return (
        <div className="app-layout">
            <Header />
            <main>
                <Outlet />
            </main>
        </div>
    )
}
