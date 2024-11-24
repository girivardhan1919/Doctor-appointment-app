const httpMocks = require('node-mocks-http');
const { appointmentMiddlewares } = require('../../src/middlewares');
const { StatusCodes } = require('http-status-codes');

describe('validateCreateAppointment Middleware', () => {
  it('should return 400 if required fields are missing', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        email: 'test@example.com',  // Missing required fields
        doctorName: 'Dr. Smith',
      },
    });

    const res = httpMocks.createResponse();

    // Call the middleware function
    await appointmentMiddlewares.validateCreateAppointment(req, res, () => { });

    // Assertions
    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(JSON.parse(res._getData())).toEqual({
      success: false,
      message: 'Invalid appointment creation request',
      data: {},
      error: {
        explanation: 'Missing required fields: patientFirstName, patientLastName, timeSlot',
        statusCode: StatusCodes.BAD_REQUEST,
      },
    });
  });

  it('should return 400 if email is invalid', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        patientFirstName: 'John',
        patientLastName: 'Doe',
        email: 'invalid-email',  // Invalid email
        doctorName: 'Dr. Smith',
        timeSlot: '10:00 AM - 11:00 AM',
      },
    });

    const res = httpMocks.createResponse();

    await appointmentMiddlewares.validateCreateAppointment(req, res, () => { });

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(JSON.parse(res._getData())).toEqual({
      success: false,
      message: 'Invalid appointment creation request',
      data: {},
      error: {
        explanation: 'email is not a valid email address.',
        statusCode: StatusCodes.BAD_REQUEST,
      },
    });
  });

  it('should call next() when all required fields are valid', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        patientFirstName: 'John',
        patientLastName: 'Doe',
        email: 'test@example.com',
        doctorName: 'Dr. Smith',
        timeSlot: '10:00 AM - 11:00 AM',
      },
    });

    const res = httpMocks.createResponse();
    const next = jest.fn();

    // Call the middleware function
    await appointmentMiddlewares.validateCreateAppointment(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});

describe('validateCancelAppointment Middleware', () => {
  it('should return 400 if required fields are missing', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        email: 'test@example.com',  // Missing timeSlot
      },
    });

    const res = httpMocks.createResponse();

    await appointmentMiddlewares.validateCancelAppointment(req, res, () => { });

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(JSON.parse(res._getData())).toEqual({
      success: false,
      message: 'Invalid appointment cancellation request',
      data: {},
      error: {
        explanation: 'Missing required fields: timeSlot',
        statusCode: StatusCodes.BAD_REQUEST,
      },
    });
  });

  it('should return 400 if email is invalid', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        email: 'invalid-email',  // Invalid email
        timeSlot: '10:00 AM - 11:00 AM',
      },
    });

    const res = httpMocks.createResponse();

    await appointmentMiddlewares.validateCancelAppointment(req, res, () => { });

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(JSON.parse(res._getData())).toEqual({
      success: false,
      message: 'Invalid appointment cancellation request',
      data: {},
      error: {
        explanation: 'email is not a valid email address.',
        statusCode: StatusCodes.BAD_REQUEST,
      },
    });
  });

  it('should call next() when all required fields are valid', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        email: 'test@example.com',
        timeSlot: '10:00 AM - 11:00 AM',
      },
    });

    const res = httpMocks.createResponse();
    const next = jest.fn();

    await appointmentMiddlewares.validateCancelAppointment(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});

describe('validateUpdateAppointment Middleware', () => {
  it('should return 400 if required fields are missing', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        email: 'test@example.com',  // Missing oldTimeSlot and newTimeSlot
      },
    });

    const res = httpMocks.createResponse();

    await appointmentMiddlewares.validateUpdateAppointment(req, res, () => { });

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(JSON.parse(res._getData())).toEqual({
      success: false,
      message: 'Invalid appointment update request',
      data: {},
      error: {
        explanation: 'Missing required fields: oldTimeSlot, newTimeSlot',
        statusCode: StatusCodes.BAD_REQUEST,
      },
    });
  });

  it('should return 400 if email is invalid', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        email: 'invalid-email',  // Invalid email
        oldTimeSlot: '10:00 AM - 11:00 AM',
        newTimeSlot: '11:00 AM - 12:00 PM',
      },
    });

    const res = httpMocks.createResponse();

    await appointmentMiddlewares.validateUpdateAppointment(req, res, () => { });

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(JSON.parse(res._getData())).toEqual({
      success: false,
      message: 'Invalid appointment update request',
      data: {},
      error: {
        explanation: 'email is not a valid email address.',
        statusCode: StatusCodes.BAD_REQUEST,
      },
    });
  });

  it('should call next() when all required fields are valid', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        email: 'test@example.com',
        oldTimeSlot: '10:00 AM - 11:00 AM',
        newTimeSlot: '11:00 AM - 12:00 PM',
      },
    });

    const res = httpMocks.createResponse();
    const next = jest.fn();

    await appointmentMiddlewares.validateUpdateAppointment(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});


