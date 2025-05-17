import {
  ColorCombination,
  ColorCombinationCollection,
  ColorCombinationCollectionAndGroup,
  HandleUpdateColorPayload,
} from "../../domain/DesignSystemDomain";
import CombinationPreview from "../design-system/semantic-color-tokens/CombinationPreview";
import Popover from "../../ui/kit/Popover";
import {
  MdClose,
  MdDelete,
  MdDragIndicator,
  MdFolder,
  MdOpenInNew,
  MdStar,
  MdStarOutline,
} from "react-icons/md";
import { ICON_SIZE_MD } from "../../ui/UiConstants";
import { useForm } from "react-hook-form";
import { isEqual } from "lodash";
import { DraggableTools } from "../../util/DraggableContext";
import { useTokenCrafterContext } from "./TokenCrafterContext";
import TokenGroupPopover from "./TokenGroupPopover";
import { getTokenAvailableGroups } from "../../util/DesignSystemUtils";
import { useTokenCrafterStore } from "./TokenCrafterStore";
import CombinationComponentPlaceholder from "../design-system/previews/combination-preview/CombinationComponentPlaceholder";
import { useMemo } from "react";

function ExistingCombinationSettings({
  collectionAndGroup: { collection, group },
  index,
  handleRemoveCollection,
  handleRenameCollection,
  handleUpdateCollection,
  draggableTools,
  handleUpdateAllCollections,
}: {
  collectionAndGroup: ColorCombinationCollectionAndGroup;
  index: number;
  handleRemoveCollection: (index: number) => void;
  handleRenameCollection: (
    fromName: string,
    toName: string,
    index: number
  ) => void;
  handleUpdateCollection: (
    index: number,
    value: ColorCombinationCollection
  ) => void;
  draggableTools: DraggableTools;
  handleUpdateAllCollections: (newValue: ColorCombinationCollection[]) => void;
}) {
  const { register, handleSubmit, setValue } =
    useForm<ColorCombinationCollection>({
      defaultValues: collection,
    });
  const { designSystem } = useTokenCrafterContext();

  const semanticWithBackground =
    designSystem.semanticColorTokens.colorCombinationCollections.filter(
      (token) => token.default?.background
    );

  const countEmpty = useMemo(() => {
    let empty = 0;
    if (!collection.default) {
      empty++;
    }
    if (!collection.hover) {
      empty++;
    }
    if (!collection.focus) {
      empty++;
    }
    if (!collection.active) {
      empty++;
    }
    return empty;
  }, [collection]);

  const { setCollection } = useTokenCrafterStore();

  function handleLoadCollection() {
    setCollection(collection);
  }

  function shouldDisplayCombination(
    combination?: ColorCombination
  ): combination is ColorCombination {
    return (
      combination?.background !== undefined ||
      combination?.text !== undefined ||
      combination?.border !== undefined
    );
  }

  function handleUpdateColor({
    usage,
    state,
    value,
  }: HandleUpdateColorPayload) {
    handleUpdateCollection(index, {
      ...collection,
      [state]: { ...collection[state], [usage]: value },
    });
  }

  function handleSetDefaultComponent() {
    handleUpdateAllCollections(
      designSystem.semanticColorTokens.colorCombinationCollections.map(
        (col, i) => {
          return {
            ...col,
            defaultCombination: i === index,
          };
        }
      )
    );
  }

  function submitCollection(newCollection: ColorCombinationCollection) {
    if (isEqual(newCollection, collection)) return;
    if (collection.combinationName !== newCollection.combinationName) {
      handleRenameCollection(
        collection.combinationName ?? "",
        newCollection.combinationName ?? "",
        index
      );
    } else {
      handleUpdateCollection(index, newCollection);
    }
  }

  function getBackground(): string | undefined {
    if (draggableTools.dragIndex === index) {
      return "var(--uidt-drag-bg)";
    } else if (group?.background) {
      return `var(--${group?.background})`;
    } else {
      return undefined;
    }
  }

  function handleMouseEnter() {
    if (draggableTools.dragIndex !== undefined) {
      draggableTools.setHoverIndex(index);
    }
  }

  function handleSetGroup(group: string | undefined) {
    setValue("group", group);
    handleSubmit(submitCollection)();
  }

  const tokenAvailableGroups = getTokenAvailableGroups({
    combinationName: collection.combinationName,
    collections: designSystem.semanticColorTokens.colorCombinationCollections,
  });

  return (
    <div
      className="column gap-4 p-6"
      onMouseEnter={handleMouseEnter}
      style={{
        background: getBackground(),
        borderTop: `2px solid ${
          draggableTools.hoverIndex === index
            ? `var(--uidt-drag-border)`
            : `transparent`
        }`,
      }}
    >
      <div className="row justify-between">
        <h4 className="text-color-default">
          <input
            className="inherit-input"
            {...register("combinationName", {
              required: "Collection name is mandatory",
            })}
            onBlur={handleSubmit(submitCollection)}
          />
        </h4>
        <div className="row align-center gap-3">
          <div className="row align-center gap-2">
            <Popover.Toggle
              id={`group-${index}`}
              positionPayload="bottom-right"
              disabled={!semanticWithBackground.length}
            >
              <button className="action-ghost-button">
                <MdFolder size={ICON_SIZE_MD} />
                {collection.group || "base"}
              </button>
            </Popover.Toggle>
            <Popover.Body id={`group-${index}`} zIndex={2000}>
              <TokenGroupPopover
                colorCombinationCollections={tokenAvailableGroups}
                handleSetGroup={handleSetGroup}
              />
            </Popover.Body>
            {collection.group && (
              <button
                className="action-ghost-button"
                onClick={() => handleSetGroup(undefined)}
              >
                <MdClose size={ICON_SIZE_MD} />
              </button>
            )}
          </div>
          <button className="action-button" onClick={handleLoadCollection}>
            <MdOpenInNew
              size={ICON_SIZE_MD}
              style={{ transform: "scaleX(-1)" }}
            />
          </button>
          <button
            className="action-button"
            onMouseDown={() => draggableTools.setDragIndex(index)}
            onDrag={(e) => e.preventDefault()}
          >
            <MdDragIndicator
              size={ICON_SIZE_MD}
              style={{ transform: "scaleX(-1)" }}
            />
          </button>
          <button
            className={`action-button ${
              collection.defaultCombination ? "active" : ""
            }`}
            onClick={handleSetDefaultComponent}
          >
            {collection.defaultCombination ? (
              <MdStar size={ICON_SIZE_MD} />
            ) : (
              <MdStarOutline size={ICON_SIZE_MD} />
            )}
          </button>
          <Popover.Toggle
            id={`delete-combination-${index}`}
            positionPayload="bottom-right"
          >
            <button className="action-button">
              <MdDelete size={ICON_SIZE_MD} />
            </button>
          </Popover.Toggle>
          <Popover.Body id={`delete-combination-${index}`} zIndex={100}>
            <Popover.Actions>
              <Popover.Tab>
                <MdClose size={ICON_SIZE_MD} /> Cancel
              </Popover.Tab>
              <Popover.Tab
                clickEvent={() => {
                  handleRemoveCollection(index);
                }}
                theme="alert"
              >
                <MdDelete size={ICON_SIZE_MD} /> Remove palette builder
              </Popover.Tab>
            </Popover.Actions>
          </Popover.Body>
        </div>
      </div>
      <div className="tokens-grid-sidepanel">
        {shouldDisplayCombination(collection.default) && (
          <CombinationPreview
            combination={collection.default}
            combinationName={collection.combinationName ?? ""}
            state="default"
            handleUpdateColor={handleUpdateColor}
          />
        )}
        {shouldDisplayCombination(collection.hover) && (
          <CombinationPreview
            combination={collection.hover}
            combinationName={collection.combinationName ?? ""}
            state="hover"
            handleUpdateColor={handleUpdateColor}
          />
        )}
        {shouldDisplayCombination(collection.active) && (
          <CombinationPreview
            combination={collection.active}
            combinationName={collection.combinationName ?? ""}
            state="active"
            handleUpdateColor={handleUpdateColor}
          />
        )}
        {shouldDisplayCombination(collection.focus) && (
          <CombinationPreview
            combination={collection.focus}
            combinationName={collection.combinationName ?? ""}
            state="focus"
            handleUpdateColor={handleUpdateColor}
          />
        )}
        {Array.from({ length: countEmpty }, (_, i) => (
          <div key={`${i}`}></div>
        ))}
        <div className="row h-full align-center last-sidepanel-child">
          <CombinationComponentPlaceholder combination={collection} />
        </div>
      </div>
    </div>
  );
}

export default ExistingCombinationSettings;
