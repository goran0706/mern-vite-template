'use strict';

/**
 * Get unique error field name
 */
const getUniqueErrorMessage = err => {
  try {
    const fieldName = err.message.substring(
      err.message.lastIndexOf('.$') + 2,
      err.message.lastIndexOf('_1'),
    );
    return (
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists'
    );
  } catch (ex) {
    return 'Unique field already exists';
  }
};

/**
 * Get the error message from the error object
 */
const getErrorMessage = err => {
  if (err.code === 11000 || err.code === 11001) {
    return getUniqueErrorMessage(err);
  }

  return err.message || 'Something went wrong';
};

export default { getErrorMessage };
