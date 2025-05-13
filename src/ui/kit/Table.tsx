import styled from "styled-components";

export const Table = styled.table`
  border-spacing: 0;
  table-layout: fixed;
  position: relative;
  width: 100%; /* La cellule de gauche s'étend automatiquement */
  td.expand {
    overflow-x: hidden;
    width: auto;
  }

  thead {
    position: sticky;
    top: 0;
    left: 0;
    tr {
      font-size: 14px;
      line-height: 20px;
      font-weight: var(--uidt-font-weight-bold);
      color: var(--uidt-base-text-light);
      td {
        padding: var(--uidt-space-3);
      }

      td.shrink {
        width: 1%; /* La cellule de droite occupe le minimum nécessaire */
        white-space: nowrap; /* Empêche la cellule de réduire son contenu sur plusieurs lignes */
        padding: var(--uidt-space-5) var(--uidt-space-2); /* Applique le padding ici */
      }
    }
  }

  tbody {
    background-color: var(--uidt-component-bg);
    border-radius: var(--radius-md);
    box-shadow: var(--uidt-shadow-md);

    .hoverable {
      &:hover {
        background-color: var(--uidt-component-hover-bg);
        color: var(--uidt-component-hover-text);
      }
    }

    tr {
      cursor: pointer;

      td {
        padding: var(--uidt-space-5); /* Applique le padding ici */
      }

      td.shrink {
        width: 1%; /* La cellule de droite occupe le minimum nécessaire */
        white-space: nowrap; /* Empêche la cellule de réduire son contenu sur plusieurs lignes */
        padding: var(--uidt-space-5) var(--uidt-space-2); /* Applique le padding ici */
      }
    }
  }
`;
