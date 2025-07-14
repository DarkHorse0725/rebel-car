import Card from "../components/card"
import { PitGirls } from "../db/pitGirlsInfo"


const Landing = () => {

    return (
        <div className="mt-10">
            <div className="grid w-fit m-auto grid-cols-1 2xl:grid-cols-5 xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5 gap-y-10">
                {
                    PitGirls.map((row: any, index) => {
                        return (
                            <Card userInfo={row} key={index} index={index} />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Landing