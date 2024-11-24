const express = require('express');
const { appointmentMiddlewares } = require('../../middlewares');
const { appointmentController } = require('../../controllers');
const router = express.Router();

router.post('/appointment', 
  appointmentMiddlewares.validateCreateAppointment, 
  appointmentController.bookAppointment
);

router.get('/appointment-by-email', 
  appointmentController.getAppointmentByEmail
);

router.get('/appointment-by-doctor', 
  appointmentController.getAppointmentsByDoctor
);

router.delete('/appointment', 
  appointmentMiddlewares.validateCancelAppointment, 
  appointmentController.cancelAppointment
);

router.put('/appointment', 
  appointmentMiddlewares.validateUpdateAppointment, 
  appointmentController.modifyAppointment
);


module.exports = router;