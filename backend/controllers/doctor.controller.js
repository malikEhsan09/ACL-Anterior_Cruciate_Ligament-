import Doctor from "../models/doctor.model.js";
import User from "../models/user.model.js";
import DoctorSchedule from "../models/doctorSchedule.model.js";
import Appointment from "../models/appointment.model.js";

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctors", error });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate("userID");
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctor", error });
  }
};

export const createDoctor = async (req, res) => {
  // const { userID } = req.params;
  const {
    userID,
    name,
    medicalLicenseNo,
    gender,
    specialization,
    // adminID,   later on creating with admin ID
    rating,
    numberOfRating,
    verified,
    slots,
    aslots,
  } = req.body;

  if (
    !userID ||
    !name ||
    !medicalLicenseNo ||
    !gender ||
    !specialization ||
    !specialization ||
    !rating ||
    !numberOfRating ||
    !verified ||
    !slots ||
    !aslots
  ) {
    return res.status(400).json({
      message:
        "Some of field are missng check those fields and then process this !!",
    });
  }

  try {
    const newDoctor = new Doctor({
      userID,
      name,
      medicalLicenseNo,
      gender,
      specialization,
      rating,
      numberOfRating,
      verified,
      slots,
      aslots,
    });
    await newDoctor.save();
    res.status(201).json(newDoctor);
  } catch (error) {
    res.status(500).json({ message: "Error creating doctor", error });
  }
};

export const updateDoctor = async (req, res) => {
  const updates = req.body;
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Error updating doctor", error });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json({ message: "Doctor deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting doctor", error });
  }
};

// Create or update doctor schedule
export const createOrUpdateSchedule = async (req, res) => {
  try {
    const { doctorID, slots } = req.body;

    const schedule = await DoctorSchedule.findOneAndUpdate(
      { doctorID },
      { slots },
      { new: true, upsert: true }
    );

    res
      .status(200)
      .json({ message: "Schedule updated successfully", schedule });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get doctor schedule
export const getDoctorSchedule = async (req, res) => {
  try {
    const { doctorID } = req.params;
    const schedule = await DoctorSchedule.findOne({ doctorID });

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    res.status(200).json(schedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all appointments for a doctor
export const getDoctorAppointments = async (req, res) => {
  try {
    const { doctorID } = req.params;
    const appointments = await Appointment.find({ doctorID }).populate(
      "playerID"
    );

    if (!appointments) {
      return res.status(404).json({ message: "Appointments not found" });
    }

    res.status(200).json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// Doctor cancels an appointment
export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentID } = req.params;
    const appointment = await Appointment.findByIdAndDelete(appointmentID);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment canceled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
