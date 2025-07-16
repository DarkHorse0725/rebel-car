
import { Userinfo } from "@/app/interface/Cardinterface";
import Link from "next/link"

const Card = ({ userInfo, index }: { userInfo: Userinfo, index: number }) => {
    const { name, nationality, age, description, url } = userInfo

    return (
        <Link href={`/bot/?no=${index}`}>
            <div
                className={`bg-cover bg-center rounded-xl md:rounded-4xl  w-[170px] h-[260px] sm:w-[300px] md:w-[calc((100% - 160px - 80px) / 5)] sm:h-[400px] grayscale-50 relative cursor-pointer`}
                style={{ backgroundImage: `url('assets/img/pitgirls/${url}')` }}
            >
                <div className="absolute bottom-0 w-full align-middle text-center p-3">
                    <div className="flex">
                        <div className="flex w-[40px] h-[30px] sm:w-[70px] sm:h-[50px]">
                            <img className="rounded-xl" src={`https://www.countryflags.com/wp-content/uploads/${nationality.toLowerCase()}-flag-png-large.png`} alt="flg" />
                        </div>
                        <div className="flex flex-col pl-1">
                            <div className="flex text-white font-bold text-[10px] sm:text-[18px]">
                                <div className="">Name:</div>
                                <div className="">{name}</div>
                            </div>
                            <div className="flex text-white font-bold text-[9px] sm:text-[16px]">
                                <div className="">{age} YRS - {nationality.toUpperCase()}</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex pt-2">
                        <div className="text-left text-white text-[8px] sm:text-[16px]">{description.substring(0, 100)} ...</div>
                    </div>
                </div>

            </div>
        </Link>
    )
}

export default Card;