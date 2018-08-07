import React, { Component } from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';

import css from './styles.css';
import { TodoList, DoneList } from './list-render';

/**
 * STEP 0 - STRUCTURES
 * For the main state object that is an object array
 * let state = [{task1}, {task2}, {task3}, {taskn}];
 * 
 * For the action object
 * let action = {
 *      type: 'YOUR_TYPE',
 *      task: { id: <task_id>,
 *              description: <task_description>,
 *              isDone: <task_status:true/false> }
 * }
 * 
 * For a task (an item)
 * let task = { id: <task_id>,
 *              description: <task_description>,
 *              isDone: <task_status:true/false> }
 */


/**
 * STEP 1 - Creating reducer
 * Input: state, action 
 * Output: a new state
 */
export let userReducer = (state, action) => {
    state === undefined ? state = [] : null; // MAIN STATE

    switch (action.type){
        case 'ADD_TASK':
            return state.concat(action.task);
            break;
        case 'REMOVE_TASK':
            return state.filter((item) => item.id !== action.task.id);
            break;
        case 'CHECKED':
            const itemIndex = state.findIndex((item) => item.id === action.task.id);
            const newState = state.map((item, index) => index === itemIndex ? {...item, isDone: !item.isDone} : item);
            return newState;
            break;
        case 'REMOVE_COMPLETED':
            return state.filter((item) => !item.isDone);
            break;
        default:
            return state;
            break;
    }
};

/**
 * STEP 2 - Creating store
 */
const store = createStore(userReducer);

/**
 * STEP 3 - Creating Redux dispatchs (actions)
 * View again step 0 to understand a dispatch (action) structure
 * An action must has @type and @task
 */
const actionAddTask = (item) => ({ type: 'ADD_TASK', task: item });
const actionRemoveTask = (item) => ({ type: 'REMOVE_TASK', task: item });
const actionChecked = (item) => ({ type: 'CHECKED', task: item });
const actionRemoveCompleted = () => ({ type: 'REMOVE_COMPLETED' });

/**
 * STEP 4A - Mapping all Redux dispatchs (actions) to React props
 */
const mapDispatchToProps = {
    actionAddTask,
    actionRemoveTask,
    actionChecked,
    actionRemoveCompleted
};

/**
 * STEP 4B - Mapping Redux state to React props
 * Redux state is @state that is default
 * React prop is @todos that you name it
 */
const mapStateToProps = (state) => {
    return {
        todos: state
    };
};

/**
 * STEP 4C - Main class component
 */
export class TodoApp extends Component {
    handleEnterKey = (e) => {
        const userInput = e.target.value.trim(); // Get data from text input
        if (e.keyCode === 13 && userInput.length > 0) {
            const newItem = {
                id: Date.now(), 
                description: userInput, 
                isDone: false
            };
            this.props.actionAddTask(newItem); // Using Redux dispatch on step 3

            e.target.value = ''; // Clear text input
        }
    }

    handleCheck = (itemId, e) => {
        e.preventDefault();
        const checkedItem = { id: itemId };
        this.props.actionChecked(checkedItem);
    }

    handleRemove = (itemId, e) => {
        e.preventDefault();
        const removedItem = { id: itemId };
        this.props.actionRemoveTask(removedItem);
    }

    handleClearCompleted = (e) => {
        e.preventDefault();
        this.props.actionRemoveCompleted();
    }

    render(){
        let todoTasks = this.props.todos.filter((item) => !item.isDone);
        let doneTasks = this.props.todos.filter((item) => item.isDone);
        return(
            <div>
                {   // Using for showing the main state
                    console.log('this.props.todos', this.props.todos) 
                }

                <p>Todo list</p>
                <input onKeyDown={(e)=>this.handleEnterKey(e)}
                    type="text" minLength="1" maxLength="50" placeholder="Enter your task"/>

                <TodoList items={todoTasks} 
                    fnCheck={(itemId, e)=>this.handleCheck(itemId, e)} 
                    fnRemove={(itemId, e)=>this.handleRemove(itemId, e)}/>

                <DoneList items={doneTasks} 
                    fnCheck={(itemId, e)=>this.handleCheck(itemId, e)} 
                    fnRemove={(itemId, e)=>this.handleRemove(itemId, e)} 
                    fnClearCompleted={(e)=>this.handleClearCompleted(e)}/>
            </div>
        );        
    }
};

/**
 * STEP 5 - Creating connection to main class component
 */
export const TodoX = connect(mapStateToProps, mapDispatchToProps)(TodoApp);

/**
 * STEP 6 - Rendering
 */
render(
    <Provider store={store}>
        <TodoX/>
    </Provider>,
    document.getElementById('app')
);
