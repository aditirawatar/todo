import axios from "axios";
import {useEffect, useRef, useState} from "react";
const firebaseurl ='https://todo-cb60e-default-rtdb.asia-southeast1.firebasedatabase.app/';
import { toast, ToastContainer } from 'react-toastify';
import TodoCard from "./components/TodoCard";
function App() {
  let taskInput=useRef(null);
  let [status, setStatus]=useState(false);
  let [todos,setTodos]=useState([]);
  function submitHandler()
  {
    let task=taskInput.current.value;
    if(!task)
    {
      toast.error('create a task first');
      return;
    }

    setStatus(true)
   
    axios.post(`${firebaseurl}todos.json`,{
      title:task,
      checked:false
    }).then(()=>{
      setStatus(false)
      taskInput.current.value='';
      fetchTodods();
    })
  
  }
  function fetchTodods()
  {
    axios.get(`${firebaseurl}todos.json`).then(todos=>{
     let temptodo=[];
      for(let key in todos.data)
     {
      let todo={
        id:key,
        ...todos.data[key]
      }
      temptodo.push(todo);
     }
     temptodo.sort((a,b)=>a.checked - b.checked);
    setTodos(temptodo);
    })
  }

  function handleDelete(id)
  {
    console.log("delete called")
    axios.delete(`${firebaseurl}todos/${id}.json`).then(()=>{
      fetchTodods();
    })
  }

  function handleCheck(id,currentChecked)
  {
    axios.patch(`${firebaseurl}todos/${id}.json`, {
      checked: !currentChecked
    }).then(() => {
      fetchTodods();
    });
  }

   useEffect(()=>{
    fetchTodods();
   },[])
 return (
  <>
  <div className="mx-auto w-[400px] mt-16">
    <h1 className="text-2xl font-black text-center mb-2">Manage your tasks !</h1>
    <p className="text-neutral-500">Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium quos sit suscipit.</p>
<div className="flex flex-col  gap-3 justify-center ">
<input ref={taskInput} type="text" className="bg-neutral-300 w-2/3 p-2 focus:outline-none rounded-lg mt-4" placeholder="write your tasks..." />
<button onClick={submitHandler} className="p-2 rounded-lg w-1/3 bg-pink-600 text-white">{status ? "Adding..." : "Add Task"} </button>
</div>
<div className="mt-12">
{ todos.map(todo=><TodoCard id={todo.id} handleDelete={handleDelete} title={todo.title} key={todo.id} checked={todo.checked} onCheck={handleCheck} />)}
</div>

  </div>
  <ToastContainer/>
  </>
 ) 
}
export default App
