import { useParams } from "react-router-dom";

function useParamsNumber(): number {
  return Number(useParams<{ id: string }>().id);
}

export default useParamsNumber;
