const {AppointmentService} = require('../../src/services');
const AppError = require('../../src/utils/errors/appError');

describe('AppointmentService', () => {
  let service;

  beforeEach(() => {
    service = new AppointmentService();
  });

  describe('findDoctorByName', () => {
    it('should throw an error if doctor name is not provided', () => {
      expect(() => service.findDoctorByName()).toThrow(AppError);
      expect(() => service.findDoctorByName()).toThrowError('Doctor name is required');
    });

    it('should throw an error if doctor is not found', () => {
      expect(() => service.findDoctorByName('Dr.Unknown')).toThrow(AppError);
      expect(() => service.findDoctorByName('Dr.Unknown')).toThrowError('Doctor Not Found');
    });

    it('should return doctor if doctor is found', () => {
      const doctor = service.findDoctorByName('Dr.Smith');
      expect(doctor).toEqual({ name: 'Dr.Smith', availableSlots: ['10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM'] });
    });
  });

  describe('findAppointment', () => {
    it('should throw an error if any of the required fields are missing', () => {
      expect(() => service.findAppointment('test@example.com')).toThrow(AppError);
      expect(() => service.findAppointment('test@example.com')).toThrowError('Email, timeslot and doctorName are required');
    });

    it('should return the appointment if found', () => {
      const appointmentData = { email: 'test@example.com', timeSlot: '10:00 AM - 11:00 AM', doctorName: 'Dr.Smith' };
      service.bookAppointment(appointmentData);
      const appointment = service.findAppointment('test@example.com', '10:00 AM - 11:00 AM', 'Dr.Smith');
      expect(appointment).toBeDefined();
      expect(appointment.email).toBe('test@example.com');
    });

    it('should return undefined if appointment is not found', () => {
      const appointment = service.findAppointment('test@example.com', '10:00 AM - 11:00 AM', 'Dr.Unknown');
      expect(appointment).toBeUndefined();
    });
  });

  describe('bookAppointment', () => {
    it('should throw an error if doctor is not available at the given time slot', () => {
      const data = { patientFirstName: 'John', patientLastName: 'Doe', email: 'test@example.com', timeSlot: '03:00 PM - 04:00 PM', doctorName: 'Dr.Smith' };
      expect(() => service.bookAppointment(data)).toThrow(AppError);
      expect(() => service.bookAppointment(data)).toThrowError('Time Slot Not Available');
    });

    it('should throw an error if appointment already exists for the given time slot', () => {
      const data = { patientFirstName: 'John', patientLastName: 'Doe', email: 'test@example.com', 
        timeSlot: '03:00 PM - 04:00 PM', doctorName: 'Dr.Smith' };
     
      expect(() => service.bookAppointment(data)).toThrow(AppError);
      expect(() => service.bookAppointment(data)).toThrowError('Time Slot Not Available');
    });

    it('should book an appointment successfully if doctor is available and no conflicts', () => {
      const data = { patientFirstName: 'Jane', patientLastName: 'Doe', email: 'jane@example.com', timeSlot: '11:00 AM - 12:00 PM', doctorName: 'Dr.Smith' };
      const appointment = service.bookAppointment(data);
      expect(appointment).toBeDefined();
      expect(appointment.email).toBe('jane@example.com');
      expect(appointment.timeSlot).toBe('11:00 AM - 12:00 PM');
    });
  });


  describe('getAppointments', () => {
    it('should throw an error if neither email nor doctorName is provided', () => {
      expect(() => service.getAppointments({})).toThrow(AppError);
      expect(() => service.getAppointments({})).toThrowError('Either email or doctorName must be provided');
    });

    it('should return appointments for a given email', () => {
      const data = { email: 'test@example.com' };
      const appointments = service.getAppointments(data);
      expect(appointments).toBeInstanceOf(Array);
      expect(appointments.length).toBeGreaterThan(0);
    });

    it('should return appointments for a given doctorName', () => {
      const data = { doctorName: 'Dr.Smith' };
      const appointments = service.getAppointments(data);
      expect(appointments).toBeInstanceOf(Array);
      expect(appointments.length).toBeGreaterThan(0);
    });

    it('should return appointments that match both email and doctorName', () => {
      const data = { email: 'test@example.com', doctorName: 'Dr.Smith' };
      const appointments = service.getAppointments(data);
      expect(appointments).toBeInstanceOf(Array);
      expect(appointments.length).toBeGreaterThan(0);
    });
  });

  describe('cancelAppointment', () => {

    it('should successfully cancel the appointment and free up the slot', () => {
      const data = { patientFirstName: 'John', patientLastName: 'Doe', email: 'test@example.com', timeSlot: '10:00 AM - 11:00 AM', doctorName: 'Dr.Smith' };
      service.bookAppointment(data);
      const canceledAppointment = service.cancelAppointment({ email: 'test@example.com', timeSlot: '10:00 AM - 11:00 AM' });
      expect(canceledAppointment).toBeDefined();
      expect(canceledAppointment.email).toBe('test@example.com');
    });
  });

  describe('modifyAppointment', () => {
    it('should throw an error if the appointment to modify is not found', () => {
      const data = { email: 'test@example.com', oldTimeSlot: '10:00 AM - 11:00 AM', newTimeSlot: '02:00 PM - 03:00 PM' };
      expect(() => service.modifyAppointment(data)).toThrow(AppError);
      expect(() => service.modifyAppointment(data)).toThrowError('Appointment not found');
    });


  });

});
