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

    :hover {
      border: var(--${(props) => props.$combination.hover?.border}) 1px solid;
    }
  }

  th:first-child {
    border-top-left-radius: var(--uidt-rounded-md);
  }

  th:last-child {
    border-top-right-radius: var(--uidt-rounded-md);
  }
  
  .td-first {
    border-bottom-left-radius: var(--uidt-rounded-md);
  }

  .td-last {
    border-bottom-right-radius: var(--uidt-rounded-md);
  }

  thead {
    tr {
      font-size: 14px;
      line-height: 20px;
      font-weight: var(--uidt-font-weight-bold);
      color: var(--uidt-base-text-light);
      th {
        background-color: var(
          --${(props) => props.$combination.default?.background}
        );
        color: var(--${(props) => props.$combination.default?.text});
        :hover {
          background-color: ${(props) => props.$combination.hover?.background};
        }
      }
    }
  }

  tbody {
    background-color: transparent;
    border-radius: var(--radius-md);
    box-shadow: var(--uidt-shadow-md);
  }
`;

function ArrayHeaderCombinationPreview({
  combination,
}: {
  combination: ColorCombinationCollection;
}) {
  return (
    <div className={styles.previewContainer}>
      <div className="rounded-md overflow-hidden">
        <Table $combination={combination}>
          <thead>
            <tr>
              <th>Table</th>
              <th>Column</th>
              <th>Column</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Row 1</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr>
              <td>Row 2</td>
              <td>-</td>
              <td>-</td>
            </tr>
            <tr>
              <td className="td-first">Row 3</td>
              <td>-</td>
              <td  className="td-last">-</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default ArrayHeaderCombinationPreview;
