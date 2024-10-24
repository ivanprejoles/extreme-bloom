import { type Table } from "@tanstack/react-table"

export function exportTableToCSV<TData>(
  table: Table<TData>,
  opts: {
    filename?: string
    excludeColumns?: (keyof TData | "select" | "actions")[]
    onlySelected?: boolean
  } = {}
): void {
  const { filename = "table", excludeColumns = [], onlySelected = false } = opts

  // Retrieve headers (column names)
  const headers = table
    .getAllLeafColumns()
    .map((column) => column.id)
    .filter((id) => !excludeColumns.includes(id as keyof TData))

  // Build CSV content
  const csvContent = [
    headers.join(","), // Join headers with commas
    ...(onlySelected
      ? table.getFilteredSelectedRowModel().rows
      : table.getRowModel().rows
    ).map((row: { getValue: (arg0: string) => any }) =>
      headers
        .map((header) => {
          const cellValue = row.getValue(header)
          
          // Check if the cell value is an object or array
          if (typeof cellValue === "object" && cellValue !== null) {
            // Stringify objects and arrays to ensure they are properly formatted
            return `"${JSON.stringify(cellValue).replace(/"/g, '""')}"`
          }
          
          // Handle string values, escaping double quotes
          if (typeof cellValue === "string") {
            return `"${cellValue.replace(/"/g, '""')}"`
          }
          
          // Return other values (e.g., numbers, booleans) as is
          return cellValue
        })
        .join(",") // Join cell values with commas
    ),
  ].join("\n") // Join all rows with newlines

  // Create a Blob with CSV content
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })

  // Create a link and trigger the download
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
