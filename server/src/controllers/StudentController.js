const { isValidObjectId } = require("mongoose");
const Student = require("./../models/StudentModel");

const createStudent = async (req, res) => {
  const {
    school_id,
    first_name,
    middle_name,
    last_name,
    suffix = "N/A",
    gender,
    birthdate,
    contact_number = "N/A",
    parent,
    address,
  } = req.body;

  const errorFields = [];
  let errorMessage = "Please fill in all fields";
  if (!school_id) errorFields.push("school_id");
  if (!first_name) errorFields.push("first_name");
  if (!last_name) errorFields.push("last_name");
  if (!gender) errorFields.push("gender");
  if (!birthdate) errorFields.push("birthdate");
  if (!parent) errorFields.push("parent");
  if (!address) errorFields.push("address");

  const student = await Student.findOne({ school_id });

  if (student) {
    errorFields.push("school_id");
    errorMessage = "Student ID already exist.";
  }

  if (errorFields.length > 0) {
    return res.status(400).json({ error: errorMessage, errorFields });
  }

  const newStudent = {
    school_id,
    first_name,
    middle_name,
    last_name,
    suffix,
    gender,
    birthdate,
    contact_number,
    parent,
    address,
  };

  try {
    const student = await Student.create(newStudent);
    return res.status(200).json(student);
  } catch (error) {
    return res.status(400).json({ error });
  }
};

const updateStudent = async (req, res) => {
  const { id } = req.params;
  const updated = req.body;

  if (!isValidObjectId(id)) {
    return res.status(404).json({ error: "No such student" });
  }

  await Student.findByIdAndUpdate({ _id: id }, { ...updated });
  const student = await Student.findById({ _id: id });
  return res.status(200).json(student);
};
module.exports = {
  createStudent,
  updateStudent,
};
