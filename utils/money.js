/**
 * Get currency prefix.
 */
const getPrefix = (
  // Currency symbol.
  symbol,
  // Position of currency symbol from settings.
  symbolPosition
) => {
  const prefixes = {
    left: symbol,
    left_space: " " + symbol,
    right: "",
    right_space: "",
  };
  return prefixes[symbolPosition] || "";
};

/**
 * Get currency suffix.
 */
const getSuffix = (
  // Currency symbol.
  symbol,
  // Position of currency symbol from settings.
  symbolPosition
) => {
  const suffixes = {
    left: "",
    left_space: "",
    right: symbol,
    right_space: " " + symbol,
  };
  return suffixes[symbolPosition] || "";
};

/**
 * Gets currency information in normalized format from an API response or the server.
 */
export const getCurrencyFromPriceResponse = (
  // Currency data object, for example an API response containing currency formatting data.
  currencyData
) => {
  const {
    currency_code: code,
    currency_symbol: symbol,
    currency_thousand_separator: thousandSeparator,
    currency_decimal_separator: decimalSeparator,
    currency_minor_unit: minorUnit,
    currency_prefix: prefix,
    currency_suffix: suffix,
  } = currencyData;

  return {
    code: code || "USD",
    symbol: symbol || "$",
    thousandSeparator:
      typeof thousandSeparator === "string" ? thousandSeparator : ",",
    decimalSeparator:
      typeof decimalSeparator === "string" ? decimalSeparator : ".",
    minorUnit: Number.isFinite(minorUnit) ? minorUnit : 2,
    prefix: typeof prefix === "string" ? prefix : "$",
    suffix: typeof suffix === "string" ? suffix : "",
  };
};

/**
 * Format a price, provided using the smallest unit of the currency, as a
 * decimal complete with currency symbols using current store settings.
 */
export const formatPrice = (
  // Price in minor unit, e.g. cents.
  price,
  currency
) => {
  if (price === "" || price === undefined) {
    return "";
  }

  const priceInt = typeof price === "number" ? price : parseInt(price, 10);

  if (!Number.isFinite(priceInt)) {
    return "";
  }

  const formattedPrice = priceInt / 10 ** currency.minorUnit;
  const formattedValue = currency.prefix + formattedPrice + currency.suffix;

  return formattedValue;
};
