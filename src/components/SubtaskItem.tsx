import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { FaCircleCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineEdit, MdOutlineCheck } from "react-icons/md";

import type { ListItem, Subtask } from "../types";
import classes from "./SubtaskItem.module.css";

type SubtaskItemProps = {
    listItem: ListItem;
    subtask: Subtask;
    deleteSubtaskHandler: (itemId: string, subtaskId: string) => void;
    handleSubtaskCheckboxChange: (item: ListItem, subtask: Subtask) => void;
    editSubtaskItemHandler: (
        description: string,
        item: ListItem,
        subtask: Subtask
    ) => void;
    addSubtaskHandler: (subtask: Subtask, item: ListItem) => void;
};

const SubtaskItem = ({
    listItem,
    subtask,
    deleteSubtaskHandler,
    handleSubtaskCheckboxChange,
    editSubtaskItemHandler,
}: SubtaskItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [subtaskDescription, setSubtaskDescription] = useState(
        subtask.description
    );
    const inputRef = useRef<HTMLInputElement>(null);

    const subtaskDescriptionChangeHandler = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSubtaskDescription(event.target.value);
    };

    const toggleEditHandler = () => {
        if (isEditing) {
            editSubtaskItemHandler(subtaskDescription, listItem, subtask);
        }
        setIsEditing((prev) => !prev);
    };

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    return (
        <div className={classes.subtaskContainer}>
            <div>
                {subtask.isCompleted ? (
                    <FaCircleCheck
                        className={classes.checkboxIcon}
                        onClick={() =>
                            handleSubtaskCheckboxChange(listItem, subtask)
                        }
                    />
                ) : (
                    <div
                        className={`${classes.checkbox} ${
                            subtask.isCompleted ? classes.active : ""
                        }`}
                        onClick={() =>
                            handleSubtaskCheckboxChange(listItem, subtask)
                        }
                    ></div>
                )}
                <input
                    type="checkbox"
                    checked={subtask.isCompleted}
                    onChange={() =>
                        handleSubtaskCheckboxChange(listItem, subtask)
                    }
                    hidden
                />
            </div>
            <div className={classes.subtaskWrapper}>
                <div>
                    {isEditing ? (
                        <input
                            ref={inputRef}
                            className={classes.editInput}
                            type="text"
                            name="subtaskDescription"
                            value={subtaskDescription}
                            onChange={subtaskDescriptionChangeHandler}
                        />
                    ) : (
                        <span className={classes.textWrapper}>
                            <motion.span
                                className={classes.itemDescription}
                                animate={{
                                    color: listItem.isCompleted
                                        ? "#aaa"
                                        : "#5c5c5c",
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                {subtask.description}
                            </motion.span>
                            <motion.span
                                className={classes.strikeLine}
                                initial={false}
                                animate={{
                                    width:
                                        subtask.isCompleted ||
                                        listItem.isCompleted
                                            ? "100%"
                                            : "0%",
                                }}
                                transition={{ duration: 0.3 }}
                            />
                        </span>
                    )}
                </div>
                <div className={classes.buttonsWrapper}>
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

                    <button
                        onClick={() =>
                            deleteSubtaskHandler(listItem.id, subtask.id)
                        }
                    >
                        <RxCross2
                            className={`${classes.otherIcons} ${classes.crossIcon}`}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubtaskItem;
