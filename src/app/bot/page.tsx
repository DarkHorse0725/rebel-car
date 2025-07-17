"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

import { useChat } from "ai/react";
import axios from "axios";
import { PitGirls } from "../db/pitGirlsInfo";

const Chat = () => {
    const searchParams = useSearchParams()
    const no = searchParams.get('no')
    const [loading, setLoading] = useState(false);
    const [text, setText] = useState('')
    const [PitGirl, setPitGirl] = useState<any>(null)
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string[]>([]);
    const [finalVideoUrl, setFinalVideoUrl] = useState("");
    const [isVideo, setIsVideo] = useState(false);
    const { messages, input, handleInputChange, handleSubmit, status, error } =
        useChat({
            api: "/api/openai",
        });

    const chatBodyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (no) {
            setPitGirl(PitGirls[parseInt(no)])
        }
    }, [no])

    useEffect(() => {
        const container = chatBodyRef.current;
        if (!container) return;
        container.scrollTop = container.scrollHeight;
        console.log('messages => ', messages)
        console.log('status', status)
        if (messages.length > 1 && status == 'ready' && isVideo === true) {
            generateVideo(messages[messages.length - 1].content)
        }
    }, [messages, status]);

    const generateVideo = async (text: string) => {
        setLoading(true)
        const inputData = {
            text: text,
            pitGirlNo: no
        }
        const generatedVideo = await axios.post('/api/hedra', inputData);
        const tempUrls: string[] = [...generatedVideoUrl]
        setFinalVideoUrl(generatedVideo.data as string)
        tempUrls.push(generatedVideo.data as string)
        setGeneratedVideoUrl(tempUrls)
        setLoading(false)
    }



    return (
        <div className="flex py-10 flex-col sm:flex-row">
            {PitGirl && (
                <div className="w-[350px] m-auto">
                    <div className="w-full">
                        {finalVideoUrl.length == 0 && (
                            <img className="rounded-3xl" src={`assets/img/pitgirls/${PitGirl.url}`} alt="" />
                        )}
                        {loading === false && finalVideoUrl.length > 0 && (
                            <video className="rounded-3xl w-full" src={finalVideoUrl} controls></video>
                        )}
                    </div>
                    <div className="flex pt-5 items-center">
                        <div className="flex w-[70px] h-[50px]">
                            <img className="rounded-xl" src={`https://www.countryflags.com/wp-content/uploads/${PitGirl.nationality.toLowerCase()}-flag-png-large.png`} alt="flg" />
                        </div>
                        <div className="flex flex-col pl-2">
                            <div className="flex text-white font-bold text-[24px]">
                                <div className="">{PitGirl.name}</div>
                            </div>
                            <div className="flex text-white font-bold text-[16px]">
                                <div className="">{PitGirl.age} YRS - {PitGirl.nationality.toUpperCase()}</div>
                            </div>
                        </div>
                    </div>
                    <div className="hidden sm:block sm:pt-5 text-white">
                        <ul className="list-disc">
                            <li>Age: {PitGirl.age}</li>
                            <li>Height: {PitGirl.height}</li>
                            <li>Location: {PitGirl.location}</li>
                            <li>Character Traits: {PitGirl.character}</li>
                            <li>Hobbies: {PitGirl.hobbies}</li>
                            {PitGirl.job.length > 0 && (<li>Job: {PitGirl.job}</li>)}
                        </ul>
                    </div>
                    <div className="hidden  sm:block sm:pt-5 sm:h-[300px] sm:overflow-y-scroll">
                        <div className="text-white">
                            Height:{PitGirl.description}
                        </div>
                    </div>
                </div>
            )}
            <div className=" m-0 mt-5 sm:mt-0 sm:ml-10 w-full relative h-[500px] sm:h-[calc(100vh_-_150px)] ">
                <div ref={chatBodyRef} className="border-white rounded-4xl border-2 w-full relative h-[500px] sm:h-[calc(100vh_-_150px)] overflow-y-auto scroll-snap-y-container">
                    <div className="absolute right-0 w-[55%] h-[50%]">
                        <img className="w-full h-full" src={`assets/img/grid.png`} alt="grid" />
                    </div>
                    <div className="absolute left-0 bottom-0 w-[55%] h-[50%]">
                        <img className="w-full h-full" src={`assets/img/grid.png`} alt="grid" />
                    </div>
                    <div className="h-full">
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex items-start space-x-2 text-xl ${message.role === "user" ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    {/* Message bubble */}
                                    <div
                                        className={`shadow-xs flex items-center justify-center px-3 py-2 rounded-4xl max-w-[100%] sm:max-w-[70%] break-words text-xl text-white ${message.role === "user"
                                            ? "bg-[linear-gradient(90deg,_#181414_30%,_#737373_100%)]"
                                            : "bg-[linear-gradient(90deg,_#737373_30%,_#181414_100%)] "
                                            }`}
                                    >
                                        {message.role !== "user" && (
                                            <>
                                                <div className="sm:ml-3 w-[25px] h-[25px] sm:w-[50px] sm:h-[50px] rounded-4xl">
                                                    <img className="rounded-4xl min-w-[25px] min-h-[25px] sm:min-w-[50px] sm:min-h-[50px]" src={`assets/img/pitgirls/${PitGirl.url}`} alt="" />
                                                </div>
                                                <div className="ml-3 text-[12px] sm:text-[16px]" dangerouslySetInnerHTML={{ __html: message.content }}></div>
                                            </>
                                        )}
                                        {message.role === "user" && (
                                            <>

                                                <div className="mr-3 text-[12px] sm:text-[16px]">
                                                    {message.content}
                                                </div>
                                                <div className="mr-3 w-[25px] h-[25px] sm:w-[50px] sm:h-[50px] rounded-4xl">
                                                    <img className="rounded-4xl min-w-[25px] min-h-[25px] sm:min-w-[50px] sm:min-h-[50px]" src={`assets/img/user.jpg`} alt="" />
                                                </div>
                                            </>
                                        )}

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-2 sm:bottom-5 p-1 sm:p-5 w-full flex items-center gap-1 sm:gap-3">
                    <div className="relative w-[calc(100%_-_50px)]">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmit();
                            }}
                            className=""
                        >
                            <input
                                className="shadow appearance-none rounded-4xl w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-[#2b2b2b] text-white h-[50px]"
                                type="text"
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Enter text here"
                                disabled={status === "streaming" || loading === true}
                            ></input>
                            <button
                                type="submit"
                                disabled={status === "streaming" || loading === true}
                                className={`absolute right-5 top-2 bg-transparent w-[30px]`}
                            >
                                <img src="/assets/img/telegram_icon.png" alt="telegram icon" />
                            </button>
                        </form>
                    </div>
                    <div className="flex bg-[#2b2b2b] rounded-4xl p-1">
                        <div className={`cursor-pointer rounded-4xl p-2 ${isVideo == true ? 'bg-[#3f3d3d]' : ''}`} onClick={() => setIsVideo(true)}>
                            <svg className="w-7 h-7 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M14 7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7Zm2 9.387 4.684 1.562A1 1 0 0 0 22 17V7a1 1 0 0 0-1.316-.949L16 7.613v8.774Z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className={`cursor-pointer rounded-4xl p-2 ${isVideo == false ? 'bg-[#3f3d3d]' : ''}`} onClick={() => setIsVideo(false)}>
                            <svg className="w-7 h-7 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7Zm5.01 1H5v2.01h2.01V8Zm3 0H8v2.01h2.01V8Zm3 0H11v2.01h2.01V8Zm3 0H14v2.01h2.01V8Zm3 0H17v2.01h2.01V8Zm-12 3H5v2.01h2.01V11Zm3 0H8v2.01h2.01V11Zm3 0H11v2.01h2.01V11Zm3 0H14v2.01h2.01V11Zm3 0H17v2.01h2.01V11Zm-12 3H5v2.01h2.01V14ZM8 14l-.001 2 8.011.01V14H8Zm11.01 0H17v2.01h2.01V14Z" clipRule="evenodd" />
                            </svg>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ChatBot = () => {
    return (
        <Suspense>
            <Chat />
        </Suspense>
    )
}

export default ChatBot;

