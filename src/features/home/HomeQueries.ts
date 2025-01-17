import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";
import toast from "react-hot-toast";

/**
 * Hook pour récupérer tous les fichiers récents
 */
export function useFindAllRecentFiles() {
  const isClient = typeof window !== "undefined";

  const { data: recentFiles, isLoading: isLoadingRecentFiles } = useQuery({
    queryKey: ["recentFiles"],
    queryFn: async () => await invoke<string[]>("find_all_recent_files"),
    initialData: [],
    enabled: isClient,
  });

  return { recentFiles, isLoadingRecentFiles };
}

/**
 * Hook pour ajouter un fichier récent
 */
export function useInsertRecentFile() {
  const queryClient = useQueryClient();

  const { mutate: insertRecentFile, isPending: isInsertingFile } = useMutation({
    mutationFn: async (filePath: string) =>
      await invoke("insert_recent_file", { filePath }),
    onSuccess: () => {
      // Mettre à jour le cache après une insertion réussie
      queryClient.invalidateQueries({ queryKey: ["recentFiles"] });
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

  const { mutate: removeFile, isPending: isRemovingFile } = useMutation({
    mutationFn: async (filePath) =>
      await invoke("remove_recent_file", { filePath }),
    onSuccess: () => {
      // Mettre à jour le cache après une suppression réussie
      queryClient.invalidateQueries({ queryKey: ["recentFiles"] });
    },
  });

  return { removeFile, isRemovingFile };
}
