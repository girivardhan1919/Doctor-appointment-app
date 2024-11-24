function sortAppointmentsByTime(appointments) {
  // If appointments array is empty, return it immediately
  if (appointments.length === 0) {
    return appointments;
  }
  
  return appointments.sort((a, b) => {
    const aStartTime = new Date(`1970-01-01T${a.timeSlot.split(' - ')[0]}:00`);
    const bStartTime = new Date(`1970-01-01T${b.timeSlot.split(' - ')[0]}:00`);

    return aStartTime - bStartTime;  // Sort by the start time
  });
}

module.exports = sortAppointmentsByTime