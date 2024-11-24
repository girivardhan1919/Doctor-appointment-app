class Appointment{
  constructor(patientFirstName, patientLastName, email, timeSlot, doctorName){
    this.patientFirstName = patientFirstName;
    this.patientLastName = patientLastName;
    this.email = email;
    this.timeSlot = timeSlot;
    this.doctorName = doctorName;
  }
}

module.exports = Appointment;