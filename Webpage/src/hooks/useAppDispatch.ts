import { useDispatch } from "react-redux";
import { AppDispatch } from "../state/store";

const useAppDispatch = () => {
  return useDispatch<AppDispatch>();
};

export default useAppDispatch;
