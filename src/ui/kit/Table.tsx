import styled from "styled-components";

export const Table = styled.table`
  border-spacing: 0;

  td.expand {
    width: auto; /* La cellule de gauche s'étend automatiquement */
  }

  td.shrink {
    width: 1%; /* La cellule de droite occupe le minimum nécessaire */
    white-space: nowrap; /* Empêche la cellule de réduire son contenu sur plusieurs lignes */
  }

  thead {
    tr {
      font-size: 14px;
      line-height: 20px;
      font-weight: var(--font-weight-bold);
      color: var(--default-color-text-light);

      td {
        padding: var(--space-3);
      }
    }

  }

  tbody {
    background-color: var(--color-theme-component-bg);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);

    tr {
      cursor: pointer;
      &:hover {
        background-color: var(--color-theme-component-hover-bg);
        color: var(--color-theme-component-hover-text);
      }

      td {
        padding: var(--space-5); /* Applique le padding ici */
      }
    }
  }
`;
