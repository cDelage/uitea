import { useMutation } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";
import {
  DesignSystemCreationPayload,
  DesignSystemMetadata,
} from "../../domain/DesignSystemDomain";
import toast from "react-hot-toast";
import { useInsertRecentFile } from "../home/HomeQueries";

export function useCreateDesignSystem() {
  const { insertRecentFile } = useInsertRecentFile();
  const { mutate: createDesignSystem, isPending: isCreatingDesignSystem } =
    useMutation<DesignSystemMetadata, Error, DesignSystemCreationPayload>({
      mutationFn: async (
        designSystemCreationPayload: DesignSystemCreationPayload
      ) =>
        await invoke("create_design_system", {
          payload: designSystemCreationPayload,
        }),
      onError: (err) => {
        toast.error(err);
      },
      onSuccess: (result: DesignSystemMetadata) => {
        toast.success(
          `Design system ${result.designSystemName} successfully created`
        );
        insertRecentFile(result.designSystemPath);
      },
    });

  return { createDesignSystem, isCreatingDesignSystem };
}
