

export function formatCurrency(value) {
    /**
     * Helper function converts string to currency representation
     */
    if (!value || isNaN(Number(value))) return "$0.00"; // Handle empty or invalid inputs gracefully

  // If the input is a number or numeric string, normalize it
  const normalizedValue = parseFloat(value);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return formatter.format(normalizedValue);
}


export function formatPhoneNumber(value) {

      /**
     * Helper function to format value as a phone number
     */


  // Remove all non-numeric characters
  const cleaned = value.split("").filter((char) => char >= "0" && char <= "9").join("");

  // Format the cleaned number
  let formatted = "";

  if (cleaned.length > 0) {
    formatted += "(" + cleaned.slice(0, 3); // Add area code
  }
  if (cleaned.length >= 4) {
    formatted += ") " + cleaned.slice(3, 6); // Add first 3 digits after area code
  }
  if (cleaned.length >= 7) {
    formatted += "-" + cleaned.slice(6, 10); // Add last 4 digits
  }

  return formatted;
}


export function allowOnlyNumbers(input) {
      /**
     * Helper function to remove non-numeric values (used for Quantity and Number of days formatting)
     */

  let numericText = "";
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (char >= "0" && char <= "9") {
      numericText += char;
    }
  }
  return numericText;
}