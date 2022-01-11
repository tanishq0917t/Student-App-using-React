import React from 'react';
const getStudents=()=>{
 const promise=new Promise((resolve)=>{
   fetch("/getStudents").then((response)=>{
     return response.json();
   }).then((students)=>{ resolve(students); });
 });
 return promise;
}
function App()
{
  const [title]=React.useState("Thinking Machines");
  const [year]=React.useState("2021");
  const [showStudentList,setShowStudentList]=React.useState(true);
  const [showAddStudentForm,setAddStudentForm]=React.useState(false);
  const [students,setStudents]=React.useState([]);
  React.useEffect(()=>{
   const promise=getStudents().then((students)=>{
     setStudents(students);
   });
  },[]);
  const addStudent=()=>{
      setShowStudentList(false);
      setAddStudentForm(true);
  }
  const doSomething=(ev)=>{
      let name=document.getElementById("name").value;
      let id=document.getElementById("sid").value;
      let salary=document.getElementById("salary").value;
      let company=document.getElementById("company").value;
      let jobType=document.getElementById("jobType").value;
      let st={"id":id,"name":name,"salary":salary,"company":company,"jobType":jobType};
      students.push(st);
      setAddStudentForm(false);
      document.getElementById('add').disabled=false;
      setShowStudentList(true);
  }
  const cancelAction=()=>{
    /*
   document.getElementById("name").value='';
   document.getElementById("sid").value='';
   document.getElementById("salary").value='';
   document.getElementById("company").value='';
   document.getElementById("jobType").value='';
   */
   setAddStudentForm(false);
   document.getElementById('add').disabled=false;
   setShowStudentList(true);
  }
  const onClicked=(ev)=>{
      if(ev.currentTarget.id=="add") {
          document.getElementById('add').disabled=true;
          addStudent();
      }
  }
  return(
      <div>
          <TitleComponent year={year} title={title}/>
          <ToolBarComponent onClicked={onClicked}/>
          {showStudentList && <StudentList students={students}/>}
          {showAddStudentForm && <AddStudentComponent doSomething={doSomething} cancelAction={cancelAction} />}
      </div>
  )
}
const AddStudentComponent=(props)=>{
  return(
      <div>
          <form>
              Enter Id: <input type='text' id='sid'></input><br></br>
              Enter Name: <input type='text' id='name'></input><br></br>
              Enter Company: <input type='text' id='company'></input><br></br>
              Enter Salary: <input type='text' id='salary'></input><br></br>
              Enter Placement Type: <input type='text' id='jobType'></input><br></br>
              <button type='button' onClick={props.doSomething}>Add</button>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <button type='button' onClick={props.cancelAction}>Cancel</button>
          </form>
      </div>
  )
}
const TitleComponent=({year,title})=>{
  return(
      <div>
          <h1>{title} Placements - {year}</h1>
      </div>
  )
}
const ToolBarComponent=(props)=>{
  const doSomething=(ev)=>{
      //alert(ev.currentTarget.id);
      props.onClicked(ev);
  }
  return(
      <div>
          <hr></hr>
          <button type='button' onClick={doSomething} id="add"> Add </button>
          <hr></hr>
      </div>
  )
}
const StudentList=({students})=>{
  return(
      <div>
          {
              students.map((student)=>{
                  return(
                      <StudentComponent key={student.id} student={student} />
                  )
              })
          }
      </div>
  )
}
const StudentComponent=({student})=>{
  return(
      <div>
          <span>Name: <b>{student.name}</b><br /></span>
          <span>Company: <b>{student.company}</b><br /></span>
          <span>Salary: <b>{student.salary}</b><br /></span>
          <span>Job Type: <b>{student.jobType}</b><br /></span>
          <hr />
          <br></br>
      </div>
  )
}
export default App;
 
 
 
 
