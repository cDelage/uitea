import { Table } from "../../ui/kit/Table";
import Loader from "../../ui/kit/Loader";
import { useFindAllRecentFiles } from "./HomeQueries";
import RecentFileTab from "./RecentFileTab";

function RecentFiles() {
  const { recentFiles, isLoadingRecentFiles } = useFindAllRecentFiles();

  if (isLoadingRecentFiles) return <Loader />;

  return (
    <Table>
      <thead>
        <tr>
          <td>Design system</td>
          <td>Actions</td>
        </tr>
      </thead>
      <tbody>
        {recentFiles?.map((recentFile) => (
          <RecentFileTab
            key={recentFile.designSystemId}
            designSystemMetadata={recentFile}
          />
        ))}
      </tbody>
    </Table>
  );
}

export default RecentFiles;
