const Draft = require('../models/Draft');

// @desc    Get all drafts
// @route   GET /api/drafts
// @access  Private
exports.getDrafts = async (req, res, next) => {
  try {
    const drafts = await Draft.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: drafts.length,
      data: drafts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single draft
// @route   GET /api/drafts/:id
// @access  Private
exports.getDraft = async (req, res, next) => {
  try {
    const draft = await Draft.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!draft) {
      return res.status(404).json({
        success: false,
        message: 'Draft not found'
      });
    }

    res.status(200).json({
      success: true,
      data: draft
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create draft
// @route   POST /api/drafts
// @access  Private
exports.createDraft = async (req, res, next) => {
  try {
    const draft = await Draft.create({
      ...req.body,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: draft
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update draft
// @route   PUT /api/drafts/:id
// @access  Private
exports.updateDraft = async (req, res, next) => {
  try {
    const draft = await Draft.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!draft) {
      return res.status(404).json({
        success: false,
        message: 'Draft not found'
      });
    }

    res.status(200).json({
      success: true,
      data: draft
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete draft
// @route   DELETE /api/drafts/:id
// @access  Private
exports.deleteDraft = async (req, res, next) => {
  try {
    const draft = await Draft.findById(req.params.id);

    if (!draft) {
      return res.status(404).json({
        success: false,
        message: 'Draft not found'
      });
    }

    await draft.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Draft deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
