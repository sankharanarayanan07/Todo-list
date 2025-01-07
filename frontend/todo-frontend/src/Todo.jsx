import { useEffect, useState } from "react";

export default function Todo() 
{
  const [title,settitle] = useState("");
  const [description,setdescription] = useState("");
  const [todos, Settodos] = useState([]);
  const [error, seterror] = useState("");
  const [message, setmessage] = useState("");
  const [editid, seteditid] = useState(-1);

  //edit
  const [edittitle,setedittitle] = useState("");
  const [editdescription,seteditdescription] = useState("");
  const apiuri = "http://localhost:3000";

  const handlesubmit = () => {
    seterror("")
    //check input value
    if (title.trim() !== '' && description.trim() !== '') {
      fetch(apiuri+"/todos",{
        method: "POST",
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify({title, description})
      }).then((res) => {
        if (res.ok){
          Settodos([...todos, {title, description}])
          setmessage("Item is added successfully")
          setTimeout(() => {
            setmessage("");
          },3000)
        }else {
          seterror("Unable to create TODO item")
        }
      }).catch(() => {
        setError("Unable to create Todo item")
      })
    }
  }
  useEffect(() => {
    getItems()
  }, [])

  const getItems = () => {
    fetch(apiuri+"/todos")
    .then((res) => res.json())
    .then((res) => {
      Settodos(res)
    })
  }

  const handleedit = (item) => { 
    seteditid(item._id);
    setedittitle(item.title);
    seteditdescription(item.description)
  }

  const handleupdate = ()=>{
    seterror("")
    //check input value
    if (edittitle.trim() !== '' && editdescription.trim() !== '') {
      fetch(apiuri+"/todos/"+editid,{
        method: "PUT",
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify({title: edittitle, description: editdescription})
      }).then((res) => {
        if (res.ok){
          const updatedtodos=todos.map ((item) => {
            if (item._id == editid) {
              item.title = edittitle;
              item.description = editdescription
            }
            return item;
          })
          Settodos(updatedtodos)
          setedittitle("")
          seteditdescription("")
          setmessage("Item updated successfully")
          setTimeout(() => {
            setmessage("");
          },3000)

          seteditid(-1)
        }else {
          seterror("Unable to create TODO item")
        }
      }).catch(() => {
        ("Unable to create Todo item")
      })
    }

  }

  const handleeditcancel = () => {
    seteditid(-1)
  }

  const handledelete = (id) => {
    if (window.confirm('Are sure want to delete?')) {
      fetch(apiuri+'/todos/'+id,{
        method: "DELETE"
      })
      .then(() => {
        const updatedtodos = todos.filter((item) => item._id !== id)
        Settodos(updatedtodos) 
      })
    }

  }


 


    return <>
        <div className="flex items-center justify-center h-20 bg-orange-400 rounded-lg lg:col-span-2 padding-2rem margin-auto max-width-1280px ">
          <h1 style={{ fontFamily: 'Fira Sans, sans-serif', fontSize: '30px', fontWeight: 'bold',color: 'white'}}>
            TO-DO LIST
          </h1>
        </div>

        <div className="row">
        <h3 style={{  fontSize: '17px', fontWeight: 'bold',color: 'black',borderTopWidth: '20px',borderBottomWidth: '10px', fontFamily: 'Fira Sans, sans-serif', borderBlockColor:'white'}}>Add item to your work</h3>
            {message && <p className="text-success" style={{fontSize:'12px',borderTopWidth: '10px',fontFamily: 'Fira Sans, sans-serif', borderBlockColor:'white', borderBottomWidth: '5px'}}>{message}</p>}
            <div className="gap-2 form-group d-flex">
                <input placeholder="Title" onChange={(e) => settitle(e.target.value)} value={title} className="form-control" type="text" />
                <input placeholder="Description" onChange={(e) => setdescription(e.target.value)} value={description} className="form-control" type="text" />
                <button className="btn btn-dark" onClick={handlesubmit}>Submit</button>
            </div>
          {error && <p className="text-danger">{error}</p>}
          <div className="row">
              <h3 style={{  fontSize: '17px', fontWeight: 'bold',color: 'black',borderTopWidth: '20px',borderBottomWidth: '10px', fontFamily: 'Fira Sans, sans-serif', borderBlockColor:'white'}}>Task</h3>
              <ul className="list-group">
                {
                  todos.map((item)=> <li className="my-2 shadow-inner list-group-item d-flex justify-content-between drop-shadow-md align-items-center">
                  <div className="d-flex flex-column me-2">
                    {
                      editid == -1 || editid !== item._id ? <>
                      <span className="fw-bold ">{item.title}</span>
                      <span>{item.description}</span>
                      </> : <>
                      
                      <div className="gap-2 form-group d-flex">
                <input placeholder="Title" onChange={(e) => setedittitle(e.target.value)} value={edittitle} className="form-control" type="text" />
                <input placeholder="Description" onChange={(e) => seteditdescription(e.target.value)} value={editdescription} className="form-control" type="text" />
                
            </div>
                      
                      </>
                    }
                  
                  </div>
                  
                  <div className="gap-2 d-flex">
                  { editid == -1 || editid !== item._id  ? <button className="bg-orange-400 btn text-cyan-50" onClick={() => handleedit(item)}>Edit</button> : <button className="bg-orange-400 btn text-cyan-50" onClick={handleupdate}>Update</button>}
                  { editid == -1 || editid !== item._id  ? <button className="bg-red-600 btn text-cyan-50" onClick={() => handledelete(item._id)}>Delete</button> :
                  <button className="bg-red-600 btn text-cyan-50" onClick={handleeditcancel}>Cancel</button> }
                  </div>
                  
                </li> 
                  )
                }
                

                

              </ul>
          </div>

        </div>
      </>
      
      
}