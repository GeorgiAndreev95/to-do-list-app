import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { FaRegCalendarAlt } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineEdit, MdOutlineCheck } from "react-icons/md";
import { FaCircleCheck } from "react-icons/fa6";

import type { ListItem } from "../types";
import classes from "./TodoListItem.module.css";

type TodoListItemProps = {
    listItem: ListItem;
    deleteItemHandler: (id: string) => void;
    handleCheckboxChange: (item: ListItem) => void;
    editItemHandler: (
        description: string,
        date: string | null,
        item: ListItem
    ) => void;
};

const TodoListItem = ({
    listItem,
    deleteItemHandler,
    handleCheckboxChange,
    editItemHandler,
}: TodoListItemProps) => {
    const [description, setDescription] = useState(listItem.description);
    const [isEditing, setIsEditing] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [newDueDate, setNewDueDate] = useState<Date | null>(
        listItem.dueDate ? new Date(listItem.dueDate) : null
    );
    const inputRef = useRef<HTMLInputElement>(null);

    const descriptionChangeHandler = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setDescription(event.target.value);
    };

    const toggleEditHandler = () => {
        setIsEditing((prev) => !prev);
    };

    const toggleIsClicked = () => {
        setIsClicked((prev) => !prev);
    };

    useEffect(() => {
        if (!isEditing) {
            editItemHandler(
                description,
                newDueDate?.toISOString() ?? null,
                listItem
            );
        }
    }, [isEditing]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    console.log(listItem);

    return (
        <>
            <div className={classes.listItemContainer}>
                <div className={classes.listItemWrapper}>
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
                        <p
                            className={`${classes.itemDescription} ${
                                listItem.isCompleted ? classes.finished : ""
                            }`}
                            onClick={toggleIsClicked}
                        >
                            {listItem.description}
                        </p>
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
                                            className={classes.dateButtonIcon}
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
                                <MdOutlineEdit className={classes.otherIcons} />
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
            {isClicked && (
                <div className={classes.notesContainer}>
                    <input type="text" placeholder="Add note:" />
                    <button>
                        <MdOutlineCheck className={classes.otherIcons} />
                    </button>
                </div>
            )}
        </>
    );
};

export default TodoListItem;
