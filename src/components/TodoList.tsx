import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

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

    const isToday = (date: Date) => {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
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
                    <AnimatePresence>
                        {sortedGroups.map(([date, items]) => (
                            <motion.div
                                key={date}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className={classes.dateGroup}
                            >
                                <h3 className={classes.date}>
                                    {date !== "No Due Date"
                                        ? isToday(new Date(date))
                                            ? "Today"
                                            : new Date(
                                                  date
                                              ).toLocaleDateString()
                                        : "No Due Date"}
                                </h3>
                                <AnimatePresence>
                                    {items.map((listItem) => (
                                        <motion.div
                                            key={listItem.id}
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <TodoListItem
                                                key={listItem.id}
                                                listItem={listItem}
                                                deleteItemHandler={
                                                    deleteItemHandler
                                                }
                                                deleteSubtaskHandler={
                                                    deleteSubtaskHandler
                                                }
                                                handleCheckboxChange={
                                                    handleCheckboxChange
                                                }
                                                handleSubtaskCheckboxChange={
                                                    handleSubtaskCheckboxChange
                                                }
                                                editItemHandler={
                                                    editItemHandler
                                                }
                                                editSubtaskItemHandler={
                                                    editSubtaskItemHandler
                                                }
                                                addSubtaskHandler={
                                                    addSubtaskHandler
                                                }
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default TodoList;
