"use client";

import React, { useRef, useState } from "react";
import { IoIosArrowUp } from "react-icons/io"
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

const Thread = {
    title:
    "How to create a design system and what is the purpose of design system?",
  category: ["Completed", "Dynamic Programming", "Graph Theory"],
  author: "Farrel",
  votes: 7,
  comments: 1,
  createdAt: "2 days ago",
}

const SubThread = {
    title: "Purpose of design system",
    content: 
        "A design system is a set of standards, components, and guidelines " +
        "that ensure consistency, efficiency, and scalability across a project " +
        "or organization. It streamlines collaboration between teams, maintains " +
        "a cohesive look and feel, and enhances product quality, all while ensuring " +
        "brand alignment and making it easier to update and scale products.",
    votes: 3,
    user: "Farrel",
    createdAt: "1 day ago"
};

const SubThreadCard : React.FC = () => {

    const [vote,setVote] = useState(Thread.votes)
    const [value, setValue] = useState('');
    const quillRef = useRef(null);

    const upVote = () => {
        setVote(vote + 1);
    }

    return <div className="flex flex-col ml-20 mt-5 bg-primary rounded-xl pl-5">
        <div className="flex mt-4">
            <div className="flex items-center gap-2">    
                <p className="font-bold">{vote}</p>
                <div className="hover:cursor-pointer hover:text-popover" onClick={upVote}>
                    <IoIosArrowUp />
                </div>     
            </div>
            <p className="ml-4 text-2xl">{Thread.title}</p>
        </div>
        
        <div className="flex justify-between items-center mt-1 mb-4 w-full">
        <div className="flex gap-7 ml-10">
            {Thread.category.map((category,index) => (
                <p key={index} className="border-2 rounded-full p-1 px-2 w-fit text-xs text-chart-3">{category}</p>
            ))}
        </div>
        <p className="mr-5">Asked {Thread.createdAt}</p>
        </div>
    </div>
}

export default SubThreadCard

