import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { RecentFile, RemoveRecentFilesPayload } from "../../domain/HomeDomain";
import { DesignSystemMetadata } from "../../domain/DesignSystemDomain";

/**
 * Hook pour récupérer tous les fichiers récents
 */
export function useFindAllRecentFiles() {
  const { removeFile } = useRemoveRecentFile();

  const { data: recentFiles, isLoading: isLoadingRecentFiles } = useQuery({
    queryKey: ["recentFiles"],
    queryFn: async () => {
      const files = await invoke<RecentFile[]>("find_all_recent_files");

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
        .filter((recentFile) => "DesignSystem" in recentFile)
        .map(
          (designSystem) => designSystem.DesignSystem
        ) as DesignSystemMetadata[];
    },
  });

  return { recentFiles, isLoadingRecentFiles };
}

/**
 * Hook pour ajouter un fichier récent
 */
export function useInsertRecentFile() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: insertRecentFile, isPending: isInsertingFile } = useMutation<
    string,
    Error,
    string
  >({
    mutationFn: async (filePath: string) =>
      await invoke("insert_recent_file", { filePath }),
    onSuccess: (res) => {
      // Mettre à jour le cache après une insertion réussie
      queryClient.invalidateQueries({ queryKey: ["recentFiles"] });
      navigate(`/design-system/${encodeURIComponent(res)}`);
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
      queryClient.invalidateQueries({ queryKey: ["recentFiles"] });
      toast.success(`Succeed to remove ${path} from recent file`);
    },
    onError: (err) => {
      toast.error(err);
    },
  });

  return { removeFile, isRemovingFile };
}
