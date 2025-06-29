import { MdDelete } from "react-icons/md";
import Modal from "../../ui/kit/Modal";
import Popover from "../../ui/kit/Popover";
import { useModalContext } from "../../ui/kit/ModalContext";
import { useState } from "react";
import { ButtonAlert, ButtonTertiary } from "../../ui/kit/Buttons";
import { useRemoveRecentFile } from "./HomeQueries";

function ModalRemoveRecentFile({ recentFilePath }: { recentFilePath: string }) {
  const { openModal, closeModal } = useModalContext();
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
          closeModal();
        },
        onError: () => {
          closeModal();
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
            <div className="checkbox-container">
              <input
                type="checkbox"
                checked={isDeleteFromComputer}
                onChange={() => setIsDeleteFromComputer((value) => !value)}
              />
              Remove from computer
            </div>
          </Modal.Md>
          <Modal.Footer>
            <ButtonAlert onClick={handleRemoveFile} type="button">
              Remove
            </ButtonAlert>
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
