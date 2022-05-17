export const debounce = (fn: Function, delay = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
};

export const validateUsZipCode = (zipCode: string) => {
  let errorMessage;
  if (zipCode === "") {
    errorMessage = undefined;
  } else if (isNaN(parseInt(zipCode, 10))) {
    errorMessage = "Only numbers are allowed";
  } else if (!/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zipCode)) {
    errorMessage = "Please specify a valid US zip code";
  }

  return errorMessage;
};
