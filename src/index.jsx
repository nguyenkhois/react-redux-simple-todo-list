import React, { Component } from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';

import css from './styles.css';
import { TodoList, DoneList } from './list-render';

/**
 * STEP 0 - STRUCTURES
 * 1/ The main STATE object that is an object array
 * let state = [{task1}, {task2}, {task3}, {taskn}];
 * 
 * 2/ The ACTION object must has @type property
 * let action = {
 *      type: 'YOUR_TYPE',
 *      task: { id: <task_id>,
 *              description: <task_description>,
 *              isDone: <task_status:true/false> }
 * }
 * 
 * 3/ A task is an object that is an action object property
 * let task = { id: <task_id>,
 *              description: <task_description>,
 *              isDone: <task_status:true/false> }
 */


/**
 * STEP 1 - Creating reducer
 * Input: @state, @action 
 * Output: a new @state
 * Tip! View again step 0 to know about @state and @action structures
 */
export let userReducer = (state, action) => {
    // state === undefined ? state = [] : null; // For testing purpose

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
 * View more about createStore() here:
 * https://redux.js.org/api/createstore
 * Tip! View again step 0 to know about @state structure
 */
const preloadedState = []; // Initial main state value (Redux state)
const store = createStore(userReducer, preloadedState);

/**
 * STEP 3 - Creating actions (Redux dispatchs)
 * View again step 0 to know about @action structure
 * An @action must has @type
 * Tip! View again step 0 to know about @action structure
 */
const actionAddTask = (item) => ({ type: 'ADD_TASK', task: item });
const actionRemoveTask = (item) => ({ type: 'REMOVE_TASK', task: item });
const actionChecked = (item) => ({ type: 'CHECKED', task: item });
const actionRemoveCompleted = () => ({ type: 'REMOVE_COMPLETED' });

/**
 * STEP 4A - Mapping all actions (Redux dispatchs) to React props
 */
const mapDispatchToProps = {
    actionAddTask,
    actionRemoveTask,
    actionChecked,
    actionRemoveCompleted
};

/**
 * STEP 4B - Mapping Redux state to React props
 * Redux state is @state that is default name
 * React prop is @todos that you name it
 */
const mapStateToProps = (state) => {
    return {
        todos: state
    };
};

/**
 * STEP 4C - React class component
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
            this.props.actionAddTask(newItem); // Using Redux dispatch that created on step 3

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
                {/* Using for testing purpose - Main state */}
                { console.log('this.props.todos', this.props.todos) }

                <p>To-Do list</p>
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
 * STEP 5 - Creating connection to React class component
 * Creating connection between Redux state and dispatchs with React class component
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
