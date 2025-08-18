import { useEffect, useState } from "react";

import AddItemForm from "./AddItemForm";
import TodoListItem from "./TodoListItem";
import type { ListItem } from "../types";
import listImg from "../assets/list.svg";
import classes from "./TodoList.module.css";

const TodoList = () => {
    const [todoList, setTodoList] = useState<ListItem[]>([]);
    const [hasLoaded, setHasLoaded] = useState(false);

    const addItemHandler = (item: ListItem) => {
        setTodoList([...todoList, item]);
    };

    const deleteItemHandler = (id: string) => {
        setTodoList(todoList.filter((item) => item.id !== id));
    };

    const handleCheckboxChange = (item: ListItem) => {
        const updatedList = todoList.map((element) => {
            if (element.id === item.id) {
                return { ...element, isCompleted: !item.isCompleted };
            }
            return element;
        });
        setTodoList(updatedList);
    };

    const editItemHandler = (description: string, item: ListItem) => {
        const updatedList = todoList.map((element) => {
            if (element.id === item.id) {
                return { ...element, description };
            }
            return element;
        });
        setTodoList(updatedList);
    };

    useEffect(() => {
        const storedList = localStorage.getItem("todoList");
        if (storedList) {
            setTodoList(JSON.parse(storedList));
        }
        setHasLoaded(true);
    }, []);

    useEffect(() => {
        if (hasLoaded) {
            localStorage.setItem("todoList", JSON.stringify(todoList));
        }
    }, [todoList, hasLoaded]);

    return (
        <div className={classes.todoListContainer}>
            <div className={classes.todoListWrapper}>
                <div className={classes.todoTitle}>
                    <h1>To-Do List</h1>
                    <img src={listImg} alt="To-do list" />
                </div>
                <div className={classes.addItemForm}>
                    <AddItemForm addItemHandler={addItemHandler} />
                </div>
                <div className={classes.itemList}>
                    {todoList.map((listItem) => {
                        return (
                            <TodoListItem
                                key={listItem.id}
                                listItem={listItem}
                                deleteItemHandler={deleteItemHandler}
                                handleCheckboxChange={handleCheckboxChange}
                                editItemHandler={editItemHandler}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default TodoList;
