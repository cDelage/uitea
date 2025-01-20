import { MdMoreHoriz } from "react-icons/md";
import { DesignSystemMetadata } from "../../domain/DesignSystemDomain";
import { GhostButton } from "../../ui/kit/Buttons";
import { ICON_SIZE_MD } from "../../ui/UiConstants";
import { useNavigate } from "react-router-dom";

function RecentFileTab({
  designSystemMetadata: { designSystemName, designSystemPath },
}: {
  designSystemMetadata: DesignSystemMetadata;
}) {
  const navigate = useNavigate();
  
  return (
    <tr
      onClick={() =>
        navigate(`/design-system/${encodeURIComponent(designSystemPath)}`)
      }
    >
      <td className="column expand">
        <strong>{designSystemName}</strong>
        <small className="text-color-light">{designSystemPath}</small>
      </td>
      <td className="shrink">
        <GhostButton>
          <MdMoreHoriz size={ICON_SIZE_MD} />
        </GhostButton>
      </td>
    </tr>
  );
}

export default RecentFileTab;
