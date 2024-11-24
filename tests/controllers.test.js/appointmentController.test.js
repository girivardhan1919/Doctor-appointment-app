const httpMocks = require('node-mocks-http');
const { StatusCodes } = require('http-status-codes');
const AppointmentService = require('../../src/services/appointmentService');
const appointmentController = require('../../src/controllers/appointmentController');

// Mock the AppointmentService methods
jest.mock('../../src/services/appointmentService');

describe('AppointmentController Tests', () => {
 
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('bookAppointment', () => {
    it('should successfully book an appointment', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        body: {
          patientFirstName: 'sai',
          patientLastName: 'daggupati',
          email: 'a@gmail.co',
          timeSlot: '11:00 AM - 12:00 PM',
          doctorName: 'Dr.Smith',
        },
      });

      const res = httpMocks.createResponse();

      const mockAppointment = {
        patientFirstName: 'sai',
        patientLastName: 'daggupati',
        email: 'a@gmail.co',
        timeSlot: '11:00 AM - 12:00 PM',
        doctorName: 'Dr.Smith',
      };

      // Mock the AppointmentService
      jest.spyOn(AppointmentService.prototype, 'bookAppointment').mockResolvedValue(mockAppointment);

      await appointmentController.bookAppointment(req, res);

      expect(res.statusCode).toBe(StatusCodes.CREATED);
      expect(JSON.parse(res._getData())).toEqual({
        success: true,
        message: 'Doctor Appointment has been Booked Successfully',
        data: mockAppointment,
        error: {},
      });
      expect(AppointmentService.prototype.bookAppointment).toHaveBeenCalledWith(req.body);
    });

    it('should throw an error when booking appointment fails', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        body: {},
      });

      const res = httpMocks.createResponse();

      await appointmentController.bookAppointment(req, res);

      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(JSON.parse(res._getData())).toEqual({
        success: false,
        message: 'Something went wrong',
        data: {},
        error: {
          explanation: 'Appointment Details are required',
          statusCode: StatusCodes.BAD_REQUEST,
        },
      });
    });
  });

  describe('getAppointmentByEmail', () => {
    it('should return appointments for a valid email', async () => {
      const req = httpMocks.createRequest({
        method: 'GET',
        query: { email: 'john.doe@example.com' },
      });

      const res = httpMocks.createResponse();

      const mockAppointments = [
        {
          patientFirstName: 'John',
          patientLastName: 'Doe',
          email: 'john.doe@example.com',
          doctorName: 'Dr.Smith',
          timeSlot: '10:00 AM - 11:00 AM',
        },
      ];

      jest.spyOn(AppointmentService.prototype, 'getAppointments').mockResolvedValue(mockAppointments);

      await appointmentController.getAppointmentByEmail(req, res);

      expect(res.statusCode).toBe(StatusCodes.OK);
      expect(JSON.parse(res._getData())).toEqual({
        success: true,
        message: 'Successfully fetched the appointment details',
        data: mockAppointments,
        error: {},
      });
      expect(AppointmentService.prototype.getAppointments).toHaveBeenCalledWith({ email: 'john.doe@example.com' });
    });

    it('should return 400 when no email is provided', async () => {
      const req = httpMocks.createRequest({
        method: 'GET',
        query: {},
      });

      const res = httpMocks.createResponse();

      await appointmentController.getAppointmentByEmail(req, res);

      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(JSON.parse(res._getData())).toEqual({
        success: false,
        message: 'Something went wrong',
        data: {},
        error: {
          explanation: 'Email is required',
          statusCode: StatusCodes.BAD_REQUEST,
        },
      });
    });
  });

  describe('getAppointmentsByDoctor', () => {
    it('should successfully return appointments for a valid doctor name', async () => {
      const req = httpMocks.createRequest({
        method: 'GET',
        query: { doctorName: 'Dr.Smith' },
      });

      const res = httpMocks.createResponse();

      const mockAppointments = [
        {
          patientFirstName: 'John',
          patientLastName: 'Doe',
          email: 'john.doe@example.com',
          doctorName: 'Dr.Smith',
          timeSlot: '10:00 AM - 11:00 AM',
        },
      ];

      jest.spyOn(AppointmentService.prototype, 'getAppointments').mockResolvedValue(mockAppointments);

      await appointmentController.getAppointmentsByDoctor(req, res);

      expect(res.statusCode).toBe(StatusCodes.OK);
      expect(JSON.parse(res._getData())).toEqual({
        success: true,
        message: 'Successfully fetched the appointment details',
        data: mockAppointments,
        error: {},
      });
      expect(AppointmentService.prototype.getAppointments).toHaveBeenCalledWith({ doctorName: 'Dr.Smith' });
    });

    it('should return 400 when doctor name is not provided', async () => {
      const req = httpMocks.createRequest({
        method: 'GET',
        query: {},
      });

      const res = httpMocks.createResponse();

      await appointmentController.getAppointmentsByDoctor(req, res);

      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(JSON.parse(res._getData())).toEqual({
        success: false,
        message: 'Something went wrong',
        data: {},
        error: {
          explanation: 'Doctor name is required',
          statusCode: StatusCodes.BAD_REQUEST,
        },
      });
    });
  });

  describe('cancelAppointment', () => {
    it('should successfully cancel an appointment', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        body: {
          email: 'john.doe@example.com',
          doctorName: 'Dr.Smith',
          timeSlot: '10:00 AM - 11:00 AM',
        },
      });

      const res = httpMocks.createResponse();

      const mockAppointment = {
        patientFirstName: 'John',
        patientLastName: 'Doe',
        email: 'john.doe@example.com',
        doctorName: 'Dr.Smith',
        timeSlot: '10:00 AM - 11:00 AM',
      };

      jest.spyOn(AppointmentService.prototype, 'cancelAppointment').mockResolvedValue(mockAppointment);

      await appointmentController.cancelAppointment(req, res);

      expect(res.statusCode).toBe(StatusCodes.OK);
      expect(JSON.parse(res._getData())).toEqual({
        success: true,
        message: 'Doctor Appointement has been cancelled',
        data: mockAppointment,
        error: {},
      });
      expect(AppointmentService.prototype.cancelAppointment).toHaveBeenCalledWith(req.body);
    });

  

    it('should return 400 if appointment details are missing', async () => {
      const req = httpMocks.createRequest({
        method: 'POST',
        body: {},
      });

      const res = httpMocks.createResponse();

      await appointmentController.cancelAppointment(req, res);

      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(JSON.parse(res._getData())).toEqual({
        success: false,
        message: 'Something went wrong',
        data: {},
        error: {
          explanation: "Appointment cancellation Details are required",
          statusCode: StatusCodes.BAD_REQUEST,
        },
      });
    });


  });


});
