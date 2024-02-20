import {
  Autocomplete,
  Backdrop,
  Button,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
} from "@mui/material";
import BackdropProps from "../props/BackdropProps";
import TeamComboBox from "./TeamComboBox";
import { useState } from "react";
import useAppDispatch from "../hooks/useAppDispatch";
import { Task } from "../types/Task";
import InputField from "./InputField";
import { TaskCreationParams, addNewTask } from "../state/taskSlice";

interface FiveLinerFormProps extends BackdropProps {}

enum DangerLevel {
  RED = "RED",
  YELLOW = "YELLOW",
  GREEN = "GREEN",
}

const FiveLinerForm: React.FC<FiveLinerFormProps> = (
  props: FiveLinerFormProps
) => {
  const { open, onClose } = props;

  const dispatch = useAppDispatch();

  const [ortsangabe, setOrtsangabe] = useState<string>("");
  const [incomingDirection, setIncomingDirection] = useState<string>("N");
  const [outgoingDirection, setOutgoingDirection] = useState<string>("N");

  const [targetId, setTargetId] = useState<number>(-1);

  const [job, setJob] = useState<string>("");

  const [dangerLevel, setDangerLevel] = useState<string>("");

  const [exchangePoint, setExchangePoint] = useState<string>("");
  const [furtherInformation, setFurtherInformation] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const task: Task = {
      title: `5L-${job}`,
      description: `Ortsangabe: ${ortsangabe}\nEinflug: ${incomingDirection}\nAusflug: ${outgoingDirection}\nGefahrenstufe: ${dangerLevel}\nÜbergabepunkt: ${exchangePoint}\nZusatzinformationen: ${furtherInformation}`,
      priority: 1,
      targetId: targetId,
      visualId: 232,
      id: 232,
      boardId: 1,
      workers: [],
      status: 0,
    };

    const creationParams: TaskCreationParams = {
      boardId: 1,
      title: task.title,
      description: task.description,
      priority: task.priority,
      targetId: task.targetId,
      status: 0,
      taskType: 0,
    };

    dispatch(addNewTask(creationParams));
    onClose();
  };

  return (
    <Backdrop open={open}>
      <Paper className="p-4 bg-neutral-800">
        <h1 className="m-1 text-center">5-Liner</h1>
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <div className="flex flex-row items-center justify-between gap-4">
            <InputField
              label={"Ortsangabe"}
              required
              value={ortsangabe}
              onChange={(e) => setOrtsangabe(e.target.value)}
            />
            <CardinalSelection
              label="An"
              value={incomingDirection}
              onChange={(e) => setIncomingDirection(e.target.value)}
            />
            <CardinalSelection
              label="Ab"
              value={outgoingDirection}
              onChange={(e) => setOutgoingDirection(e.target.value)}
            />
          </div>
          <TeamComboBox onChange={setTargetId} label="Target"/>
          <InputField
            required
            label={"Auftrag"}
            onChange={(e) => setJob(e.target.value)}
          />
          <Feindlage onChange={(e) => setDangerLevel(e.target.value)} />
          <InputField
            required
            label={"Übergabepunkt"}
            value={exchangePoint}
            onChange={(e) => setExchangePoint(e.target.value)}
          />
          <InputField
            label={"Zusatzinformationen"}
            value={furtherInformation}
            onChange={(e) => setFurtherInformation(e.target.value)}
          />

          <div className="flex flex-row justify-around">
            <Button type="submit">Submit</Button>
            <Button onClick={onClose}>Close</Button>
          </div>
        </form>
      </Paper>
    </Backdrop>
  );
};

export default FiveLinerForm;

const CardinalDirections = [
  { label: "N" },
  { label: "S" },
  { label: "E" },
  { label: "W" },
  { label: "NW" },
  { label: "NE" },
  { label: "SW" },
  { label: "SE" },
];

interface CardinalDirectionsProps {
  label: string;
  value: string;
  onChange: (e: any) => void;
}

const CardinalSelection: React.FC<CardinalDirectionsProps> = ({
  label,
  value,
  onChange,
}) => {
  return (
    <Autocomplete
      options={CardinalDirections}
      renderInput={(params) => (
        <InputField
          {...params}
          onChange={onChange}
          label={label}
          value={value}
        />
      )}
    />
  );
};

interface FeindlageProps {
  onChange: (e: any) => void;
}

const Feindlage: React.FC<FeindlageProps> = ({ onChange }) => {
  return (
    <div className="flex flex-row items-center justify-between">
      <label>Feindlage</label>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue="female"
        name="radio-buttons-group"
        row
        onChange={onChange}
      >
        <FormControlLabel value="Rot" control={<Radio />} label="Rot" />
        <FormControlLabel value="Gelb" control={<Radio />} label="Gelb" />
        <FormControlLabel value="Grün" control={<Radio />} label="Grün" />
      </RadioGroup>
    </div>
  );
};
