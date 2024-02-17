import {
  Autocomplete,
  Backdrop,
  Button,
  FormControl,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  styled,
} from "@mui/material";
import BackdropProps from "../props/BackdropProps";
import TeamComboBox from "./TeamComboBox";
import { useState } from "react";

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

  const [ortsangabe, setOrtsangabe] = useState<string>("");
  const [incomingDirection, setIncomingDirection] = useState<string>("N");
  const [outgoingDirection, setOutgoingDirection] = useState<string>("N");

  const [redPatients, setRedPatients] = useState<string>("");
  const [yellowPatients, setYellowPatients] = useState<string>("");
  const [greenPatients, setGreenPatients] = useState<string>("");

  const [dangerLevel, setDangerLevel] = useState<string>("");

  const handleSubmit = () => {
    console.log({
      ortsangabe,
      incomingDirection,
      outgoingDirection,
      redPatients,
      yellowPatients,
      greenPatients,
      DangerLevel,
    });
  };

  return (
    <Backdrop open={open}>
      <Paper className="flex flex-col gap-4 p-4 bg-neutral-800">
        <h1 className="text-center">5-Liner</h1>
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
        <TeamComboBox />
        <div className="flex flex-row gap-4">
          <InputField
            label={"Rot"}
            value={redPatients}
            onChange={(e) => setRedPatients(e.target.value)}
          />
          <InputField
            label={"Gelb"}
            value={yellowPatients}
            onChange={(e) => setYellowPatients(e.target.value)}
          />
          <InputField
            label={"Grün"}
            value={greenPatients}
            onChange={(e) => setGreenPatients(e.target.value)}
          />
        </div>

        <Feindlage onChange={(e) => setDangerLevel(e.target.value)} />

        <InputField required label={"Übergabepunkt"} />

        <InputField label={"Zusatzinformationen"} />

        <div className="flex flex-row justify-around">
          <Button onClick={handleSubmit}>Submit</Button>
          <Button onClick={onClose}>Close</Button>
        </div>
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

export const InputField = styled(TextField)({
  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
    borderColor: "#717172",
  },
  "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
    borderColor: "white",
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "white",
  },
  "& .MuiOutlinedInput-input": {
    color: "white",
  },
  "&:hover .MuiOutlinedInput-input": {
    color: "white",
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
    color: "white",
  },
  "& .MuiInputLabel-outlined": {
    color: "white",
  },
  "&:hover .MuiInputLabel-outlined": {
    color: "white",
  },
  "& .MuiInputLabel-outlined.Mui-focused": {
    color: "white",
  },
});
