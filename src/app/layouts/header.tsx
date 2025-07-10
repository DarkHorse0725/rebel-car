const Header = () => {
    return (
        <div className="flex justify-between">
            <div className="flex">
                <div className="w-[75.7442px] h-[53.0209px]">
                    <img className="w-full h-full" src="/assets/img/logo.png" alt="rebel car logo"/>
                </div>
                <div className="flex flex-col mt-[10px] ml-2">
                    <div className="font-bold text-red-600">
                        ReBEL CARS
                    </div>
                    <div className="font-bold text-[#bfbdbc]">
                        E-SPORT SIM Racing Game 
                    </div>
                </div>
            </div>
            <div className="flex">
                <div className="">
                    <button className="bg-red-600 hover:bg-red-400 text-white w-[110px] h-[40px] font-bold rounded-4xl cursor-pointer">Sign up</button>
                </div>
                <div className="ml-2">
                    <button className="text-white hover:bg-gray-400 w-[110px] h-[40px] font-bold border-1 border-white rounded-4xl cursor-pointer">Login</button>
                </div>
            </div>
        </div>
    )
}

export default Header;