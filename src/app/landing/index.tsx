import Card from "../components/card"
import { PitGirls } from "../db/pitGirlsInfo"


const Landing = () => {

    return (
        <div className="mt-10">
            <div className="grid grid-cols-5 gap-5 gap-y-10">
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