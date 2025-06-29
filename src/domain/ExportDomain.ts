/** valeur d’une ombre portée */
export interface DropShadowValue {
  type: 'dropShadow';
  color: string;
  x: number;
  y: number;
  blur: number;
  spread: number;
}

/** typographie (h1, default, etc.) */
export interface TypographyValue {
  fontFamily: string;
  fontWeight: string;
  lineHeight: string;
  fontSize: string;
  letterSpacing: string;
  paragraphSpacing: string;
  paragraphIndent: string;
  textCase: string;
  textDecoration: string;
}

/** Union de tous les types de token possibles */
export type Token =
  | { type: 'color';            value: string }
  | { type: 'dimension';        value: string }
  | { type: 'fontFamilies';     value: string }
  | { type: 'fontSizes';        value: string }
  | { type: 'fontWeights';      value: string }
  | { type: 'lineHeights';      value: string }
  | { type: 'letterSpacing';    value: string }
  | { type: 'paragraphSpacing'; value: string }
  | { type: 'textCase';         value: string }
  | { type: 'textDecoration';   value: string }
  | { type: 'typography';       value: TypographyValue }
  | { type: 'boxShadow';        value: DropShadowValue };

/** Un groupe de tokens, indexé par nom de token (e.g. "50", "100", "bg-layout", etc.) */
export interface TokenGroup {
  [tokenName: string]: Token;
}

/** Un jeu de tokens (e.g. "Collection 1/Mode 1") :  
  - chaque clé peut être soit un TokenGroup  
  - soit un Token isolé (cas de `default`, `h1`, etc.) */
export interface TokenSet {
  [groupName: string]: TokenGroup | Token;
}

/** Métadonnées fournies dans le JSON */
export interface Metadata {
  tokenSetOrder: string[];
}

/** Représente tout le fichier d’export :  
  - les clés (sauf `$metadata`) sont des noms de TokenSet  
  - `$metadata` est fixe */
export interface TokensFile {
  $metadata: Metadata;
  [tokenSetName: string]: TokenSet | Metadata;
}
