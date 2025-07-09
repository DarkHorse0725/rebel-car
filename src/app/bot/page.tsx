"use client";

import React, { useEffect, useRef, useState } from "react";

import Image from "next/image";
import { useChat } from "ai/react";
import axios from "axios";

const ChatBot = () => {

    const [loading, setLoading] = useState(false);
    const [text, setText] = useState('')
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string[]>([]);
    const { messages, input, handleInputChange, handleSubmit, status, error } =
        useChat({
            api: "/api/openai",
        });

    const chatBodyRef = useRef<HTMLDivElement>(null);

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
            text: text
        }
        const generatedVideo = await axios.post('/api/hedra', inputData);
        const tempUrls: string[] = [...generatedVideoUrl]
        tempUrls.push(generatedVideo.data as string)
        setGeneratedVideoUrl(tempUrls)
        setLoading(false)
    }

    return (
        <div className="flex p-10">
            <div className="flex-1">
                <div>
                    <div ref={chatBodyRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex items-start space-x-2 text-xl ${message.role === "user" ? "justify-end" : "justify-start"
                                    }`}
                            >
                                {/* Message bubble */}
                                <div
                                    className={`px-3 py-2 rounded-md max-w-[70%] break-words text-xl ${message.role === "user"
                                        ? "bg-blue-500 text-white dark:bg-blue-600"
                                        : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                                        }`}
                                >
                                    {message.content}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-center align-center gap-2">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                        className="flex items-center border-t px-4 py-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                    >
                        <input
                            className="shadow appearance-none border rounded w-[400px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="text"
                            value={input}
                            onChange={handleInputChange}
                            placeholder="Type your message..."
                            disabled={status === "streaming" || loading === true}
                        ></input>
                        <button
                            type="submit"
                            disabled={status === "streaming" || loading === true}
                            className={`text-white ${status === "streaming" || loading === true ? 'bg-blue-400 hover:bg-blue-500 ' : 'bg-blue-700 hover:bg-blue-800' }focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800`}
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
            <div className="flex-1">
                {loading == true && <div>Generating Video ...</div>}
                <div className="flex w-full">
                    <div className="flex-1">
                        {loading == false && generatedVideoUrl.length > 0 && generatedVideoUrl.map((url, index) => (
                            <div key={index} className="">

                                <video src={url} controls></video>
                                <p>download video url : <a href={url}>To download, click here</a></p>
                            </div>
                        ))}

                        {generatedVideoUrl.length == 0 && (<Image src="/assets/001.png" width="500" height="500" alt="NFT image" />)}
                    </div>
                    <div className="flex-1 ml-2">
                        <Image src="/assets/001.png" width="500" height="500" alt="NFT image" />
                    </div>
                </div>


            </div>
        </div>
    );
};

export default ChatBot;

