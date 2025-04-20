import { FaRegTrashAlt } from "react-icons/fa";
import React, { useState } from "react";
import { TiTickOutline } from "react-icons/ti";

function TodoCard({title,handleDelete,id,checked, onCheck}) {
 

    return (
    <>
    <div className="border-pink-400 mb-3 border flex justify-between pr-4 rounded-lg p-2 pl-4 hover:bg-pink-200  text-black ">
    <label className="flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="hidden"
          checked={checked}
          onChange={() => onCheck(id,checked)}
        />
        <div
          className={`w-5 h-5 mr-3 rounded-full border-2 flex items-center justify-center
            ${checked ? "bg-pink-500 border-pink-500" : "border-pink-400"}
          `}
        >
          {checked && <TiTickOutline className="text-white text-lg" />}
        </div>
        <h1 className={`${checked ? ` text-neutral-400 ` : ""}`}>
          {title}
        </h1>
      </label>
      <button onClick={()=>handleDelete(id)} className="hover:text-red-700"><FaRegTrashAlt /></button>
    </div>
     </>
    ) 
}
export default TodoCard;
   