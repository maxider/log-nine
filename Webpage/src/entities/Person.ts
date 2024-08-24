type Person = {
    id: number;
    boardId: number;
    name: string;
}

export const UndefinedPerson: Person = {
    id: -1,
    boardId: -1,
    name: "Undefined",
}

export default Person;