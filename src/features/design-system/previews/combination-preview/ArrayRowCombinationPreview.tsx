import styled from "styled-components";
import { ColorCombinationCollection } from "../../../../domain/DesignSystemDomain";
import styles from "./CombinationPreview.module.css";

const Table = styled.table<{ $combination: ColorCombinationCollection }>`
  border-spacing: 0;
  table-layout: fixed;
  width: 100%; /* La cellule de gauche s'étend automatiquement */
  td.expand {
    overflow-x: hidden;
    width: auto;
  }
  th,
  td {
    border: var(--${(props) => props.$combination.default?.border}) 1px solid;
  }

  .td-top-first {
    border-top-left-radius: var(--uidt-rounded-md);
  }

  .td-top-last {
    border-top-right-radius: var(--uidt-rounded-md);
  }

  .td-first {
    border-bottom-left-radius: var(--uidt-rounded-md);
  }

  .td-last {
    border-bottom-right-radius: var(--uidt-rounded-md);
  }

  tbody {
    background-color: transparent;
    border-radius: var(--radius-md);
    box-shadow: var(--uidt-shadow-md);
    color: var(--uidt-base-text-light);
    .row-color {
      td {
        background-color: var(
          --${(props) => props.$combination.default?.background}
        );
        color: var(--${(props) => props.$combination.default?.text});
        &:hover {
          background-color: ${(props) => props.$combination.hover?.background};
        }
      }
    }
  }
`;

function ArrayRowCombinationPreview({
  combination,
}: {
  combination: ColorCombinationCollection;
}) {
  return (
    <div className={styles.previewContainer}>
      <Table $combination={combination}>
        <tbody>
          <tr className="row-color">
            <td className="td-top-first">Row 1</td>
            <td> </td>
            <td className="td-top-first"> </td>
          </tr>
          <tr>
            <td>Row 2</td>
            <td> </td>
            <td> </td>
          </tr>
          <tr className="row-color">
            <td>Row 3</td>
            <td> </td>
            <td> </td>
          </tr>
          <tr>
            <td className="td-first">Row 4</td>
            <td> </td>
            <td className="td-last"> </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}

export default ArrayRowCombinationPreview;
