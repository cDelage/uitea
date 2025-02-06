import { FieldValues, FieldErrors, FieldError } from "react-hook-form";

/** Permet de vérifier si la valeur courante est un FieldError final */
function isFieldError(value: unknown): value is FieldError {
  return (
    typeof value === "object" &&
    value !== null &&
    ("message" in value || "types" in value)
  );
}

export function getAllErrorMessages<TFieldValues extends FieldValues>(
  errors: FieldErrors<TFieldValues>
): string[] {
  let messages: string[] = [];

  for (const key in errors) {
    const errorOrNested = errors[key];

    if (isFieldError(errorOrNested)) {
      if (errorOrNested.message) {
        messages.push(errorOrNested.message);
      }
      if (errorOrNested.types) {
        const stringMessages = Object.values(errorOrNested.types).filter(
          (val): val is string => typeof val === "string"
        );
        messages = messages.concat(stringMessages);
      }
    } else if (errorOrNested && typeof errorOrNested === "object") {
      messages = messages.concat(
        getAllErrorMessages(errorOrNested as FieldErrors<TFieldValues>)
      );
    }
  }

  //Filtre les messages dupliqués
  return messages.filter(
    (errorMessage, index, array) => array.indexOf(errorMessage) === index
  );
}
