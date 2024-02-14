import { Backdrop, Button, Divider, Paper } from "@mui/material";
import React, { useEffect, useRef } from "react";
import useParamsNumber from "../hooks/useParamsNumber";
import { useSelector } from "react-redux";
import { selectTeamsByBoardId } from "../state/Selectors/TeamSelectors";
import { RootState } from "../state/store";
import BackdropProps from "../props/BackdropProps";

interface TeamsListBackdropProps extends BackdropProps {
  onEdit: (id: number) => void;
  onCreate: () => void;
}

const TeamsListBackdrop: React.FC<TeamsListBackdropProps> = ({
  onClose,
  open,
  onEdit,
  onCreate,
}) => {
  const boardId = useParamsNumber();
  const teams = useSelector((state: RootState) =>
    selectTeamsByBoardId(state, boardId)
  );

  return (
    <Backdrop open={open}>
      <Paper className="flex flex-col p-2 min-h-2/4 bg-neutral-800">
        {teams.map((t) => (
          <div className="flex flex-row justify-between p-2">
            <h2 className="m-0 mr-20" key={t.id}>
              {t.name}
            </h2>
            <Button onClick={() => onEdit(t.id)}>Edit</Button>
          </div>
        ))}
        <Divider orientation="horizontal" flexItem />
        <div className="flex flex-row justify-around mt-2">
          <Button onClick={onCreate}>Create</Button>
          <Button onClick={onClose}>Close</Button>
        </div>
      </Paper>
    </Backdrop>
  );
};

export default TeamsListBackdrop;
