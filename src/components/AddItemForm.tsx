import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import classes from "./AddItemForm.module.css";
import type { ListItem } from "../types";

type AddItemFormProps = {
    addItemHandler: (listItem: ListItem) => void;
};

const AddItemForm = ({ addItemHandler }: AddItemFormProps) => {
    const [description, setDescription] = useState("");
    const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        addItemHandler({ id: uuidv4(), description, isCompleted: false });
        setDescription("");
    };

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
    };

    return (
        <form className={classes.inputForm} onSubmit={onSubmitHandler}>
            <input
                className={classes.inputField}
                type="text"
                name="description"
                required
                placeholder="Add Task Here"
                value={description}
                onChange={onInputChange}
                autoComplete="off"
            />
            <button className={classes.addButton} type="submit">
                Add
            </button>
        </form>
    );
};

export default AddItemForm;
