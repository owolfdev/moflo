export const formatCurrencyForDatabase = (amount: string) => {
  if (amount.includes(".")) {
    // If the input string has a decimal point, split it into whole and decimal parts
    const [wholePart, decimalPart] = amount.split(".")

    let formattedAmount = wholePart

    if (decimalPart.length === 1) {
      // If the decimal part has only one digit, add an extra zero
      formattedAmount += decimalPart + "0"
    } else {
      formattedAmount += decimalPart
    }

    if (formattedAmount.includes(",")) {
      // If the formatted amount has a comma, remove it
      formattedAmount = formattedAmount.replace(",", "")
    }

    return parseInt(formattedAmount)
  } else {
    // If the input string has no decimal point, parse it and add two zeros (multiply by 100)
    let formattedAmount = amount

    if (formattedAmount.includes(",")) {
      // If the formatted amount has a comma, remove it
      formattedAmount = formattedAmount.replace(",", "")
    }

    return parseInt(formattedAmount) * 100
  }
}
