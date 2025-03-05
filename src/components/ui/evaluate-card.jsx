"use client";
import { useMotionValue } from "framer-motion";
import React, { useState, useEffect } from "react";
import { useMotionTemplate, motion } from "framer-motion";
import { cn } from "@/utils/cn";
import convertNetworkToImage from "@/utils/convertNetworkToImage";
import { convertNetworkID } from "@/utils/convertNetworkID";

export const EvervaultCard = ({
    token,
    className,
    hovering
}) => {


    let mouseX = useMotionValue(0);
    let mouseY = useMotionValue(0);

    const [randomString, setRandomString] = useState("");

    useEffect(() => {
        let str = generateRandomString(1500);
        setRandomString(str);
    }, []);


    function onMouseMove({ currentTarget, clientX, clientY }) {
        let { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
        const str = generateRandomString(1500);
        setRandomString(str);
    }


    const [hoveringNetworkSymbol, setHoveringNetworkSymbol] = useState(false);


    return (
        <div
            className={cn(
                "p-0.5  bg-transparent aspect-square  flex items-center justify-center w-full h-full relative",
                className
            )}
        >
            <div
                onMouseMove={onMouseMove}
                className="group/card rounded-3xl w-full relative overflow-hidden bg-transparent flex items-center justify-center h-full"
            >
                {/* <div className="bg-red"> */}
                {/* </div> */}
                <CardPattern
                    mouseX={mouseX}
                    mouseY={mouseY}
                    randomString={randomString}
                />
                <div className="w-full relative z-10 h-full flex items-center justify-center">
                    <div className="relative gap-2 h-full flex-col w-full rounded-full flex items-center justify-center text-white font-bold text-4xl">
                        {/* <div className="absolute w-full h-full bg-white/[0.8] dark:bg-black/[0.8] blur-sm rounded-full" /> */}
                        <div className="absolute top-2 right-2 z-[999999]" onMouseEnter={() => {
                            setHoveringNetworkSymbol(true);
                        }}
                            onMouseLeave={() => {
                                setHoveringNetworkSymbol(false);

                            }}
                        >
                            <img className="w-8 h-8  p-1 object-contain rounded-full" src={convertNetworkToImage(token.network.id) || token.network.logo} alt={token.network.name} />
                            <div className={`text-xs bg-dark px-2 py-1 rounded-md ${hoveringNetworkSymbol ? 'flex' : 'hidden'} absolute right-0 border-bordergray z-[999999]`}>
                                {token.network.name}
                            </div>
                        </div>
                        <div>
                            <img
                                src={token.logo || "/placeholder.png"}
                                alt={token.symbol}
                                className={`w-16 h-16 rounded-full transition-all duration-300 ease-in-out ${hovering === true ? "w-20 h-20" : ""}`}
                            />
                        </div>
                        <span className="text-white z-20 text-lg lg:text-xl ">{token.symbol}</span>
                        <div className="text-xs font-normal opacity-40 relative top-[-5px] truncate ... max-w-full">{token.name}</div>

                        {/* betting volume */}
                        {/* <div className="flex items-center justify-center bg-darkgray p-2 gap-1">
                            <span className="text-xs text-white z-20">Betting Volume</span>
                            <span className="text-xs text-white z-20">0.00 WETH</span>
                        </div> */}
                    </div>
                </div>
            </div>
        </div >
    );
};

export function CardPattern({ mouseX, mouseY, randomString }) {
    let randommousex = useMotionValue(0);
    let randommousey = useMotionValue(0);
    let maskImage = useMotionTemplate`radial-gradient(400px at ${randommousex}px ${randommousey}px, white, transparent)`;
    let style = { maskImage, WebkitMaskImage: maskImage };

    useEffect(() => {
        // const interval = setInterval(() => {
        //     // Update the motion values to change the position of the gradient
        //     randommousex.set(0); // Assuming full browser width for simplicity
        //     randommousey.set(0); // Assuming full browser height for simplicity
        // }, 100); // Adjust time interval as needed

        // return () => clearInterval(interval);
    }, []);

    return (
        <div className="pointer-events-none transition-all">
            <div className="absolute inset-0 transition-all rounded-2xl  [mask-image:linear-gradient(white,transparent)] opacity-50"></div>
            <motion.div
                className="absolute inset-0 transition-all rounded-2xl bg-gradient-to-r from-green-500 to-blue-700 opacity-100 backdrop-blur-xl duration-500"
                style={style}
            />
            <motion.div
                className="absolute inset-0 rounded-2xl opacity-100 mix-blend-overlay"
                style={style}
            >
                <p className="absolute inset-x-0 text-xs h-full break-words whitespace-pre-wrap text-white font-mono font-bold transition duration-500">
                    {randomString}
                </p>
            </motion.div>
        </div>
    );
}
const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export const generateRandomString = (length) => {
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

export const Icon = ({ className, ...rest }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className={className}
            {...rest}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
        </svg>
    );
};
