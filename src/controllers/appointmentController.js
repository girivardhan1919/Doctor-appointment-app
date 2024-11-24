const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/appError');
const { AppointmentService } = require('../services');
const { SuccessResponse, ErrorResponse } = require('../utils/common');

const appointementService = new AppointmentService();

async function bookAppointment(req, res) {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new AppError('Appointment Details are required', StatusCodes.BAD_REQUEST);
    }
    const bookedAppointment = await appointementService.bookAppointment(req.body);
    SuccessResponse.message = 'Doctor Appointment has been Booked Successfully';
    SuccessResponse.data = bookedAppointment;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

async function getAppointmentByEmail(req, res) {
  try {
    const { email } = req.query;
    if (!email) {
      throw new AppError('Email is required', StatusCodes.BAD_REQUEST);
    }
    const appointment = await appointementService.getAppointments({email: email});
    SuccessResponse.message = "Successfully fetched the appointment details";
    SuccessResponse.data = appointment;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}


async function getAppointmentsByDoctor(req, res) {
  try {
    const { doctorName } = req.query;
    if (!doctorName) {
      throw new AppError('Doctor name is required', StatusCodes.BAD_REQUEST);
    }
    const appointments = await appointementService.getAppointments({doctorName: doctorName});
    SuccessResponse.message = "Successfully fetched the appointment details";
    SuccessResponse.data = appointments;
    res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

async function cancelAppointment(req, res) {
  try {
    if (!req.body || !req.body.email || !req.body.timeSlot ) {
      throw new AppError('Appointment cancellation Details are required', StatusCodes.BAD_REQUEST);
    }
    const appointment = await appointementService.cancelAppointment(req.body);
    if (!appointment) {
       throw new AppError('Invalid Appointment Details', StatusCodes.BAD_REQUEST);
    }
    SuccessResponse.message = 'Doctor Appointement has been cancelled';
    SuccessResponse.data = appointment;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    res.status(error.statusCode).json(ErrorResponse);
  }
}

async function modifyAppointment(req, res) {
  try {
    if (!req.body) {
      throw new AppError('Appointment details are required', StatusCodes.BAD_REQUEST);
    }
    const updatedAppointment = await appointementService.modifyAppointment(req.body);
    SuccessResponse.message = 'Doctor Appointment Time slot has been changed Successfully'
    SuccessResponse.data = updatedAppointment;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

module.exports = {
  bookAppointment,
  getAppointmentByEmail,
  getAppointmentsByDoctor,
  cancelAppointment,
  modifyAppointment
}