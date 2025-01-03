import React, { ReactNode } from 'react';
// import Navbar from './Navbar';

interface LayoutProps {
    children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div>
            {/* <Navbar /> */}
            <main>
                <div>{children}</div>
            </main>
        </div>
    )
}

export default Layout