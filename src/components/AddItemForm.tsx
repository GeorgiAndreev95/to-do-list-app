import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";

import classes from "./AddItemForm.module.css";
import type { ListItem } from "../types";

type AddItemFormProps = {
    addItemHandler: (listItem: ListItem) => void;
};

const AddItemForm = ({ addItemHandler }: AddItemFormProps) => {
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState<Date | null>(null);

    const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        addItemHandler({
            id: uuidv4(),
            description,
            isCompleted: false,
            dueDate: dueDate?.toISOString() ?? null,
            subtasks: [],
        });
        setDescription("");
        setDueDate(null);
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
                placeholder="Add New Task"
                value={description}
                onChange={onInputChange}
                autoComplete="off"
            />

            <div className={classes.dateWrapper}>
                <DatePicker
                    selected={dueDate}
                    onChange={(date) => setDueDate(date)}
                    minDate={new Date()}
                    customInput={
                        <button type="button" className={classes.dateButton}>
                            <FaRegCalendarAlt
                                className={classes.dateButtonIcon}
                            />
                        </button>
                    }
                />
            </div>
            <button className={classes.addButton} type="submit">
                Add
            </button>
        </form>
    );
};

export default AddItemForm;
