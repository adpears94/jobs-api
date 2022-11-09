const Job = require("../models/Job");
const User = require("../models/User");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
  res.status(200).send({ jobs, count: jobs.length });
};
const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id },
  } = req;
  try {
    const job = await Job.findById({ _id: id, createdBy: userId });
    if (!job) {
      return res.status(404).send({ msg: "Job not found" });
    }
    res.status(200).send(job);
  } catch (err) {
    res.status(400).send(err);
  }
};
const createJob = async (req, res) => {
  try {
    let user = await User.findById(req.user.userId);
    let job = req.body;
    job.createdBy = user._id;
    console.log(job);
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    const inputJob = await Job.create(job);
    res
      .status(201)
      .json(
        `job ${inputJob.company} has created the   ${inputJob.position} position`
      );
  } catch (err) {
    res.status(400).send(err);
  }
};

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id },
  } = req;
  try {
    if (!company || !position) {
      return res.status(401).json({ msg: "Please enter all fields" });
    }
    const job = await Job.findOneAndUpdate(
      { _id: id, createdBy: userId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!job) {
      return res.status(404).send({ msg: "Job not found" });
    }
    res.status(200).send(job);
  } catch (err) {
    res.status(400).send(err);
  }
};
const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id },
  } = req;

  try {
    const job = await Job.findOne({ _id: id, createdBy: userId });
    if (!job) {
      return res.status(404).send({ msg: "Job not found" });
    }
    if (job["createdBy"].toString() !== req.user.userId) {
      return res.status(401).json({ msg: "Not authorized" });
    }
    
    const removedJob = await Job.findByIdAndDelete({ _id: id });

    res.send(`You have delete ${removedJob} job`);
  } catch (err) {
    res.status(400).send(err);
  }
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
