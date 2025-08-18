import { useEffect, useState } from "react";

import type { ListItem } from "../types";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineEdit, MdOutlineCheck } from "react-icons/md";
import classes from "./TodoListItem.module.css";

type TodoListItemProps = {
    listItem: ListItem;
    deleteItemHandler: (id: string) => void;
    handleCheckboxChange: (item: ListItem) => void;
    editItemHandler: (description: string, item: ListItem) => void;
};

const TodoListItem = ({
    listItem,
    deleteItemHandler,
    handleCheckboxChange,
    editItemHandler,
}: TodoListItemProps) => {
    const [description, setDescription] = useState(listItem.description);
    const [isEditing, setIsEditing] = useState(false);

    const descriptionChangeHandler = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setDescription(event.target.value);
    };

    const toggleEditHandler = () => {
        setIsEditing((prev) => !prev);
    };

    useEffect(() => {
        if (!isEditing) {
            editItemHandler(description, listItem);
        }
    }, [isEditing]);

    return (
        <div className={classes.listItemContainer}>
            <input
                type="checkbox"
                checked={listItem.isCompleted}
                onChange={() => handleCheckboxChange(listItem)}
            />
            {isEditing ? (
                <input
                    type="text"
                    name="description"
                    value={description}
                    onChange={descriptionChangeHandler}
                />
            ) : (
                <p>{listItem.description}</p>
            )}
            {
                <button onClick={toggleEditHandler}>
                    {isEditing ? <MdOutlineCheck /> : <MdOutlineEdit />}
                </button>
            }
            <button onClick={() => deleteItemHandler(listItem.id)}>
                <RxCross2 />
            </button>
        </div>
    );
};

export default TodoListItem;
