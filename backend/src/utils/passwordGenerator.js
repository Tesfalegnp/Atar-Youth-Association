/**
 * Generate a safe, compliant temporary password for new members.
 * Default Pattern: MiddleName + A123
 * Example: "John Deng Mabior" -> "DengA123"
 */
const generateTemporaryPassword = (fullName = '') => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  let middleName = '';

  if (parts.length >= 3) {
    // If 3 or more names (First, Middle, Last), pick middle name
    middleName = parts[1];
  } else if (parts.length === 2) {
    // If 2 names, use first name as base
    middleName = parts[0];
  } else if (parts.length === 1) {
    // Single name
    middleName = parts[0];
  } else {
    middleName = 'Youth';
  }

  // Clean and normalize name (only letters)
  let cleanName = middleName.replace(/[^a-zA-Z]/g, '');
  if (!cleanName) {
    cleanName = 'Youth';
  }

  // Capitalize first letter, lowercase rest
  const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1).toLowerCase();

  // Pattern: MiddleName + A123
  const temporaryPassword = `${formattedName}A123`;

  return {
    temporaryPassword,
    baseName: formattedName
  };
};

module.exports = {
  generateTemporaryPassword
};
