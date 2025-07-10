import React from "react"
import Header from "./header"
import Footer from "./footer"

const Layout = ({children } : { children : React.ReactNode}) => {
    return (
        <div className="bg-black w-full p-20 pt-5">
            <Header />
            {children}
            <Footer />
        </div>
    )
}

export default Layout