import { QuoteData } from "../../../util/Quote";

function QuotePreview({
  quoteData,
  className,
}: {
  quoteData: QuoteData;
  className?: string;
}) {
  return (
    <div
      className={`column w-full h-full gap-3 align-center justify-between ${className}`}
    >
      <div>{quoteData.quote.text}</div>
      <strong className="row w-full justify-end">
        {quoteData.quote.author}
      </strong>
    </div>
  );
}

export default QuotePreview;
