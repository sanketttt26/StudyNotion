const Course = require("../models/Course");
const Section = require("../models/Section");

exports.createSection = async (req, res) => {
  try {
    //fetch data
    const { sectionName, courseId } = req.body;

    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: true,
        message: "Error while fetching data",
      });
    }
    //validation
    //createSection
    const newSection = await Section.create({ sectionName });
    //update to course
    const updatedCourseDetails = await Course.findOneAndUpdate(
      { _id: courseId },
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    );
    //response
    return res.status(200).json({
      success: true,
      message: "Section created successfully",
      updatedCourseDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while creating section",
      error: error.message,
    });
  }
};

exports.updateSection = async (req, res) => {
  try {
    //fetch data
    const { sectionName, sectionId } = req.body;

    //validation
    if (!sectionId || !sectionName) {
      return res.status(400).json({
        success: true,
        message: "Error while fetching data",
      });
    }
    //update
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );
    //
    return res.status(200).json({
      success: true,
      message: "Section data updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while updating section",
      error: error.message,
    });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    await Section.findByIdAndDelete(sectionId);
    //TODO need to delte the entry to course schema
    res.status(200).json({
      success: true,
      message: "Section data deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while deleting section",
      error: error.message,
    });
  }
};
