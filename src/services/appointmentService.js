const { StatusCodes } = require('http-status-codes');
const AppError = require("../utils/errors/appError");
const { Appointment } = require('../models');
const { SortTime } = require('../utils/common');
const { Logger } = require('../config');

const appointments = [];
const doctors = [
  { name: 'Dr.Smith', availableSlots: ['10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM'] },
  { name: 'Dr.Jones', availableSlots: ['01:00 PM - 02:00 PM', '02:00 PM - 03:00 PM'] },
];


class AppointmentService {
  constructor() {
    this.appointments = appointments;
    this.doctors = doctors;
  }

  findDoctorByName(doctorName) {
    if (!doctorName) {
      throw new AppError('Doctor name is required', StatusCodes.BAD_REQUEST);
    }
    const doctor = this.doctors.find(doc => doc.name === doctorName);
    if (!doctor) {
      throw new AppError('Doctor Not Found', StatusCodes.NOT_FOUND);
    }
    return doctor;
  }

  findAppointment(email, timeSlot, doctorName) {
    if (!email || !timeSlot || !doctorName) {
      throw new AppError('Email, timeslot and doctorName are required', StatusCodes.BAD_REQUEST);
    }
    return this.appointments.find(
      appointment =>
        appointment.email === email &&
        appointment.timeSlot === timeSlot &&
        appointment.doctorName === doctorName
    );
  }

  bookAppointment(data) {
    const doctor = this.findDoctorByName(data.doctorName);

    if (!doctor.availableSlots.includes(data.timeSlot)) {
      throw new AppError('Time Slot Not Available', StatusCodes.BAD_REQUEST);
    }

    const existingAppointment = this.findAppointment(data.email, data.timeSlot, data.doctorName);
    if (existingAppointment) {
      Logger.error('Appointment already exists for the specified time slot');
      throw new AppError('Appointment already exists for the specified time slot', StatusCodes.CONFLICT);
    }

    const appointment = new Appointment(
      data.patientFirstName,
      data.patientLastName,
      data.email,
      data.timeSlot,
      data.doctorName
    );
    this.appointments.push(appointment);
    doctor.availableSlots = doctor.availableSlots.filter(slot => slot !== data.timeSlot);
    return appointment;
  }

  getAppointments(data) {

    // Check if neither email nor doctorName is provided
    if (!data.email && !data.doctorName) {
      throw new AppError('Either email or doctorName must be provided', StatusCodes.BAD_REQUEST);
    }

    let appointmentsByEmail = [];
    let appointmentsByDoctor = [];

    // If email is provided, search by email
    if (data.email) {
      appointmentsByEmail = this.appointments.filter(appt => appt.email === data.email);
      if (appointmentsByEmail.length === 0) {
        throw new AppError('No appointments found for the given email', StatusCodes.NOT_FOUND);
      }
    }

    // If doctorName is provided, search by doctorName
    if (data.doctorName) {
      appointmentsByDoctor = this.appointments.filter(appt => appt.doctorName === data.doctorName);
      if (appointmentsByDoctor.length === 0) {
        throw new AppError('No appointments found for the given doctor', StatusCodes.NOT_FOUND);
      }
    }

    return SortTime(appointmentsByEmail.concat(appointmentsByDoctor));
  }



  cancelAppointment(data) {
    const appointmentIndex = this.appointments.findIndex(
      appointment =>
        appointment.email === data.email &&
        appointment.timeSlot === data.timeSlot
    );

    if (appointmentIndex === -1) {
      throw new AppError('Appointment Not Found', StatusCodes.NOT_FOUND);
    }

    // Free up the slot for the doctor
    const [removedAppointment] = this.appointments.splice(appointmentIndex, 1);

    const doctor = this.findDoctorByName(removedAppointment.doctorName);
    if (!doctor.availableSlots.includes(removedAppointment.timeSlot)) {
      doctor.availableSlots.push(removedAppointment.timeSlot);
      doctor.availableSlots.sort();  // Sort the slots
    }

    return removedAppointment;
  }

  modifyAppointment(data) {
    const appointment = this.appointments.find(
      appointment =>
        appointment.email === data.email &&
        appointment.timeSlot === data.oldTimeSlot
    );
    if (!appointment) {
      throw new AppError('Appointment not found', StatusCodes.NOT_FOUND);
    }

    const doctor = this.findDoctorByName(appointment.doctorName);

    if (!doctor.availableSlots.includes(data.newTimeSlot)) {
      throw new AppError('Doctor is not available at the new time slot', StatusCodes.BAD_REQUEST);
    }

    // Update the time slot
    appointment.timeSlot = data.newTimeSlot;

    // Adjust the doctor's available slots
    doctor.availableSlots.push(data.oldTimeSlot);
    doctor.availableSlots = doctor.availableSlots.filter(slot => slot !== data.newTimeSlot);
    doctor.availableSlots.sort();

    return appointment;
  }
}

module.exports = AppointmentService;
