import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  PaletteBuilder,
  PaletteBuilderMetadata,
  PaletteBuilderRenameMetadata,
} from "../../domain/PaletteBuilderDomain";
import { invoke } from "@tauri-apps/api";
import toast from "react-hot-toast";

export function useSavePaletteBuilder() {
  const { mutate: savePaletteBuilder, isPending: isSavingPaletteBuilder } =
    useMutation({
      mutationFn: async (paletteBuilder: PaletteBuilder) => {
        return await invoke("save_palette_builder", { paletteBuilder });
      },
      onSuccess: () => {
        toast.success("Palette builder saved correctly");
      },
    });

  return { savePaletteBuilder, isSavingPaletteBuilder };
}

export function useSavePaletteBuilderIntoDesignSystem(
  designSystemPath?: string
) {
  const queryClient = useQueryClient();
  const {
    mutate: savePaletteBuilderIntoDesignSystem,
    isPending: isSavingPaletteBuilder,
  } = useMutation({
    mutationFn: async ({
      paletteBuilder,
      designSystemPath,
    }: {
      paletteBuilder: PaletteBuilder;
      designSystemPath: string;
    }) => {
      return await invoke("save_palette_builder_into_design_system", {
        paletteBuilder,
        designSystemPath,
      });
    },
    onSuccess: () => {
      toast.success("Palette builder saved correctly");
      queryClient.invalidateQueries({
        queryKey: ["palette-builder-design-system", designSystemPath],
      });
    },
    onError: (err) => {
      console.error(err);
      toast.error("Fail to saved palette builder");
    },
  });

  return { savePaletteBuilderIntoDesignSystem, isSavingPaletteBuilder };
}

export function useFetchDesignSystemPaletteBuilder(designSystemPath?: string) {
  const {
    data: designSystemPaletteBuilder,
    isLoading: isLoadingPaletteBuilder,
  } = useQuery({
    queryKey: ["palette-builder-design-system", designSystemPath],
    queryFn: async () => {
      if (designSystemPath) {
        return await invoke<PaletteBuilderMetadata[]>(
          "fetch_design_system_palette_builders",
          {
            designSystemPath,
          }
        );
      }
    },
    enabled: designSystemPath !== undefined,
  });

  return { designSystemPaletteBuilder, isLoadingPaletteBuilder };
}

export function useRemovePaletteBuilderFromDesignSystem(
  designSystemPath?: string
) {
  const queryClient = useQueryClient();
  const {
    mutate: removePaletteBuilderFromDesignSystem,
    isPending: isRemovingPaletteBuilderFromDesignSystem,
  } = useMutation({
    mutationFn: async (path: string) => {
      return await invoke("remove_palette_builder_from_design_system", {
        path,
      });
    },
    onSuccess: () => {
      toast.success("Palette builder removed correctly");
      queryClient.invalidateQueries({
        queryKey: ["palette-builder-design-system", designSystemPath],
      });
    },
    onError: (err) => {
      console.error(err);
      toast.error("Fail to remove palette builder");
    },
  });

  return {
    removePaletteBuilderFromDesignSystem,
    isRemovingPaletteBuilderFromDesignSystem,
  };
}

export function useRenamePaletteBuilder(designSystemPath?: string) {
  const queryClient = useQueryClient();
  const { mutate: renamePaletteBuilder, isPending: isRenamingPaletteBuilder } =
    useMutation({
      mutationFn: (payload: PaletteBuilderRenameMetadata) =>
        invoke("rename_palette_builder", { payload }),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["palette-builder-design-system", designSystemPath],
        });
      },
      onError: (err) => {
        console.error(err);
        toast.error("Fail to remove palette builder");
      },
    });

  return {
    renamePaletteBuilder,
    isRenamingPaletteBuilder,
  };
}
