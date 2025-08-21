import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "motion/react";

import { FaRegCalendarAlt, FaChevronDown } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineEdit, MdOutlineCheck } from "react-icons/md";
import { FaCircleCheck } from "react-icons/fa6";

import type { ListItem, Subtask } from "../types";
import SubtaskItem from "./SubtaskItem";
import classes from "./TodoListItem.module.css";

type TodoListItemProps = {
    listItem: ListItem;
    deleteItemHandler: (id: string) => void;
    deleteSubtaskHandler: (itemId: string, subtaskId: string) => void;
    handleCheckboxChange: (item: ListItem) => void;
    handleSubtaskCheckboxChange: (item: ListItem, subtask: Subtask) => void;
    editItemHandler: (
        description: string,
        date: string | null,
        item: ListItem
    ) => void;
    editSubtaskItemHandler: (
        description: string,
        item: ListItem,
        subtast: Subtask
    ) => void;
    addSubtaskHandler: (subtask: Subtask, item: ListItem) => void;
};

const TodoListItem = ({
    listItem,
    deleteItemHandler,
    deleteSubtaskHandler,
    handleCheckboxChange,
    handleSubtaskCheckboxChange,
    editItemHandler,
    editSubtaskItemHandler,
    addSubtaskHandler,
}: TodoListItemProps) => {
    const [description, setDescription] = useState(listItem.description);
    const [subtaskDescription, setSubtaskDescription] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [showSubtasks, setShowSubtasks] = useState(false);
    const [newDueDate, setNewDueDate] = useState<Date | null>(
        listItem.dueDate ? new Date(listItem.dueDate) : null
    );
    const inputRef = useRef<HTMLInputElement>(null);

    const descriptionChangeHandler = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setDescription(event.target.value);
    };

    const subtaskDescriptionChangeHandler = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSubtaskDescription(event.target.value);
    };

    const toggleEditHandler = () => {
        if (isEditing) {
            editItemHandler(
                description,
                newDueDate?.toISOString() ?? null,
                listItem
            );
        }

        setIsEditing((prev) => !prev);
    };

    const toggleIsClicked = () => {
        if (isClicked && subtaskDescription.trim().length > 0) {
            addSubtaskHandler(
                {
                    id: uuidv4(),
                    description: subtaskDescription,
                    isCompleted: false,
                },
                listItem
            );
        }
        setSubtaskDescription("");

        setIsClicked((prev) => !prev);
    };

    const toggleSubtasks = () => {
        setShowSubtasks((prev) => !prev);
    };

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    useEffect(() => {
        if (listItem.isCompleted) {
            setIsEditing(false);
        }
    }, [listItem.isCompleted]);

    console.log(listItem);

    return (
        <>
            <div className={classes.listItemContainer}>
                <div>
                    {listItem.isCompleted ? (
                        <FaCircleCheck
                            className={classes.checkboxIcon}
                            onClick={() => handleCheckboxChange(listItem)}
                        />
                    ) : (
                        <div
                            className={`${classes.checkbox} ${
                                listItem.isCompleted ? classes.active : ""
                            }`}
                            onClick={() => handleCheckboxChange(listItem)}
                        ></div>
                    )}
                    <input
                        type="checkbox"
                        checked={listItem.isCompleted}
                        onChange={() => handleCheckboxChange(listItem)}
                        hidden
                    />
                </div>
                <div className={classes.listItemWrapper}>
                    <div className={classes.descriptionRow}>
                        {isEditing ? (
                            <input
                                ref={inputRef}
                                className={classes.editInput}
                                type="text"
                                name="description"
                                value={description}
                                onChange={descriptionChangeHandler}
                            />
                        ) : (
                            <span
                                className={classes.textWrapper}
                                onClick={toggleIsClicked}
                            >
                                <span
                                    className={`${classes.itemDescription} ${
                                        listItem.isCompleted
                                            ? classes.finished
                                            : ""
                                    }`}
                                >
                                    {listItem.description}
                                </span>
                                <motion.span
                                    className={classes.strikeLine}
                                    initial={false}
                                    animate={{
                                        width: listItem.isCompleted
                                            ? "100%"
                                            : "0%",
                                    }}
                                    transition={{ duration: 0.3 }}
                                />
                            </span>
                        )}
                        {listItem.subtasks.length > 0 && (
                            <button
                                className={classes.dropdownButton}
                                onClick={toggleSubtasks}
                                aria-label="Toggle subtasks"
                            >
                                <motion.div
                                    animate={{
                                        rotate: showSubtasks ? 180 : 360,
                                    }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <FaChevronDown
                                        className={classes.dropdownIcon}
                                    />
                                </motion.div>
                            </button>
                        )}
                    </div>

                    <div className={classes.buttonsWrapper}>
                        {isEditing && (
                            <div className={classes.dateWrapper}>
                                <DatePicker
                                    selected={newDueDate}
                                    onChange={(date) => setNewDueDate(date)}
                                    customInput={
                                        <button
                                            type="button"
                                            className={classes.dateButton}
                                        >
                                            <FaRegCalendarAlt
                                                className={
                                                    classes.dateButtonIcon
                                                }
                                            />
                                        </button>
                                    }
                                />
                            </div>
                        )}
                        {!listItem.isCompleted && (
                            <button onClick={toggleEditHandler}>
                                {isEditing ? (
                                    <MdOutlineCheck
                                        className={classes.otherIcons}
                                    />
                                ) : (
                                    <MdOutlineEdit
                                        className={classes.otherIcons}
                                    />
                                )}
                            </button>
                        )}

                        <button onClick={() => deleteItemHandler(listItem.id)}>
                            <RxCross2
                                className={`${classes.otherIcons} ${classes.crossIcon}`}
                            />
                        </button>
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {showSubtasks && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className={classes.subtasksWrapper}
                    >
                        {listItem.subtasks?.map((subtask) => (
                            <SubtaskItem
                                key={subtask.id}
                                listItem={listItem}
                                subtask={subtask}
                                deleteSubtaskHandler={deleteSubtaskHandler}
                                handleSubtaskCheckboxChange={
                                    handleSubtaskCheckboxChange
                                }
                                editSubtaskItemHandler={editSubtaskItemHandler}
                                addSubtaskHandler={addSubtaskHandler}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {isClicked && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className={classes.addSubtaskContainer}
                    >
                        <div className={classes.addSubtaskWrapper}>
                            <input
                                type="text"
                                placeholder="Add Subtask..."
                                value={subtaskDescription}
                                onChange={subtaskDescriptionChangeHandler}
                            />
                            <button onClick={toggleIsClicked}>
                                <MdOutlineCheck
                                    className={classes.otherIcons}
                                />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default TodoListItem;
