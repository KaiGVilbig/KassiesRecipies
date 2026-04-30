import React, { ReactNode } from 'react';
// import Navbar from './Navbar';

interface LayoutProps {
    children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="min-h-screen bg-background">
            <main className="flex flex-col">
                {children}
            </main>
        </div>
    )
}

export default Layout