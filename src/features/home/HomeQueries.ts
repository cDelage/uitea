import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  PresetDressing,
  RecentFilesMetadata,
  RemoveRecentFilesPayload,
  UserSettings,
} from "../../domain/HomeDomain";
import { DesignSystemMetadataHome } from "../../domain/DesignSystemDomain";
import { PaletteBuilderMetadata } from "../../domain/PaletteBuilderDomain";

/**
 * Hook pour récupérer tous les fichiers récents
 */
export function useFindAllRecentFiles() {
  const { removeFile } = useRemoveRecentFile();

  const { data: recentFiles, isLoading: isLoadingRecentFiles } = useQuery({
    queryKey: ["recent-files"],
    queryFn: async () => {
      const files = await invoke<RecentFilesMetadata[]>(
        "find_all_recent_files"
      );

      files
        .filter((recentFile) => "Unknown" in recentFile)
        .forEach((recentFileUnknown) => {
          toast.error(
            `Impossible to read file at this path ${recentFileUnknown.Unknown}, It will remove from recent file.`
          );
          removeFile({
            filePath: recentFileUnknown.Unknown,
            isDeleteFromComputer: false,
          });
        });

      return files
        .filter((recentFile) => !("Unknown" in recentFile))
        .map((recentFile) => {
          if ("DesignSystem" in recentFile) return recentFile.DesignSystem;
          if ("PaletteBuilder" in recentFile) return recentFile.PaletteBuilder;
        }) as (DesignSystemMetadataHome | PaletteBuilderMetadata)[];
    },
  });

  return {
    recentFiles: recentFiles as (
      | DesignSystemMetadataHome
      | PaletteBuilderMetadata
    )[],
    isLoadingRecentFiles,
  };
}

/**
 * Hook pour ajouter un fichier récent
 */
export function useInsertRecentFile(
  category: "DesignSystemCategory" | "PaletteBuilderCategory"
) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: insertRecentFile, isPending: isInsertingFile } = useMutation<
    string,
    Error,
    {
      filePath: string;
      editMode: boolean;
      category: "DesignSystemCategory" | "PaletteBuilderCategory";
    }
  >({
    mutationFn: async (recentFile) =>
      await invoke("insert_recent_file", {
        recentFile,
      }),
    onSuccess: (res) => {
      if (category === "DesignSystemCategory") {
        // Mettre à jour le cache après une insertion réussie
        queryClient.invalidateQueries({ queryKey: ["recent-files"] });
        navigate(`/design-system/${encodeURIComponent(res)}?editMode=true`);
      }
    },
    onError: (err) => {
      toast.error(err);
    },
  });

  return { insertRecentFile, isInsertingFile };
}

/**
 * Hook pour supprimer un fichier récent
 */
export function useRemoveRecentFile() {
  const queryClient = useQueryClient();

  const { mutate: removeFile, isPending: isRemovingFile } = useMutation<
    string,
    Error,
    RemoveRecentFilesPayload
  >({
    mutationFn: async (removePayload: RemoveRecentFilesPayload) =>
      await invoke("remove_recent_file", { removePayload }),
    onSuccess: (path) => {
      // Mettre à jour le cache après une suppression réussie
      queryClient.invalidateQueries({ queryKey: ["recent-files"] });
      toast.success(`Succeed to remove ${path} from recent file`);
    },
    onError: (err) => {
      console.error(err);
      toast.error(err);
    },
  });

  return { removeFile, isRemovingFile };
}

export function usePresetDressing() {
  const { data: presetDressing, isLoading: isLoadingPresetDressing } =
    useQuery<PresetDressing>({
      queryKey: ["preset-dressing"],
      queryFn: async () => await invoke("fetch_presets_dressing"),
    });

  return { presetDressing, isLoadingPresetDressing };
}

export function useUserSettings() {
  const { data: userSettings, isLoading: isLoadingUserSettings } =
    useQuery<UserSettings>({
      queryKey: ["user-settings"],
      queryFn: async () => await invoke("fetch_user_settings"),
    });

  return {
    userSettings,
    isLoadingUserSettings,
  };
}

export function useUpdateUserSettings() {
  const queryClient = useQueryClient();

  const { mutate: updateUserSettings, isPending: isUpdatingUserSettings } =
    useMutation({
      mutationFn: async (userSettings: UserSettings) =>
        await invoke("update_user_settings", {
          userSettings,
        }),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["user-settings"],
        });
      },
      onError: (err) => {
        toast.error(err);
      },
    });

  return {
    updateUserSettings,
    isUpdatingUserSettings,
  };
}
