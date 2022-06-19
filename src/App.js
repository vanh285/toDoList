import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import Task from './Components/Task';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  // usestate
  const [tasks, setTasks] = useState([]);
  const [show, setShow] = useState(false);
  const [searchedTask, setSearchedTask] = useState('');
  const [checkboxes, setCheckboxes] = useState([]);
  const [values, setValues] = useState({
    title: '',
    description: '',
    due: `${new Date().getFullYear()}-${
      new Date().getMonth() + 1 < 10
        ? '0' + (new Date().getMonth() + 1)
        : new Date().getMonth() + 1
    }-${new Date().getDate()}`,
    priority: 'Normal',
  });

  // functions,vars, config
  const refreshPage = () => {
    window.location.reload(false);
  };
  const filteredTasks = tasks.filter((task) => {
    return task.values.title.toLowerCase().includes(searchedTask.toLowerCase());
  });
  const sortTasks = () => {
    const arr = JSON.parse(localStorage.getItem('tasks'));
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        const arr1 = arr[i].values.due;
        const arr2 = arr[j].values.due;
        if (arr2 < arr1) {
          let c = arr[i];
          arr[i] = arr[j];
          arr[j] = c;
        }
      }
    }
    for (let i = 0; i < arr.length; i++) {}
    localStorage.setItem('tasks', JSON.stringify(arr));
    refreshPage();
  };
  const showCurrentTasks = async () => {
    setTasks(await JSON.parse(localStorage.getItem('tasks')));
  };
  const showCurrentCheckboxes = async () => {
    setCheckboxes(await JSON.parse(localStorage.getItem('checkboxes')));
  };
  const openBulkAction = useCallback(async () => {
    setShow(await JSON.parse(localStorage.getItem('overall')));
  }, []);
  const toastConfig = {
    position: 'bottom-right',
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: 'light',
  };
  // useEffect
  useEffect(() => {
    if (localStorage.getItem('tasks')) {
      showCurrentTasks();
    }
    if (localStorage.getItem('checkboxes')) {
      showCurrentCheckboxes();
    }
    if (localStorage.getItem('overall')) {
      openBulkAction();
    }
  }, [openBulkAction]);

  // handleFunctions
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!values.title) {
      console.log('title Error');
      toast.error('Title cannot be empty!', toastConfig);
    }
    if (values.title) {
      const id = new Date().getTime().toString();
      const isChecked = false;
      setCheckboxes([...checkboxes, { isChecked, id }]);
      setTasks([...tasks, { values, id }]);
      localStorage.setItem(
        'tasks',
        JSON.stringify([
          ...tasks,
          { values, id: new Date().getTime().toString() },
        ])
      );
      localStorage.setItem(
        'checkboxes',
        JSON.stringify([...checkboxes, { isChecked, id }])
      );
      setValues({
        title: '',
        description: '',
        due: `${new Date().getFullYear()}-${
          new Date().getMonth() + 1 < 10
            ? '0' + (new Date().getMonth() + 1)
            : new Date().getMonth() + 1
        }-${new Date().getDate()}`,
        priority: 'Normal',
      });
      sortTasks();
    }
  };
  // handle functions
  // update field values into values object
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  // updates search bar value
  const handleSearch = (e) => {
    setSearchedTask(e.target.value);
  };
  // removes selected tasks, bulk removal
  const handleRemoveSelected = (e) => {
    e.preventDefault();
    const removeItem = (id) => {
      // remove task from localStorage
      const newTasks = JSON.parse(localStorage.getItem('tasks')).filter(
        (item) => {
          return item.id !== id;
        }
      );
      setTasks(newTasks);
      localStorage.setItem('tasks', JSON.stringify(newTasks));
      // remove status of the box from localStorage
      const newCheckboxes = JSON.parse(
        localStorage.getItem('checkboxes')
      ).filter((item) => item.id !== id);
      setCheckboxes(newCheckboxes);
      localStorage.setItem('checkboxes', JSON.stringify(newCheckboxes));
    };
    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].isChecked) {
        removeItem(checkboxes[i].id);
      }
    }
  };
  return (
    <>
      <div className='toDoPage'>
        <div className='newTask'>
          <h1>New Task</h1>
          <form
            className='newTaskDetails'
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            <div className='title'>
              <input
                type='text'
                placeholder='Add new task ...'
                name='title'
                onChange={(e) => handleChange(e)}
                value={values.title}
              />
            </div>
            <div className='description'>
              <h4>Description</h4>
              <textarea
                name='description'
                cols='30'
                rows='10'
                onChange={(e) => handleChange(e)}
                value={values.description}
              ></textarea>
            </div>
            <div className='dueAndPriority'>
              <div className='dueDate'>
                <h4>Due Date</h4>
                <input
                  type='date'
                  name='due'
                  value={values.due}
                  min={values.due}
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className='priority'>
                <h4>Priority</h4>
                <select
                  name='priority'
                  value={values.priority}
                  onChange={(e) => handleChange(e)}
                >
                  <option value='Normal'>Normal</option>
                  <option value='High'>High</option>
                  <option value='Low'>Low</option>
                </select>
              </div>
            </div>
            <button type='submit' className='addSubmit'>
              Add
            </button>
          </form>
        </div>
        <div className='toDoList'>
          <h1>To Do List</h1>
          <div className='toDoListDetails'>
            <div className='search'>
              <input
                className='searchBar'
                type='text'
                placeholder='Search ...'
                onChange={handleSearch}
              />
            </div>
            <div className='tasks'>
              {filteredTasks.map((task, index) => {
                return (
                  <Task
                    task={task.values}
                    key={index}
                    id={task.id}
                    index={index}
                    sortTasks={sortTasks}
                  />
                );
              })}
            </div>
          </div>
          {show && (
            <div className='bulkAction'>
              <h3>Bulk Action: </h3>
              <div className='bulkOptions'>
                <button className='btn details'>Done</button>
                <button
                  className='btn remove'
                  onClick={(e) => handleRemoveSelected(e)}
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer></ToastContainer>
    </>
  );
}

export default App;
