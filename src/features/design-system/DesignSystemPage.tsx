import { useParams } from "react-router-dom";

function DesignSystemPage() {
  const { designSystemPath } = useParams();

  return <div>DesignSystemPage : {designSystemPath}</div>;
}

export default DesignSystemPage;
