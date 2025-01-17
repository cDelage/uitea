import CreateDesignSystem from "./CreateDesignSystem";
import LoadDesignSystem from "./LoadDesignSystem";
import RecentFiles from "./RecentFiles";

function HomePage() {
    return (
        <div>
          <main className="column p-8 gap-8">
            <h1>New</h1>
            <div className="row gap-4">
              <CreateDesignSystem />
              <LoadDesignSystem />
            </div>
            <h1>Recent</h1>
            <RecentFiles />
          </main>
        </div>
      );
}

export default HomePage