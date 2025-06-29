import { useNavigate, useRouteError } from "react-router-dom";
import { ButtonTertiary } from "../kit/Buttons";

function ErrorFallback() {
  const navigate = useNavigate();
  const error = useRouteError();
  console.error(error);
  return (
    <div className="column p-10 gap-10">
      <h1>Error during execution</h1>
      <ButtonTertiary onClick={() => navigate("/")}>Go to homepage</ButtonTertiary>
    </div>
  );
}

export default ErrorFallback;
