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
      font-weight: var(--uit-font-weight-bold);
      color: var(--uit-base-text-light);
      td {
        padding: var(--uit-space-3);
      }

      td.shrink {
        width: 1%; /* La cellule de droite occupe le minimum nécessaire */
        white-space: nowrap; /* Empêche la cellule de réduire son contenu sur plusieurs lignes */
        padding: var(--uit-space-5) var(--uit-space-2); /* Applique le padding ici */
      }
    }
  }

  tbody {
    background-color: var(--uit-component-bg);
    border-radius: var(--radius-md);
    box-shadow: var(--uit-shadow-md);

    .hoverable {
      &:hover {
        background-color: var(--uit-primary-outline-hover-bg);
        color: var(--uit-primary-outline-hover-text);
      }
    }

    tr {
      cursor: pointer;

      td {
        padding: var(--uit-space-5); /* Applique le padding ici */
      }

      td.shrink {
        width: 1%; /* La cellule de droite occupe le minimum nécessaire */
        white-space: nowrap; /* Empêche la cellule de réduire son contenu sur plusieurs lignes */
        padding: var(--uit-space-5) var(--uit-space-2); /* Applique le padding ici */
      }
    }
  }
`;
