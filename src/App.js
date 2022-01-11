import React from 'react';
import loading from './loading.gif';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit,faTrash } from '@fortawesome/free-solid-svg-icons';
const getStudents=()=>{
  const promise=new Promise((resolve)=>{
    fetch("/getStudents").then((response)=>{ 
      return response.json();
    }).then((students)=>{resolve(students); });
  });
  return promise;
}
const addPlacement=(student)=>{
    const promise=new Promise((resolve)=>{
        var dataString=`id=${student.id}&name=${encodeURIComponent(student.name)}&placementType=${student.placementType}&company=${encodeURIComponent(student.company)}&salary=${student.salary}&salaryType=${student.salaryType}`;
        //alert(dataString);
        fetch("/addStudent",{
            "method":"POST",
            "headers":{"Content-Type":"application/x-www-form-urlencoded"},
            "body":dataString
        }).then((response)=>{
            return response.json();
        }).then((responseJSON)=>{resolve(responseJSON)});
    });
    return promise;
}
const editPlacement=(student)=>{
    const promise=new Promise((resolve)=>{
        var dataString=`id=${student.id}&name=${encodeURIComponent(student.name)}&placementType=${student.placementType}&company=${encodeURIComponent(student.company)}&salary=${student.salary}&salaryType=${student.salaryType}`;
        //alert(dataString);
        fetch("/editStudent",{
            "method":"POST",
            "headers":{"Content-Type":"application/x-www-form-urlencoded"},
            "body":dataString
        }).then((response)=>{
            return response.json();
        }).then((responseJSON)=>{resolve(responseJSON)});
    });
    return promise;
}
const deletePlacement=(id)=>{
    const promise=new Promise((resolve)=>{
        var dataString=`id=${id}`;
        //alert(dataString);
        fetch("/deleteStudent",{
            "method":"POST",
            "headers":{"Content-Type":"application/x-www-form-urlencoded"},
            "body":dataString
        }).then((response)=>{
            return response.json();
        }).then((responseJSON)=>{resolve(responseJSON)});
    });
    return promise;
}
function App()
{
   const [title]=React.useState("Thinking Machines");
   const [year]=React.useState("2021");
   const [showStudentList,setShowStudentList]=React.useState(true);
   const [showAddStudentForm,setAddStudentForm]=React.useState(false);
   const [showEditStudentForm,setShowEditStudentForm]=React.useState(false);
   const [showDeleteStudentForm,setShowDeleteStudentForm]=React.useState(false);
   const [selectedStudent,setSelectedStudent]=React.useState(null);
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
   const cancelAction=()=>{
    setAddStudentForm(false);
    setShowDeleteStudentForm(false);
    setShowEditStudentForm(false);
    document.getElementById('add').disabled=false;
    setShowStudentList(true);
   }
   const onClicked=(ev)=>{
       if(ev.currentTarget.id==="add") 
       {
           document.getElementById('add').disabled=true;
           addStudent();
       }
   }
   const showEditForm=(sid)=>{
       //alert(`${sid} recieved for editing`);
       document.getElementById('add').disabled=true;
       setShowStudentList(false);
       setShowEditStudentForm(true);
       for(let i=0;i<students.length;i++)
       {
           if(students[i].id==sid)
           {
               setSelectedStudent(students[i]);
               break;
           }
       }
   }
   const showDeleteForm=(sid)=>{
        //alert(`${sid} recieved for deleting`);
        document.getElementById('add').disabled=true;
        setShowDeleteStudentForm(true);
        setShowStudentList(false);
        for(let i=0;i<students.length;i++)
       {
           if(students[i].id==sid)
           {
               setSelectedStudent(students[i]);
               break;
           }
       }
    }
   const addStudentDetails=(details)=>{
       if(details.placementType=="F") details.placementType="Full Time";
       else if(details.placementType=="I") details.placementType="Internship";
       if(details.salaryType=="M" && details.salary<100000) details.salary=details.salary+"/- per month";
       else if(details.salaryType=="M" && details.salary>=100000) details.salary=details.salary/100000+" LPA";
       else if(details.salaryType=="Y" && details.salary>=100000) details.salary=details.salary/100000+" LPA";
       else if(details.salaryType=="Y" && details.salary<100000) details.salary=details.salary+"/- per month";
       students.push(details);
   }
   const deleteStudentDetails=(details)=>{
    for(let i=0;i<students.length;i++)
    {
        if(students[i].id==details.id)
        {
            students.splice(i,1);
            break;
        }
    }
    }
    const editStudentDetails=(details)=>{
        for(let i=0;i<students.length;i++)
        {
            if(students[i].id==details.id)
            {
                students.splice(i,1);
                break;
            }
        }
        if(details.placementType=="F") details.placementType="Full Time";
        else if(details.placementType=="I") details.placementType="Internship";
        if(details.salaryType=="M" && details.salary<100000) details.salary=details.salary+"/- per month";
        else if(details.salaryType=="M" && details.salary>=100000) details.salary=details.salary/100000+" LPA";
        else if(details.salaryType=="Y" && details.salary>=100000) details.salary=details.salary/100000+" LPA";
        else if(details.salaryType=="Y" && details.salary<100000) details.salary=details.salary+"/- per month";
        students.push(details);
    }
   return(
       <div>
           <TitleComponent year={year} title={title}/>
           <ToolBarComponent onClicked={onClicked}/>
           {showStudentList && <StudentList students={students} onEdit={showEditForm} onDelete={showDeleteForm} />}
           {showAddStudentForm && <AddStudentComponent addStudentDetails={addStudentDetails} cancelAction={cancelAction} />}
           {showEditStudentForm && <EditStudentComponent selectedStudent={selectedStudent} editStudentDetails={editStudentDetails} cancelAction={cancelAction} />}
           {showDeleteStudentForm && <DeleteStudentComponent selectedStudent={selectedStudent} deleteStudentDetails={deleteStudentDetails} cancelAction={cancelAction} />}
       </div>
   )
}


const AddStudentComponent=(props)=>{
    const [displayWhat,setDisplayWhat]=React.useState("formSection");
    const [id,setId]=React.useState(0);
    const [idError,setIdError]=React.useState("");

    const [name,setName]=React.useState("");
    const [nameError,setNameError]=React.useState("");

    const [company,setCompany]=React.useState("");
    const [companyError,setCompanyError]=React.useState("");

    const [salary,setSalary]=React.useState(0);
    const [salaryError,setSalaryError]=React.useState("");

    const [salaryType,setSalaryType]=React.useState("Y");

    const [fullTimeChecked,setFullTimeChecked]=React.useState("checked");

    const [internshipChecked,setInternshipChecked]=React.useState("");

    const [placementType,setPlacementType]=React.useState("F");

    const [formError,setFormError]=React.useState("");
    const idChanged=(ev)=>{
        setId(ev.target.value);
    }
    const nameChanged=(ev)=>{
        setName(ev.target.value);
    }
    const companyChanged=(ev)=>{
        setCompany(ev.target.value);
    }
    const salaryChanged=(ev)=>{
        setSalary(ev.target.value);
    }
    const salaryTypeChanged=(ev)=>{
        setSalaryType(ev.target.value);
    }
    const placementTypeChanged=(ev)=>{
        if(ev.target.value==="F" && ev.target.checked)
        {
            setPlacementType("F");
            setInternshipChecked("");
            setFullTimeChecked("checked");
        }
        if(ev.target.value==="I" && ev.target.checked)
        {
            setPlacementType("I");
            setInternshipChecked("checked");
            setFullTimeChecked("");
        }
    }
    const clearAllErrors=()=>{
        setCompanyError("");
        setIdError("");
        setNameError("");
        setSalaryError("");
        setFormError("");
    }
    const clearForm=()=>{
        setId(0);
        setName("");
        setPlacementType("F");
        setFullTimeChecked("checked");
        setInternshipChecked("");
        setCompany("");
        setSalary(0);
        setSalaryType("Y");
    }
    const addAnother=()=>{
        setDisplayWhat("formSection");
    }
    const addHandler=()=>{
        clearAllErrors();
        var hasErrors=false;
        if(id=="" || id<=0)
        {
            setIdError(" * ");
            hasErrors=true;
        }
        if(name==="")
        {
            setNameError(" * ");
            hasErrors=true;
        }
        if(company==="")
        {
            setCompanyError(" * ");
            hasErrors=true;
        }
        if(salary=="" || salary<=0)
        {
            setSalaryError(" * ");
            hasErrors=true;
        }
        if(hasErrors) return;
        //alert(id+","+name+","+company+","+salary+","+salaryType+","+placementType);
        var student={
            "id":id,
            "name":name,
            "salary":salary,
            "company":company,
            "salaryType":salaryType,
            "placementType":placementType
        }
        setDisplayWhat("processing")
        addPlacement(student).then((responseJSON)=>{
            if(responseJSON.success==true)
            {
                props.addStudentDetails(student);
                clearForm();
                setDisplayWhat("addMoreSection");
            }
            else
            {
                setFormError(responseJSON.error);
            }
        });
    }
    if(displayWhat==="processing") return(
        <div>
            <img src={loading}></img>
        </div>
    )
    if (displayWhat==="formSection")return(
       <div>
           <h1>Add Placement Entry</h1>
           <form>
               <span style={{color:'red'}}>{formError}</span><br></br>
               <label htmlFor='id'>ID &nbsp;</label>
               <input type='number' id='id' value={id} onChange={idChanged}/>
               <span style={{color:'red'}}>{idError}</span><br></br>

               <label htmlFor='name'>Name &nbsp;</label>
               <input type='text' id='name' value={name} onChange={nameChanged}/>
               <span style={{color:'red'}}>{nameError}</span><br></br>

               <label htmlFor='placementType'>Placement Type &nbsp;</label>
               <input type='radio' id='fullTime' name='placementType' checked={fullTimeChecked} value='F' onChange={placementTypeChanged} />Full Time &nbsp;&nbsp;&nbsp;
               <input type='radio' id='internship' name='placementType' checked={internshipChecked} value='I' onChange={placementTypeChanged} />Internship<br></br>

               <label htmlFor='company'>Company &nbsp;</label>
               <input type='text' id='company' value={company} onChange={companyChanged}/>
               <span style={{color:'red'}}>{companyError}</span><br></br>

               <label htmlFor='salary'>Salary &nbsp;</label>
               <input type='number' id='salary' value={salary} onChange={salaryChanged}/>
               
               <select id='salaryType' onChange={salaryTypeChanged}>
                   <option value='Y'>per annum</option>
                   <option value='M'>per month</option>
                </select>
                <span style={{color:'red'}}>{salaryError}</span><br></br>

               <button type='button' onClick={addHandler}>Add</button>
               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
               <button type='button' onClick={props.cancelAction}>Cancel</button>
           </form>
       </div>
   )
   else if(displayWhat==="addMoreSection") return(
       <div>
           <h3>Add More?</h3>
           <button type='button' onClick={addAnother}>Yes</button>&nbsp;&nbsp;&nbsp;&nbsp;
           <button type='button' onClick={props.cancelAction}>No</button>
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
const StudentList=(props)=>{
    return(
       <div>
           {
               props.students.map((student)=>{
                   return(
                       <StudentComponent key={student.id} student={student} onEdit={props.onEdit} onDelete={props.onDelete} />
                   )
               })
           }
       </div>
   )
}
const StudentComponent=(props)=>{
    const iconSelected=(ev)=>{
        let operation=ev.currentTarget.id.substring(0,1);
        let studentId=ev.currentTarget.id.substring(1);
        if(operation=='D')
        {
            //alert(`Student with id ${studentId} is deleted.`);
            props.onDelete(studentId);
        }
        if(operation=='E')
        {
            //alert(`Student with id ${studentId} is edited.`);
            props.onEdit(studentId);
        }
    }
   return(
       <div>
           <span>Name: <b>{props.student.name}</b><br /></span>
           <span>Company: <b>{props.student.company}</b><br /></span>
           <span>Salary: <b>{props.student.salary}</b><br /></span>
           <span>Job Type: <b>{props.student.placementType}</b><br /></span>
           <FontAwesomeIcon icon={faEdit} style={{"cursor":"pointer"}} id={"E"+props.student.id} onClick={iconSelected} />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<FontAwesomeIcon icon={faTrash} style={{"cursor":"pointer"}} id={"D"+props.student.id} onClick={iconSelected} />
           <hr />
           <br></br>
       </div>
   )
}
const DeleteStudentComponent=(props)=>{
    const [displayWhat,setDisplayWhat]=React.useState("formSection");
    const deleteHandler=()=>{
        setDisplayWhat("processing");
        deletePlacement(props.selectedStudent.id).then((responseJSON)=>{
            if(responseJSON.success==true)
            {
                props.deleteStudentDetails(props.selectedStudent);
                setDisplayWhat("confirmation");
            }
        });
    }
    if(displayWhat==="processing") return(
        <div>
            <img src={loading}></img>
        </div>
    )
    else if(displayWhat=="confirmation")return(
        <div>
            <h4>Student Deleted</h4>
            <button type='button' onClick={props.cancelAction}>Ok</button>
        </div>
    )
    else if(displayWhat=="formSection") return(
        <div>
            <h2>Delete Placement Entry</h2>
            <span>Name: <b>{props.selectedStudent.name}</b><br /></span>
            <span>Company: <b>{props.selectedStudent.company}</b><br /></span>
            <span>Salary: <b>{props.selectedStudent.salary}</b><br /></span>
            <span>Job Type: <b>{props.selectedStudent.placementType}</b><br /></span>
            <button type='button' onClick={deleteHandler}>Delete</button>&nbsp;&nbsp;&nbsp;&nbsp;
            <button type='button' onClick={props.cancelAction}>Cancel</button>
        </div>
    )
}
const EditStudentComponent=(props)=>{
    const [displayWhat,setDisplayWhat]=React.useState("formSection");
    const [id]=React.useState(props.selectedStudent.id);
    const [name,setName]=React.useState(props.selectedStudent.name);
    const [nameError,setNameError]=React.useState("");

    const [company,setCompany]=React.useState(props.selectedStudent.company);
    const [companyError,setCompanyError]=React.useState("");
    //alert(props.selectedStudent.salaryType);
    const [salary,setSalary]=React.useState("");
    //alert(salary);
    const [salaryError,setSalaryError]=React.useState("");

    const [salaryType,setSalaryType]=React.useState(props.selectedStudent.salaryType);
    
    const [fullTimeChecked,setFullTimeChecked]=React.useState("");

    const [internshipChecked,setInternshipChecked]=React.useState("");
    const [placementType,setPlacementType]=React.useState(props.selectedStudent.placementType);
    const [formError,setFormError]=React.useState("");


    React.useEffect(()=>{
        if(props.selectedStudent.placementType[0]=='F') setFullTimeChecked("checked");
        if(props.selectedStudent.placementType[0]=='I') setInternshipChecked("checked");
        let sal="";
        for(let i=0;i<props.selectedStudent.salary.length;i++)
        {
            if(props.selectedStudent.salary[i]=='/' || props.selectedStudent.salary[i]==' ')break;
            sal+=props.selectedStudent.salary[i];
        }
        if(props.selectedStudent.salaryType=='Y')sal=parseInt(sal)*100000;
        setSalary(sal);
    },[]);


    const nameChanged=(ev)=>{
        setName(ev.target.value);
    }
    const companyChanged=(ev)=>{
        setCompany(ev.target.value);
    }
    const salaryChanged=(ev)=>{
        setSalary(ev.target.value);
    }
    const salaryTypeChanged=(ev)=>{
        setSalaryType(ev.target.value);
    }
    const placementTypeChanged=(ev)=>{
        if(ev.target.value==="F" && ev.target.checked)
        {
            setPlacementType("F");
            setInternshipChecked("");
            setFullTimeChecked("checked");
        }
        if(ev.target.value==="I" && ev.target.checked)
        {
            setPlacementType("I");
            setInternshipChecked("checked");
            setFullTimeChecked("");
        }
    }
    const clearAllErrors=()=>{
        setCompanyError("");
        setNameError("");
        setSalaryError("");
        setFormError("");
    }
    const editHandler=()=>{
        clearAllErrors();
        var hasErrors=false;
        if(name==="")
        {
            setNameError(" * ");
            hasErrors=true;
        }
        if(company==="")
        {
            setCompanyError(" * ");
            hasErrors=true;
        }
        if(salary=="" || salary<=0)
        {
            setSalaryError(" * ");
            hasErrors=true;
        }
        if(hasErrors) return;
        //alert(id+","+name+","+company+","+salary+","+salaryType+","+placementType);
        var student={
            "id":id,
            "name":name,
            "salary":salary,
            "company":company,
            "salaryType":salaryType,
            "placementType":placementType
        }
        setDisplayWhat("processing")
        editPlacement(student).then((responseJSON)=>{
            if(responseJSON.success==true)
            {
                props.editStudentDetails(student);
                setDisplayWhat("confirmation");
            }
            else
            {
                setFormError(responseJSON.error);
            }
        });
    }
    if(displayWhat==="processing") return(
        <div>
            <img src={loading}></img>
        </div>
    )
    if (displayWhat==="formSection")return(
       <div>
           <form>
               <span style={{color:'red'}}>{formError}</span><br></br>
               <label htmlFor='id'>ID: <b>{id}</b></label><br></br>

               <label htmlFor='name'>Name &nbsp;</label>
               <input type='text' id='name' value={name} onChange={nameChanged}/>
               <span style={{color:'red'}}>{nameError}</span><br></br>

               <label htmlFor='placementType'>Placement Type &nbsp;</label>
               <input type='radio' id='fullTime' name='placementType' checked={fullTimeChecked} value='F' onChange={placementTypeChanged} />Full Time &nbsp;&nbsp;&nbsp;
               <input type='radio' id='internship' name='placementType' checked={internshipChecked} value='I' onChange={placementTypeChanged} />Internship<br></br>

               <label htmlFor='company'>Company &nbsp;</label>
               <input type='text' id='company' value={company} onChange={companyChanged}/>
               <span style={{color:'red'}}>{companyError}</span><br></br>

               <label htmlFor='salary'>Salary &nbsp;</label>
               <input type='number' id='salary' value={salary} onChange={salaryChanged}/>
               
               <select id='salaryType' onChange={salaryTypeChanged} value={salaryType}>
                   <option value='Y'>per annum</option>
                   <option value='M'>per month</option>
                </select>
                <span style={{color:'red'}}>{salaryError}</span><br></br>

               <button type='button' onClick={editHandler}>Update</button>
               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
               <button type='button' onClick={props.cancelAction}>Cancel</button>
           </form>
       </div>
   )
   else if(displayWhat=="confirmation")return(
    <div>
        <h4>Student Details Edited</h4>
        <button type='button' onClick={props.cancelAction}>Ok</button>
    </div>
)
}
export default App;