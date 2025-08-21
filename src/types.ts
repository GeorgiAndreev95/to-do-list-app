export type ListItem = {
    id: string;
    description: string;
    isCompleted: boolean;
    dueDate: string | null;
    subtasks: Subtask[];
};

export type Subtask = {
    id: string;
    description: string;
    isCompleted: boolean;
};
