// "use client";

// import Navbar from "@/components/Navbar";
// import SubThreadCard from "@/components/SubThreadCard";
// import AnswerCard from "@/components/AnswerCard";
// import { useEffect, useRef, useState } from "react";
// import { IoChatbubbleOutline } from "react-icons/io5";
// import SidebarThreads from "@/components/SidebarThreads";
// import { IoArrowUp, IoArrowDown } from "react-icons/io5";
// import RichTextEditorComponent from "@/components/RichTextEditorComponent";
// import { Button } from "@/components/ui/button";
// import { SaveConfirmationDialog } from "@/components/SaveConfirmationDialog";
// import { AnswerConfirmation } from "@/components/AnswerConfirmation";
// import { EditorContent } from "@tiptap/react";
// const threads = [
//   {
//     title:
//       "How to create a design system and what is the purpose of design system?",
//     category: ["Completed", "Dynamic Programming", "Graph Theory"],
//     author: "Farrel",
//     votes: 7,
//     comments: 1,
//     createdAt: "2 days ago",
//   },
//   {
//     title: "Best Practices in UI Design",
//     category: ["Greedy", "Graph Theory", "Dynamic Programming"],
//     author: "Farrel",
//     votes: 3,
//     comments: 5,
//     createdAt: "2 days ago",
//   },
//   {
//     title: "Best Practices in UI Design",
//     category: ["Greedy", "Graph Theory", "Dynamic Programming"],
//     author: "Farrel",
//     votes: 3,
//     comments: 5,
//     createdAt: "Apr 14",
//   },
//   {
//     title: "Best Practices in UI Design",
//     category: ["Greedy", "Graph Theory", "Dynamic Programming"],
//     author: "Farrel",
//     votes: 3,
//     comments: 5,
//     createdAt: "Apr 14",
//   },
//   {
//     title: "Best Practices in UI Design",
//     category: ["Greedy", "Graph Theory", "Dynamic Programming"],
//     author: "Farrel",
//     votes: 3,
//     comments: 5,
//     createdAt: "Apr 14",
//   },
//   {
//     title: "Best Practices in UI Design",
//     category: ["Greedy", "Graph Theory", "Dynamic Programming"],
//     author: "Farrel",
//     votes: 3,
//     comments: 5,
//     createdAt: "Apr 14",
//   },
//   {
//     title: "Best Practices in UI Design",
//     category: ["Greedy", "Graph Theory", "Dynamic Programming"],
//     author: "Farrel",
//     votes: 3,
//     comments: 5,
//     createdAt: "Apr 14",
//   },
//   {
//     title: "Best Practices in UI Design",
//     category: ["Greedy", "Graph Theory", "Dynamic Programming"],
//     author: "Farrel",
//     votes: 3,
//     comments: 5,
//     createdAt: "Apr 14",
//   },
//   {
//     title: "Best Practices in UI Design",
//     category: ["Greedy", "Graph Theory", "Dynamic Programming"],
//     author: "Farrel",
//     votes: 3,
//     comments: 5,
//     createdAt: "Apr 14",
//   },
//   {
//     title: "Best Practices in UI Design",
//     category: ["Greedy", "Graph Theory", "Dynamic Programming"],
//     author: "Farrel",
//     votes: 3,
//     comments: 5,
//     createdAt: "Apr 14",
//   },
//   {
//     title: "Best Practices in UI Design",
//     category: ["Greedy", "Graph Theory", "Dynamic Programming"],
//     author: "Farrel",
//     votes: 3,
//     comments: 5,
//     createdAt: "Apr 14",
//   },
//   {
//     title: "Best Practices in UI Design",
//     category: ["Greedy", "Graph Theory", "Dynamic Programming"],
//     author: "Farrel",
//     votes: 3,
//     comments: 5,
//     createdAt: "Apr 14",
//   },
// ];

// export default function Subthread() {
//   const [savedContent, setSavedContent] = useState("");
//   const [error, setError] = useState(true);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [validate, setValidate] = useState(false);
//   const editorRef = useRef<{ getEditorContent: () => void } | null>(null);
//   const [sortBy, setSortBy] = useState("Oldest");
//   const [isCommentVisible, setIsCommentVisible] = useState(false);
//   const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
//   const toggleSortBy = () => {
//     setSortBy((prev) => (prev === "Oldest" ? "Newest" : "Oldest"));
//   };

//   useEffect(() => {
//     if (!validate) return;

//     const div = document.createElement("div");
//     div.innerHTML = savedContent;
//     const plainText = div.textContent || div.innerText;
//     setSavedContent(plainText);
//     console.log(savedContent);

//     if (savedContent === "<p></p>") {
//       setErrorMessage("Answer can not be empty !");
//     } else {
//       setErrorMessage("");
//       setError(false);
//     }

//     setValidate(false);
//   }, [validate, savedContent]);

//   const handleSafe = () => {
//     if (editorRef.current) {
//       editorRef.current.getEditorContent();
//     }
//     setValidate(true);
//   };

//   const handleSubmit = () => {
//     if (!error) {
//       setIsConfirmationVisible(!isConfirmationVisible);
//       setIsCommentVisible(!isCommentVisible);
//       setError(true);
//     }
//   };

//   return (
//     <>
//       <Navbar></Navbar>
//       <div className="flex gap-10 rounded-md">
//         <div className="w-full">
//           <SubThreadCard></SubThreadCard>
//           <div className="flex justify-between items-center flex-row mt-3">
//             <div className="ml-24 flex gap-3 ">
//               <p>Sort : </p>
//               <p
//                 onClick={toggleSortBy}
//                 className="hover:cursor-pointer hover:text-popover flex items-center gap-3"
//               >
//                 {sortBy} {sortBy === "Oldest" ? <IoArrowUp /> : <IoArrowDown />}
//               </p>
//             </div>
//             <div
//               className="hover:cursor-pointer hover:text-popover mr-7"
//               onClick={() => setIsCommentVisible(!isCommentVisible)}
//             >
//               <IoChatbubbleOutline size={28} />
//             </div>
//           </div>
//           {isCommentVisible && (
//             <div className="mt-4 ml-20 bg-primary rounded-md ">
//               <h1 className="pt-2 text-xl ml-5 ">Your Answer</h1>
//               <div className="ml-5 mr-5">
//                 <RichTextEditorComponent
//                   ref={editorRef}
//                   onSubmit={setSavedContent}
//                 />
//                 <p>{savedContent}</p>
//                 <p className="text-[0.8rem] font-medium text-destructive">
//                   {errorMessage}
//                 </p>
//                 <div className="flex items-center">
//                   <Button
//                     className="button bg-popover-foreground m-2"
//                     onClick={handleSafe}
//                   >
//                     Safe
//                   </Button>
//                   <Button
//                     className="button bg-popover-foreground m-2"
//                     onClick={handleSubmit}
//                   >
//                     Submit
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           )}
//           {isConfirmationVisible && (
//             <AnswerConfirmation
//               onConfirm={() => setIsConfirmationVisible(!isConfirmationVisible)}
//             />
//           )}

//           <AnswerCard votes={3}></AnswerCard>
//           <AnswerCard votes={3}></AnswerCard>
//           <AnswerCard votes={3}></AnswerCard>
//           <AnswerCard votes={3}></AnswerCard>
//           <AnswerCard votes={3}></AnswerCard>
//           <AnswerCard votes={3}></AnswerCard>
//           <AnswerCard votes={3}></AnswerCard>
//         </div>

//         <div className="flex mt-5 mr-5 w-[36rem] bg-primary rounded-xl text-primary-foreground flex-col items-center pl-5 pr-5">
//           <h1 className="text-2xl mt-3">Similar Topic</h1>
//           <div className="h-[2px] w-full bg-background mt-3"></div>
//           <div className="flex flex-col gap-1">
//             {threads.map((thread, index) => (
//               <div className="" key={index}>
//                 <SidebarThreads
//                   num={index + 1}
//                   title={thread.title}
//                   createdAt={thread.createdAt}
//                   author={thread.author}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
