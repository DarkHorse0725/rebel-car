import React from "react"
import Header from "./header"
import Footer from "./footer"

const Layout = ({children } : { children : React.ReactNode}) => {
    return (
        <div className="bg-black w-full pt-10 pb-5 pl-1 pr-1 sm:p-20 sm:pt-5">
            <Header />
            {children}
            <Footer />
        </div>
    )
}

export default Layout