import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";
import {
  DesignSystem,
  DesignSystemCreationPayload,
  DesignSystemMetadata,
  GenerateExportPayload,
} from "../../domain/DesignSystemDomain";
import toast from "react-hot-toast";
import { useInsertRecentFile } from "../home/HomeQueries";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { buildReadme, getImagesPreview } from "../../util/DesignSystemUtils";


export function useCreateDesignSystem() {
  const { insertRecentFile } = useInsertRecentFile("DesignSystemCategory");
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
        insertRecentFile({
          filePath: result.designSystemPath,
          category: "DesignSystemCategory",
          editMode: true,
        });
      },
    });

  return { createDesignSystem, isCreatingDesignSystem };
}

export function useFindDesignSystem(designSystemPath?: string) {
  const { data: designSystem, isLoading: isLoadingDesignSystem } = useQuery({
    queryKey: ["design-system", designSystemPath],
    queryFn: async (): Promise<DesignSystem> =>
      await invoke<DesignSystem>("find_design_system", {
        designSystemPath,
      }),

    enabled: designSystemPath !== undefined && designSystemPath !== null,
  });

  return {
    designSystem,
    isLoadingDesignSystem,
  };
}

export function useCurrentDesignSystem() {
  const { designSystemPath } = useParams();
  const { designSystem, isLoadingDesignSystem } =
    useFindDesignSystem(designSystemPath);

  useEffect(() => {
    document.dispatchEvent(new CustomEvent("refresh-design-system-forms"));
  }, [designSystem]);

  return {
    designSystem,
    isLoadingDesignSystem,
  };
}

//Save temporary
export function useSaveDesignSystem(designSystemPath?: string) {
  const queryClient = useQueryClient();
  const { mutate: saveDesignSystem, isPending: isSavingDesignSystem } =
    useMutation({
      mutationFn: async ({
        designSystem,
        isTmp,
      }: {
        designSystem: DesignSystem;
        isTmp: boolean;
      }): Promise<DesignSystem> =>
        await invoke<DesignSystem>("save_design_system", {
          designSystem,
          isTmp,
        }),
      onError: (error) => {
        toast.error(error);
      },
      onSuccess: (designSystem: DesignSystem) => {
        queryClient.setQueryData(
          ["design-system", designSystemPath],
          designSystem
        );
      },
    });

  return { saveDesignSystem, isSavingDesignSystem };
}

export function useUndoRedoDesignSystem(designSystemPath?: string) {
  const queryClient = useQueryClient();

  const { mutate: undoDesignSystem } = useMutation({
    mutationFn: async (): Promise<DesignSystem> =>
      await invoke("undo_design_system", {
        designSystemPath,
      }),
    onError: (error) => {
      toast.error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["design-system", designSystemPath],
      });
    },
  });
  const { mutate: redoDesignSystem } = useMutation({
    mutationFn: async (): Promise<DesignSystem> =>
      await invoke("redo_design_system", {
        designSystemPath,
      }),
    onError: (error) => {
      toast.error(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["design-system", designSystemPath],
      });
    },
  });

  return { undoDesignSystem, redoDesignSystem };
}

export function useGenerateExport() {
  const { mutate: generateExport, isPending: isGeneratingExport } = useMutation(
    {
      mutationFn: async (payload: GenerateExportPayload) => {
        await invoke("register_export", {
          payload,
        });
      },
      onError: (err) => {
        toast.error("fail to generate export");
        console.error(err);
      },
    }
  );

  return { generateExport, isGeneratingExport };
}

export function useSaveReadme() {
  const { mutate: saveReadme, isPending: isSavingReadme } = useMutation({
    mutationFn: async (designSystem: DesignSystem) => {
      const metadata = { ...designSystem.metadata };
      metadata.readme = buildReadme(designSystem);
      metadata.previewImages = await getImagesPreview(designSystem);
      await invoke("save_readme", {
        metadata,
      });
    },
    onError: () => {
      toast.error("Fail to save readme");
    },
  });

  return { saveReadme, isSavingReadme };
}
