import { IoIosArrowUp } from "react-icons/io";
import { IoEllipsisVertical  } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useState } from "react";


interface AnswerCardProps {
    votes : number
}

    const AnswerCard : React.FC<AnswerCardProps> = ({votes}) => {

    const [userVote,setUserVote] = useState(votes);
    const AddVotes = () => {
        setUserVote(userVote + 1)
    }

    return <div className="flex flex-col justify-center items-center mt-5 ml-20 bg-primary rounded-xl text-primary-foreground">
        <div className="border-gray-500 border rounded-xl w-full pl-2">
        <div className="flex items-center mt-3 ml-3">
            <Avatar className="border-2 border-gray-700 rounded-xl w-12 h-12" >
                <AvatarImage></AvatarImage>
                <AvatarFallback>SL</AvatarFallback>
            </Avatar>
            <div className="text-sm flex flex-col ml-3">
                <p>Mark</p>
                <p>1 week ago</p>
            </div>
        </div>
        <div className="flex items-center m-3 mt-1">
            <p>You can just do this and that after that do that</p>
        </div>
        <div className="flex justify-between">
        <div className="ml-3 mb-3 flex gap-5 items-center ">
             <div className="hover:cursor-pointer hover:text-popover flex items-center " onClick={AddVotes}>
                <IoIosArrowUp/>
            </div>     
            <div className="hover:cursor-pointer hover:text-popover flex items-center">
                <IoEllipsisVertical/>
            </div>   
        </div>
        <div>
            <p className="mr-5">{userVote} upvotes</p>
        </div>
        </div>
        </div>
    </div>

}

export default AnswerCard