const ValuesDisplay = ({ labels, values }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
      {labels.map((label, i) => {
        const value = values[label];
        const isNumeric = typeof value === "number";
        const isTimeOrDate = /time|date/i.test(label); // Match labels like "Time" or "Date"

        let displayValue = value ?? "-";
        if (isNumeric) {
          if (isTimeOrDate) {
            displayValue = Math.floor(value); // or use `Math.round(value)` if preferred
          } else {
            displayValue = value.toFixed(2);
          }
        }

        return (
          <div key={i} className="p-2 bg-gray-800 rounded text-center">
            <div className="text-xs text-gray-400">{label}</div>
            <div className="text-lg font-mono">{displayValue}</div>
          </div>
        );
      })}
    </div>
  );
};



export default ValuesDisplay;
