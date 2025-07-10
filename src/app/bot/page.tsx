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
        if (messages.length > 1 && status == 'ready') {
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
        <div className="flex py-10">
            {PitGirl && (
                <div className="w-[350px]">
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
                    <div className="pt-5 text-white">
                        <ul className="list-disc">
                            <li>Age: {PitGirl.age}</li>
                            <li>Height: {PitGirl.height}</li>
                            <li>Location: {PitGirl.location}</li>
                            <li>Character Traits: {PitGirl.character}</li>
                            <li>Hobbies: {PitGirl.hobbies}</li>
                            {PitGirl.job.length > 0 && (<li>Job: {PitGirl.job}</li>)}
                        </ul>
                    </div>
                    <div className="pt-5 h-[300px] overflow-y-scroll">
                        <div className="text-white">
                            Height:{PitGirl.description}
                        </div>
                    </div>
                </div>
            )}
            <div className="border-white rounded-4xl border-2 ml-10 w-full relative h-[calc(100vh - 300px)] overflow-y-auto">
                <div className="">
                    <div ref={chatBodyRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex items-start space-x-2 text-xl ${message.role === "user" ? "justify-end" : "justify-start"
                                    }`}
                            >
                                {/* Message bubble */}
                                <div
                                    className={`shadow-xs flex items-center justify-center px-3 py-2 rounded-4xl max-w-[70%] break-words text-xl text-white ${message.role === "user"
                                        ? "bg-[linear-gradient(90deg,_#181414_30%,_#737373_100%)]"
                                        : "bg-[linear-gradient(90deg,_#737373_30%,_#181414_100%)] "
                                        }`}
                                >
                                    {message.role !== "user" && (
                                        <>
                                            <div className="ml-3 w-[50px] h-[50px] rounded-4xl">
                                                <img className="rounded-4xl min-w-[50px] min-h-[50px]" src={`assets/img/pitgirls/${PitGirl.url}`} alt="" />
                                            </div>
                                            <div className="ml-3">
                                                {message.content}
                                            </div></>
                                    )}
                                    {message.role === "user" && (
                                        <>

                                            <div className="mr-3">
                                                {message.content}
                                            </div>
                                            <div className="mr-3 w-[50px] h-[50px] rounded-4xl">
                                                <img className="rounded-4xl min-w-[50px] min-h-[50px]" src={`assets/img/user.jpg`} alt="" />
                                            </div>
                                        </>
                                    )}

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="absolute bottom-5 p-5 w-full">
                    <div className="relative">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmit();
                            }}
                            className=""
                        >
                            <input
                                className="shadow appearance-none border rounded-4xl w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-[#2b2b2b] text-white h-[50px]"
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

