import { useInsertRecentFile } from "./HomeQueries";

function RecentFiles() {
  const { insertRecentFile } = useInsertRecentFile();

  return (
    <div>
      Empty
      <button onClick={() => insertRecentFile("other")}>Click</button>
    </div>
  );
}

export default RecentFiles;
