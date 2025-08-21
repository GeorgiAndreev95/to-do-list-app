import { useEffect, useState } from "react";

import AddItemForm from "./AddItemForm";
import TodoListItem from "./TodoListItem";
import type { ListItem, Subtask } from "../types";
import listImg from "../assets/list.svg";
import classes from "./TodoList.module.css";

const TodoList = () => {
    const [todoList, setTodoList] = useState<ListItem[]>([]);
    const [hasLoaded, setHasLoaded] = useState(false);
    const groupedTodos = todoList.reduce(
        (groups: Record<string, ListItem[]>, item) => {
            const key = item.dueDate ?? "No Due Date";
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(item);
            return groups;
        },
        {}
    );
    const sortedGroups = Object.entries(groupedTodos).sort(([a], [b]) => {
        if (a === "No Due Date") return 1;
        if (b === "No Due Date") return -1;

        return new Date(a).getTime() - new Date(b).getTime();
    });

    const addItemHandler = (item: ListItem) => {
        setTodoList([...todoList, item]);
    };

    const deleteItemHandler = (id: string) => {
        setTodoList(todoList.filter((item) => item.id !== id));
    };

    const deleteSubtaskHandler = (itemId: string, subtaskId: string) => {
        const updatedItems = todoList.map((listItem) => {
            if (listItem.id === itemId) {
                return {
                    ...listItem,
                    subtasks: listItem.subtasks.filter(
                        (item) => item.id !== subtaskId
                    ),
                };
            }
            return listItem;
        });
        setTodoList(updatedItems);
    };

    const handleCheckboxChange = (item: ListItem) => {
        const updatedList = todoList.map((element) => {
            if (element.id === item.id) {
                const newCompleted = !item.isCompleted;

                return {
                    ...element,
                    isCompleted: newCompleted,
                    subtasks: element.subtasks.map((subtask) => ({
                        ...subtask,
                        isCompleted: newCompleted,
                    })),
                };
            }

            return element;
        });
        setTodoList(updatedList);
    };

    const handleSubtaskCheckboxChange = (item: ListItem, subtask: Subtask) => {
        const updatedList = todoList.map((element) => {
            if (element.id === item.id) {
                return {
                    ...element,
                    subtasks: element.subtasks.map((subtaskElement) =>
                        subtaskElement.id === subtask.id
                            ? {
                                  ...subtaskElement,
                                  isCompleted: !subtask.isCompleted,
                              }
                            : subtaskElement
                    ),
                };
            }
            return element;
        });
        setTodoList(updatedList);
    };

    const editItemHandler = (
        description: string,
        date: string | null,
        item: ListItem
    ) => {
        const updatedList = todoList.map((element) => {
            if (element.id === item.id) {
                return { ...element, description, dueDate: date };
            }
            return element;
        });
        setTodoList(updatedList);
    };

    const editSubtaskItemHandler = (
        description: string,
        item: ListItem,
        subtask: Subtask
    ) => {
        const updatedList = todoList.map((element) => {
            if (element.id === item.id) {
                return {
                    ...element,
                    subtasks: element.subtasks.map((subtaskElement) =>
                        subtaskElement.id === subtask.id
                            ? {
                                  ...subtaskElement,
                                  description,
                              }
                            : subtaskElement
                    ),
                };
            }
            return element;
        });
        setTodoList(updatedList);
    };

    const addSubtaskHandler = (subtask: Subtask, item: ListItem) => {
        const updatedList = todoList.map((element) => {
            if (element.id === item.id) {
                return {
                    ...element,
                    subtasks: [...(element.subtasks ?? []), subtask],
                };
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
                    <div className={classes.itemList}>
                        {sortedGroups.map(([date, items]) => (
                            <div key={date} className={classes.dateGroup}>
                                {date !== "No Due Date" ? (
                                    <h3 className={classes.date}>
                                        {new Date(date).toLocaleDateString()}
                                    </h3>
                                ) : (
                                    <h3>No Due Date</h3>
                                )}
                                {items.map((listItem) => (
                                    <TodoListItem
                                        key={listItem.id}
                                        listItem={listItem}
                                        deleteItemHandler={deleteItemHandler}
                                        deleteSubtaskHandler={
                                            deleteSubtaskHandler
                                        }
                                        handleCheckboxChange={
                                            handleCheckboxChange
                                        }
                                        handleSubtaskCheckboxChange={
                                            handleSubtaskCheckboxChange
                                        }
                                        editItemHandler={editItemHandler}
                                        editSubtaskItemHandler={
                                            editSubtaskItemHandler
                                        }
                                        addSubtaskHandler={addSubtaskHandler}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TodoList;
