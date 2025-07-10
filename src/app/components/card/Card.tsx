
import { Userinfo } from "@/app/interface/Cardinterface";
import Link from "next/link"

const Card = ({ userInfo, index }: { userInfo: Userinfo, index: number }) => {
    const { name, nationality, age, description, url } = userInfo

    return (
        <Link href={`/bot/?no=${index}`}>
            <div
                className={`bg-cover bg-center rounded-4xl w-[300px] md:w-[calc((100% - 160px - 80px) / 5)] h-[400px] grayscale-50 relative cursor-pointer`}
                style={{ backgroundImage: `url('assets/img/pitgirls/${url}')` }}
            >
                <div className="absolute bottom-0 w-full align-middle text-center p-3">
                    <div className="flex">
                        <div className="flex w-[70px] h-[50px]">
                            <img src={`https://www.countryflags.com/wp-content/uploads/${nationality.toLowerCase()}-flag-png-large.png`} alt="flg" />
                        </div>
                        <div className="flex flex-col pl-1">
                            <div className="flex text-white font-bold text-[18px]">
                                <div className="">Name:</div>
                                <div className="">{name}</div>
                            </div>
                            <div className="flex text-white font-bold text-[16px]">
                                <div className="">{age} YRS - {nationality.toUpperCase()}</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex pt-2">
                        <div className="text-left text-white">{description.substring(0, 100)} ...</div>
                    </div>
                </div>

            </div>
        </Link>
    )
}

export default Card;