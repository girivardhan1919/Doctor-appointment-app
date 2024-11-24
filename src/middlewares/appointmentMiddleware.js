const { StatusCodes } = require('http-status-codes');

const { ErrorResponse } = require('../utils/common');
const AppError = require('../utils/errors/appError');

// Helper function to validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(email);
}

function validateFields(reqBody, requiredFields, constraints = {}) {
  const missingFields = requiredFields.filter(field => !reqBody[field]);

  if (missingFields.length > 0) {
    throw new AppError(
      `Missing required fields: ${missingFields.join(', ')}`,
      StatusCodes.BAD_REQUEST
    );
  }

  for (const [field, rules] of Object.entries(constraints)) {
    if (rules.minLength && reqBody[field] && reqBody[field].length < rules.minLength) {
      throw new AppError(
        `${field} must be at least ${rules.minLength} characters long.`,
        StatusCodes.BAD_REQUEST
      );
    }

    if (rules.isEmail && reqBody[field] && !isValidEmail(reqBody[field])) {
      throw new AppError(
        `${field} is not a valid email address.`,
        StatusCodes.BAD_REQUEST
      );
    }
  }
}

function validateCreateAppointment(req, res, next) {
  try {
    validateFields(req.body,
      ['patientFirstName', 'patientLastName', 'email', 'doctorName', 'timeSlot'],
      {
        patientFirstName: { minLength: 3 },
        patientLastName: { minLength: 3 },
        email: { isEmail: true },
        doctorName: { minLength: 3}
      }
    );
    next();
  } catch (error) {
    ErrorResponse.message = 'Invalid appointment creation request';
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

function validateCancelAppointment(req, res, next) {
  try {
    validateFields(req.body,
      ['email', 'timeSlot'],
      { email: { isEmail: true } }
    );
    next();
  } catch (error) {
    ErrorResponse.message = 'Invalid appointment cancellation request';
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

function validateUpdateAppointment(req, res, next) {
  try {
    validateFields(req.body,
      ['email', 'oldTimeSlot', 'newTimeSlot'],
      { email: { isEmail: true } }
    );
    next();
  } catch (error) {
    ErrorResponse.message = 'Invalid appointment update request';
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

module.exports = {
  validateCreateAppointment,
  validateCancelAppointment,
  validateUpdateAppointment
};
