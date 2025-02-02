import { MdDelete } from "react-icons/md";
import Modal from "../../ui/kit/Modal";
import Popover from "../../ui/kit/Popover";
import { useModalContext } from "../../ui/kit/useModalContext";
import { useState } from "react";
import { Checkbox } from "../../ui/kit/Checkbox";
import { ButtonAlert, ButtonTertiary } from "../../ui/kit/Buttons";
import { useRemoveRecentFile } from "./HomeQueries";
import { usePopoverContext } from "../../ui/kit/PopoverContext";

function ModalRemoveRecentFile({ recentFilePath }: { recentFilePath: string }) {
  const { openModal } = useModalContext();
  const { closePopover } = usePopoverContext();
  const [isDeleteFromComputer, setIsDeleteFromComputer] = useState(false);
  const { removeFile } = useRemoveRecentFile();

  function handleRemoveFile() {
    removeFile(
      {
        filePath: recentFilePath,
        isDeleteFromComputer: isDeleteFromComputer,
      },
      {
        onSuccess: () => {
          closePopover();
        },
        onError: () => {
          closePopover();
        },
      }
    );
  }
  return (
    <>
      <Modal.Toggle id="remove-recent-file">
        <Popover.Tab
          disableClose={true}
          clickEvent={() => {
            openModal("remove-recent-file");
          }}
        >
          <MdDelete /> Remove
        </Popover.Tab>
      </Modal.Toggle>
      <Modal.Body id="remove-recent-file">
        <>
          <Modal.Md>
            <h3>Remove recent file</h3>
            <div>
              Are you sure to want to remove the file from recent file ?
            </div>
            <div className="row align-center gap-2 text-color-light">
              <Checkbox
                type="checkbox"
                checked={isDeleteFromComputer}
                onChange={() => setIsDeleteFromComputer((value) => !value)}
              />
              Remove from computer
            </div>
          </Modal.Md>
          <Modal.Footer>
            <ButtonAlert onClick={handleRemoveFile}>Remove</ButtonAlert>
            <Modal.Close>
              <ButtonTertiary>Cancel</ButtonTertiary>
            </Modal.Close>
          </Modal.Footer>
        </>
      </Modal.Body>
    </>
  );
}

export default ModalRemoveRecentFile;
