import { useNavigate } from "react-router-dom";
import { ButtonTertiary } from "../kit/Buttons";

function ErrorFallback() {
  const navigate = useNavigate();
  return (
    <div className="column p-10 gap-10">
      <h1>Error during execution</h1>
      <ButtonTertiary onClick={() => navigate("/")}>Go to homepage</ButtonTertiary>
    </div>
  );
}

export default ErrorFallback;
