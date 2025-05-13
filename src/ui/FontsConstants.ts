
export type FontCategory =
  | "serif"
  | "sans-serif"
  | "calligraphy"
  | "handwritten"
  | "fantasy";

export interface FontCategoryAndFont {
  category: FontCategory;
  mainFont: string;
}

export const FONT_CATEGORIES: FontCategoryAndFont[] = [
  {
    category: "sans-serif",
    mainFont: "Roboto",
  },
  {
    category: "serif",
    mainFont: "Playfair Display",
  },
  {
    category: "handwritten",
    mainFont: "Indie Flower",
  },
  {
    category: "calligraphy",
    mainFont: "Tangerine",
  }
];

export interface Font {
  name: string;
  category: FontCategory;
  variable: boolean;
}

export const FONT_ARRAY: Font[] = [
  {
    name: "ABeeZee",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Abel",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Abril Fatface",
    category: "serif",
    variable: false,
  },
  {
    name: "Acme",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Alegreya",
    category: "serif",
    variable: true,
  },
  {
    name: "Alegreya Sans",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Alfa Slab One",
    category: "serif",
    variable: false,
  },
  {
    name: "Almarai",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Amatic SC",
    category: "handwritten",
    variable: false,
  },
  {
    name: "Amiri",
    category: "serif",
    variable: true,
  },
  {
    name: "Antic Slab",
    category: "serif",
    variable: false,
  },
  {
    name: "Anton",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Architects Daughter",
    category: "handwritten",
    variable: false,
  },
  {
    name: "Archivo",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Archivo Black",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Archivo Narrow",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Arimo",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Armata",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Arvo",
    category: "serif",
    variable: false,
  },
  {
    name: "Asap",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Asap Condensed",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Assistant",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Bangers",
    category: "handwritten",
    variable: false,
  },
  {
    name: "Barlow",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Barlow Condensed",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Barlow Semi Condensed",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Bebas Neue",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "BenchNine",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Bespoke",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Bitter",
    category: "serif",
    variable: true,
  },
  {
    name: "Bree Serif",
    category: "serif",
    variable: true,
  },
  {
    name: "Cabin",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Cabin Condensed",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Cairo",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Cantarell",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Cardo",
    category: "serif",
    variable: false,
  },
  {
    name: "Catamaran",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Caveat",
    category: "handwritten",
    variable: true,
  },
  {
    name: "Chakra Petch",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Changa",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Chivo",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Cinzel",
    category: "serif",
    variable: true,
  },
  {
    name: "Comfortaa",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Concert One",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Cookie",
    category: "calligraphy",
    variable: false,
  },
  {
    name: "Cormorant Garamond",
    category: "serif",
    variable: true,
  },
  {
    name: "Courgette",
    category: "calligraphy",
    variable: false,
  },
  {
    name: "Crete Round",
    category: "serif",
    variable: false,
  },
  {
    name: "Crimson Text",
    category: "serif",
    variable: false,
  },
  {
    name: "Cuprum",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Dancing Script",
    category: "calligraphy",
    variable: true,
  },
  {
    name: "Didact Gothic",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "DM Sans",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "DM Serif Display",
    category: "serif",
    variable: true,
  },
  {
    name: "Domine",
    category: "serif",
    variable: true,
  },
  {
    name: "Dosis",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "EB Garamond",
    category: "serif",
    variable: true,
  },
  {
    name: "Economica",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Exo",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Exo 2",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Figtree",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Fira Sans",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Fjalla One",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Francois One",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Frank Ruhl Libre",
    category: "serif",
    variable: true,
  },
  {
    name: "Gloria Hallelujah",
    category: "handwritten",
    variable: false,
  },
  {
    name: "Great Vibes",
    category: "calligraphy",
    variable: false,
  },
  {
    name: "Gudea",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Hammersmith One",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Handlee",
    category: "handwritten",
    variable: false,
  },
  {
    name: "Heebo",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Hind",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Hind Madurai",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Hind Siliguri",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "IBM Plex Mono",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "IBM Plex Sans",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "IBM Plex Serif",
    category: "serif",
    variable: true,
  },
  {
    name: "Inconsolata",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Indie Flower",
    category: "handwritten",
    variable: false,
  },
  {
    name: "Inter",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Istok Web",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Josefin Sans",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Jost",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Kalam",
    category: "handwritten",
    variable: false,
  },
  {
    name: "Kanit",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Karla",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Kaushan Script",
    category: "calligraphy",
    variable: false,
  },
  {
    name: "Lato",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Libre Baskerville",
    category: "serif",
    variable: false,
  },
  {
    name: "Libre Franklin",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Lilita One",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Lobster",
    category: "calligraphy",
    variable: false,
  },
  {
    name: "Lobster Two",
    category: "calligraphy",
    variable: false,
  },
  {
    name: "Lora",
    category: "serif",
    variable: true,
  },
  {
    name: "Luckiest Guy",
    category: "handwritten",
    variable: false,
  },
  {
    name: "M PLUS 1p",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "M PLUS Rounded 1c",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Manrope",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Martel",
    category: "serif",
    variable: true,
  },
  {
    name: "Maven Pro",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Merriweather",
    category: "serif",
    variable: true,
  },
  {
    name: "Merriweather Sans",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Monda",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Montserrat",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Montserrat Alternates",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Mukta",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Mulish",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Nanum Gothic",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Nanum Myeongjo",
    category: "serif",
    variable: false,
  },
  {
    name: "News Cycle",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Noticia Text",
    category: "serif",
    variable: false,
  },
  {
    name: "Noto Color Emoji",
    category: "fantasy",
    variable: false,
  },
  {
    name: "Noto Sans",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Noto Sans Arabic",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Noto Sans HK",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Noto Sans JP",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Noto Sans KR",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Noto Sans SC",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Noto Sans TC",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Noto Serif",
    category: "serif",
    variable: true,
  },
  {
    name: "Noto Serif JP",
    category: "serif",
    variable: true,
  },
  {
    name: "Nunito",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Nunito Sans",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Old Standard TT",
    category: "serif",
    variable: false,
  },
  {
    name: "Open Sans",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Orbitron",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Oswald",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Outfit",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Overpass",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Oxygen",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Pacifico",
    category: "calligraphy",
    variable: false,
  },
  {
    name: "Passion One",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Pathway Gothic One",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Patrick Hand",
    category: "handwritten",
    variable: false,
  },
  {
    name: "Patua One",
    category: "serif",
    variable: false,
  },
  {
    name: "Paytone One",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Permanent Marker",
    category: "handwritten",
    variable: false,
  },
  {
    name: "Philosopher",
    category: "serif",
    variable: false,
  },
  {
    name: "Play",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Playfair Display",
    category: "serif",
    variable: true,
  },
  {
    name: "Plus Jakarta Sans",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Poiret One",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Pontano Sans",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Poppins",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Prata",
    category: "serif",
    variable: true,
  },
  {
    name: "Prompt",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "PT Sans",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "PT Sans Narrow",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "PT Serif",
    category: "serif",
    variable: false,
  },
  {
    name: "Public Sans",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Quattrocento",
    category: "serif",
    variable: false,
  },
  {
    name: "Quattrocento Sans",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Questrial",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Quicksand",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Rajdhani",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Raleway",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Red Hat Display",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Righteous",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Roboto",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Roboto Condensed",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Roboto Mono",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Roboto Slab",
    category: "serif",
    variable: true,
  },
  {
    name: "Rokkitt",
    category: "serif",
    variable: true,
  },
  {
    name: "Ropa Sans",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Rubik",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Russo One",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Sacramento",
    category: "calligraphy",
    variable: false,
  },
  {
    name: "Saira Condensed",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Sanchez",
    category: "serif",
    variable: false,
  },
  {
    name: "Sarabun",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Satisfy",
    category: "calligraphy",
    variable: false,
  },
  {
    name: "Secular One",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Shadows Into Light",
    category: "handwritten",
    variable: false,
  },
  {
    name: "Signika",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Signika Negative",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Slabo 27px",
    category: "serif",
    variable: false,
  },
  {
    name: "Source Code Pro",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Source Sans 3",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Space Grotesk",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Special Elite",
    category: "handwritten",
    variable: false,
  },
  {
    name: "Tajawal",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Tangerine",
    category: "calligraphy",
    variable: false,
  },
  {
    name: "Teko",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Tinos",
    category: "serif",
    variable: false,
  },
  {
    name: "Titillium Web",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Ubuntu",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Ubuntu Condensed",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Varela Round",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Volkhov",
    category: "serif",
    variable: false,
  },
  {
    name: "Vollkorn",
    category: "serif",
    variable: true,
  },
  {
    name: "Work Sans",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Yanone Kaffeesatz",
    category: "sans-serif",
    variable: true,
  },
  {
    name: "Yantramanav",
    category: "sans-serif",
    variable: false,
  },
  {
    name: "Yellowtail",
    category: "calligraphy",
    variable: false,
  },
  {
    name: "Zilla Slab",
    category: "serif",
    variable: false,
  },
];
