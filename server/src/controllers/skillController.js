import Skill from '../models/Skill.js';

// @desc    Get all skills (with optional search query & category filter)
// @route   GET /api/skills
export const getSkills = async (req, res, next) => {
  try {
    const { keyword, category, proficiencyLevel } = req.query;
    let query = {};

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (proficiencyLevel) {
      query.proficiencyLevel = proficiencyLevel;
    }

    const skills = await Skill.find(query)
      .populate('owner', 'name email avatar bio')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: skills.length,
      data: skills,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single skill by ID
// @route   GET /api/skills/:id
export const getSkillById = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id).populate('owner', 'name email avatar bio skillsWanted');

    if (!skill) {
      return res.status(404).json({ status: 'error', message: 'Skill not found' });
    }

    res.status(200).json({ status: 'success', data: skill });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new skill listing
// @route   POST /api/skills
export const createSkill = async (req, res, next) => {
  try {
    const { title, description, category, proficiencyLevel, locationType } = req.body;

    // Handle uploaded images from Cloudinary multer middleware if present
    const images = req.files ? req.files.map(file => file.path) : [];

    const skill = await Skill.create({
      title,
      description,
      category,
      proficiencyLevel,
      locationType,
      images,
      owner: req.user._id,
    });

    const populatedSkill = await Skill.findById(skill._id).populate('owner', 'name email avatar');

    res.status(201).json({
      status: 'success',
      data: populatedSkill,
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Get skills created by logged-in user
// @route   GET /api/skills/my-skills
export const getMySkills = async (req, res, next) => {
  try {
    const skills = await Skill.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      status: 'success',
      results: skills.length,
      data: skills,
    });
  } catch (error) {
    next(error);
  }
};
// Add this function to server/src/controllers/skillController.js

// @desc    Update an existing skill listing
// @route   PUT /api/skills/:id
export const updateSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ status: 'error', message: 'Skill not found' });
    }

    if (skill.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ status: 'error', message: 'Not authorized to update this skill' });
    }

    const { title, description, category, proficiencyLevel, locationType } = req.body;

    skill.title = title || skill.title;
    skill.description = description || skill.description;
    skill.category = category || skill.category;
    skill.proficiencyLevel = proficiencyLevel || skill.proficiencyLevel;
    skill.locationType = locationType || skill.locationType;

    // Append or replace images if new files are uploaded
    if (req.files && req.files.length > 0) {
      skill.images = req.files.map((file) => file.path);
    }

    const updatedSkill = await skill.save();

    res.status(200).json({
      status: 'success',
      data: updatedSkill,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a skill listing
// @route   DELETE /api/skills/:id
export const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ status: 'error', message: 'Skill not found' });
    }

    // Check if user owns the skill or is admin
    if (skill.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ status: 'error', message: 'Not authorized to delete this skill' });
    }

    await skill.deleteOne();

    res.status(200).json({ status: 'success', message: 'Skill removed successfully' });
  } catch (error) {
    next(error);
  }
  
};