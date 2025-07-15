import React from "react"
import Header from "./header"
import Footer from "./footer"

const Layout = ({children } : { children : React.ReactNode}) => {
    return (
        <div className="bg-black w-full pt-5 pb-5 pl-1 pr-1 sm:p-20 sm:pt-10">
            <Header />
            {children}
            <Footer />
        </div>
    )
}

export default Layout