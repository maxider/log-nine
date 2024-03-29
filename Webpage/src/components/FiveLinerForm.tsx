import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Modal,
  Paper,
  Radio,
  RadioGroup,
  Select,
  SxProps,
  TextField,
} from "@mui/material";
import { useState } from "react";
import Task from "../entities/Task";

import TeamComboBox from "./TeamComboBox";
import FormProps from "../helpers/FormProps";
import useCreateTask from "../hooks/useCreateTask";

type DangerLevel = "Rot" | "Gelb" | "Grün";

const FiveLinerForm = ({ isOpen, boardId, onClose }: FormProps) => {
  const createTask = useCreateTask();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const task: Task = {
      title: `5L-${order}`,
      description: `Ortsangabe: ${location}\nEinflug: ${from}\nAusflug: ${to}\nAuftrag:${order}\nGefahrenstufe: ${dangerLevel}\nKennzeichnung Übergabepunkt: ${handoverInfo}\nZusatzinformationen: ${details}`,
      priority: 1,
      targetId: targetId,
      visualId: 232,
      id: 232,
      boardId: parseInt(boardId),
      status: 0,
    };

    createTask({
      boardId: task.boardId,
      title: task.title,
      description: task.description,
      targetId: task.targetId,
      status: task.status,
      priority: task.priority,
      taskType: 0,
    });

    resetState();
    onClose();
  };

  const resetState = () => {
    setLocation("");
    setTo("");
    setFrom("");
    setTargetId(-1);
    setOrder("");
    setDangerLevel("Gelb");
    setHandoverInfo("");
    setDetails("");
  };

  const {
    location,
    setLocation,
    to,
    setTo,
    from,
    setFrom,
    targetId,
    setTargetId,
    order,
    setOrder,
    dangerLevel,
    setDangerLevel,
    handoverInfo,
    setHandoverInfo,
    details,
    setDetails,
  } = useFiveLinerState();

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Paper sx={style}>
        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              overflowX: "auto",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-end",
                gap: "10px",
              }}
            >
              <TextField
                sx={{ flexGrow: 1 }}
                label={"Ortsangabe"}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
              <CardinalSelector
                label={"An"}
                value={from}
                onSelect={(v) => setFrom(v)}
                required
              />
              <CardinalSelector
                label={"Ab"}
                value={to}
                onSelect={(v) => setTo(v)}
                required
              />
            </Box>
            <TeamComboBox
              setTargetId={setTargetId}
              boardId={boardId}
              required
              value={targetId}
            />
            <TextField
              label={"Auftrag"}
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              required
            />
            <DangerLevelSelector
              value={dangerLevel}
              onChange={(v) => setDangerLevel(v as DangerLevel)}
            />
            <TextField
              label={"Kennzeichnung Übergabepunkt"}
              value={handoverInfo}
              onChange={(e) => setHandoverInfo(e.target.value)}
              required
            />
            <TextField
              label={"Weitere Info"}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button type="submit" variant="contained">
              Create
            </Button>
          </Box>
        </form>
      </Paper>
    </Modal>
  );
};

interface CardinalSelectorProps {
  label: string;
  value: string;
  onSelect: (value: string) => void;
  required: boolean;
}

const CardinalSelector = ({
  label,
  value,
  onSelect,
  required,
}: CardinalSelectorProps) => {
  return (
    <FormControl>
      <FormLabel sx={{ textAlign: "center" }}>{label}</FormLabel>
      <Select
        label={label}
        value={value}
        sx={{
          with: "50px",
        }}
        onChange={(e) => onSelect(e.target.value)}
        required={required}
      >
        <MenuItem value={"N"}> N</MenuItem>
        <MenuItem value={"NE"}> NE</MenuItem>
        <MenuItem value={"E"}> E</MenuItem>
        <MenuItem value={"SE"}> SE</MenuItem>
        <MenuItem value={"S"}> S</MenuItem>
        <MenuItem value={"SW"}> SW</MenuItem>
        <MenuItem value={"W"}> W</MenuItem>
        <MenuItem value={"NW"}> NW</MenuItem>
      </Select>
    </FormControl>
  );
};

interface DangerLevelProps {
  value: string;
  onChange: (value: string) => void;
}

const DangerLevelSelector = ({ value, onChange }: DangerLevelProps) => {
  return (
    <FormControl
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <FormLabel>Gefahrenlage</FormLabel>
      <RadioGroup
        defaultValue={value}
        sx={{
          display: "flex",
          flexDirection: "row",
        }}
        onChange={(e) => onChange(e.target.value)}
      >
        <FormControlLabel value="Rot" control={<Radio />} label="Rot" />
        <FormControlLabel value="Gelb" control={<Radio />} label="Gelb" />
        <FormControlLabel value="Grün" control={<Radio />} label="Grün" />
      </RadioGroup>
    </FormControl>
  );
};

const useFiveLinerState = () => {
  const [location, setLocation] = useState<string>("");
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [targetId, setTargetId] = useState<number>(-1);
  const [order, setOrder] = useState<string>("");
  const [dangerLevel, setDangerLevel] = useState<DangerLevel>("Gelb");
  const [handoverInfo, setHandoverInfo] = useState<string>("");
  const [details, setDetails] = useState<string>("");

  return {
    location,
    setLocation,
    to,
    setTo,
    from,
    setFrom,
    targetId,
    setTargetId,
    order,
    setOrder,
    dangerLevel,
    setDangerLevel,
    handoverInfo,
    setHandoverInfo,
    details,
    setDetails,
  };
};

const style: SxProps = {
  position: "absolute",
  p: "10px",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "33%",
  maxHeight: "80%",
  overflow: "auto",
  ":focus-visible": {
    outline: "none",
  },
};

export default FiveLinerForm;
