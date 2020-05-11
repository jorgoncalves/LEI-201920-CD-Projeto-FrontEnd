export const required = (value) => value.trim() !== '';

export const numeric = (value) => 
  /^[0-9]+(\.[0-9]{0,2})?$/.test(
    value
  );
