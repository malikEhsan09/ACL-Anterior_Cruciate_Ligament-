import Appointment from "../models/appointment.model.js"; // Corrected file extension

export const bookAppointment = async (req, res) => {
  const { doctor, doctorEmail, slot, type, status } = req.body;

  if (!doctor || !doctorEmail || !slot || !type) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newAppointment = new Appointment({
      doctor,
      doctorEmail,
      slot,
      type,
      status,
    });

    await newAppointment.save();

    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ message: "Error booking appointment", error });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error });
  }
};
