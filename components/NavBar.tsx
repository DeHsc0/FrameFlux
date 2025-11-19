import { Dosis } from "next/font/google";
import { Button } from "./ui/button";

const dosis = Dosis({
    subsets : ["latin"]
})

export default function NavBar(){

    return <nav className="flex justify-center my-5">
        <div className="flex bg-white rounded-4xl px-5 py-2 gap-12 items-center">

            <h1 className={`text-black font-bold select-none ${dosis.className}`}>
                FrameFlux
            </h1> 

            <div className="flex text-black text-sm gap-5">
                <h1>
                    How it works
                </h1>
                <h1>
                    Features
                </h1>
                <h1>
                    FAQ
                </h1>
            </div>

            <div className="flex items-center gap-3">
                <Button size={"lg"} className="bg-black text-white rounded-2xl">
                    Login
                </Button>
                <Button size={"lg"} className="bg-black text-white rounded-2xl">
                    SignUp
                </Button>
            </div>
                        
        </div>
    </nav>

}