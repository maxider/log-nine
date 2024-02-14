import { Backdrop, Button, Paper, TextField } from "@mui/material";
import BackdropProps from "../props/BackdropProps";
import React from "react";

interface FieldProps {
  name: string;
  placeholder: string;
}

const Field: React.FC<FieldProps> = ({ name, placeholder }) => {
  return (
    <div className="flex flex-row justify-between w-full my-2">
      <p className="m-2">{name}:</p>
      <input
        className="text-black"
        type="text"
        name={name}
        placeholder={placeholder}
      />
    </div>
  );
};

const CreateTeamBackdrop: React.FC<BackdropProps> = ({ onClose, open }) => {
  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    console.log(formData);
  };

  return (
    <Backdrop open={open}>
      <Paper className="flex flex-col items-center p-2 w-96">
        <form method="post" onSubmit={handleSubmit}>
          <Field name={"Name"} placeholder="Team Name" />
          <Field name={"Sr"} placeholder={"420"} />
          <Field name={"Lr"} placeholder={"69"} />
          <div className="flex flex-row justify-around w-full">
            <Button type="submit">Create</Button>
            <Button onClick={onClose}>Close</Button>
          </div>
        </form>
      </Paper>
    </Backdrop>
  );
};

export default CreateTeamBackdrop;
