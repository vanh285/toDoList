import { useEffect, useState } from 'react';
import './Task.css';

const Task = ({ task, id, index, sortTasks }) => {
  // useState
  const [tasks, setTasks] = useState([]);
  // eslint-disable-next-line
  const [checkboxes, setCheckboxes] = useState([]);
  const [values, setValues] = useState({
    title: task.title,
    description: task.description,
    due: task.due,
    priority: task.priority,
  });
  const [isDetailChecked, setIsDetailChecked] = useState(false);
  const refreshPage = () => {
    window.location.reload(false);
  };
  const getTasks = async () => {
    const allTasks = await JSON.parse(localStorage.getItem('tasks'));
    setTasks(allTasks);
  };

  // useEffect
  useEffect(() => {
    if (localStorage.getItem('tasks')) {
      getTasks();
    }
    if (localStorage.getItem('checkboxes')) {
      const allCheckboxes = JSON.parse(localStorage.getItem('checkboxes'));
      setCheckboxes(allCheckboxes);
      for (let i = 0; i < allCheckboxes.length; i++) {
        if (document.getElementById(allCheckboxes[i].id)) {
          document.getElementById(allCheckboxes[i].id).checked =
            allCheckboxes[i].isChecked;
        }
      }
    }
  }, []);

  // handleFunctions
  // toggle update form
  const handleDetails = (e) => {
    e.preventDefault();
    setIsDetailChecked(!isDetailChecked);
  };
  // update field values in update form
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  // update the task
  const handleUpdate = (e) => {
    e.preventDefault();
    tasks[index].values = values;
    const newTasks = tasks;
    if (values.title) {
      localStorage.setItem('tasks', JSON.stringify(newTasks));
    }
    sortTasks();
  };
  // remove 1 task
  const handleRemove = (e) => {
    e.preventDefault();
    // remove task from localStorage
    const newTasks = JSON.parse(localStorage.getItem('tasks')).filter(
      (item) => {
        return item.id !== id;
      }
    );
    setTasks(newTasks);
    localStorage.setItem('tasks', JSON.stringify(newTasks));
    // remove status of the box from localStorage
    const newCheckboxes = JSON.parse(localStorage.getItem('checkboxes')).filter(
      (item) => item.id !== id
    );
    setCheckboxes(newCheckboxes);
    localStorage.setItem('checkboxes', JSON.stringify(newCheckboxes));
    refreshPage();
  };
  // check a box, send to localStorage in order to show the bulk action bar
  const handleCheck = () => {
    const isChecked = document.getElementById(id).checked;
    const localCheckbox = JSON.parse(localStorage.getItem('checkboxes'));
    const newCheckboxes = localCheckbox.filter((item) => {
      if (item.id === id) {
        item.isChecked = isChecked;
      }
      return item;
    });
    let overall = false;
    for (let i = 0; i < localCheckbox.length; i++) {
      overall = overall || localCheckbox[i].isChecked;
    }
    localStorage.setItem('overall', JSON.stringify(overall));
    localStorage.setItem('checkboxes', JSON.stringify(newCheckboxes));
    refreshPage();
  };
  return (
    <div className='taskContainer'>
      <div className='task'>
        <div className='taskInfo'>
          <input
            type='checkbox'
            name='taskCheckboxes'
            onChange={() => {
              handleCheck();
            }}
            id={id}
          />
          <h4>{task.title}</h4>
        </div>
        <div className='taskOptions'>
          <button className='btn details' onClick={(e) => handleDetails(e)}>
            Details
          </button>
          <button className='btn remove' onClick={(e) => handleRemove(e)}>
            Remove
          </button>
        </div>
      </div>
      {isDetailChecked && (
        <div className='taskUpdate'>
          <form
            className='newTaskDetails'
            onSubmit={(e) => {
              handleUpdate(e);
            }}
          >
            <div className='title'>
              <input
                type='text'
                placeholder='Change title...'
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
                  min={`${new Date().getFullYear()}-${
                    new Date().getMonth() + 1 < 10
                      ? '0' + (new Date().getMonth() + 1)
                      : new Date().getMonth() + 1
                  }-${new Date().getDate()}`}
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
              Update
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Task;
