import catchAsync from "../../util/catchAsync";
import golbalRespnseHandler from "../../util/globalResponseHandeler";
import questionPaperService from "./questionPaper.service";

const getAllQuestionPaper = catchAsync(async (req, res) => {
  const result = await questionPaperService.getAllQuestionPapers();
  golbalRespnseHandler(res, {
    message: "all question papers retrieved successfully",
    success: true,
    statusCode: 200,
    data: result,
  });
});

const getSingleQuestionPaper = catchAsync(async (req, res) => {
  const result = await questionPaperService.getSingleQuestionPaper(
    req.params.qid
  );
  golbalRespnseHandler(res, {
    message: "single question paper retrieved successfully",
    success: true,
    statusCode: 200,
    data: result,
  });
});

const getQuestionPapersOfExaminee = catchAsync(async (req, res) => {
  const result = await questionPaperService.getQuestionPapersOfExaminee(
    req.user.id
  );
  golbalRespnseHandler(res, {
    message: "single question paper retrieved successfully",
    success: true,
    statusCode: 200,
    data: result,
  });
});

const getAllQuestionPapersForCandidate = catchAsync(async (req, res) => {
  const result = await questionPaperService.getAllQuestionPapers();
  golbalRespnseHandler(res, {
    message: "all question paper retrieved successfully",
    success: true,
    statusCode: 200,
    data: result,
  });
});

const getAllQuestionPapersForExaminer = catchAsync(async (req, res) => {
  const result = await questionPaperService.getAllQuestionPapers();
  golbalRespnseHandler(res, {
    message: "all question papers retrieved successfully",
    success: true,
    statusCode: 200,
    data: result,
  });
});

const createQuestionPaper = catchAsync(async (req, res) => {
  const user = req.user;

  const result = await questionPaperService.createQuestionPaper(
    user.id,
    req.body
  );
  golbalRespnseHandler(res, {
    message: "question paper created successfully",
    success: true,
    statusCode: 200,
    data: result,
  });
});

const addMCQIntoQuestionPaper = catchAsync(async (req, res) => {
  const { id } = req.user;

  const result = await questionPaperService.addMCQIntoQuestionPaper(
    id,
    req.query.qid as string,
    req.body
  );
  golbalRespnseHandler(res, {
    message: "question paper updated successfully",
    success: true,
    statusCode: 200,
    data: result,
  });
});
const removeMCQFromQuestionPaper = catchAsync(async (req, res) => {
  const { id } = req.user;
  const result = await questionPaperService.removeMCQFromQuestionPaper(
    id,
    req.query.qid as string,
    req.query.mcqId as string
  );

  golbalRespnseHandler(res, {
    message: "MCQ removed from question paper successfully",
    success: true,
    statusCode: 200,
    data: result,
  });
});

const updateQuestionPaper = catchAsync(async (req, res) => {
  const result = await questionPaperService.updateQuestionPaper(
    req.params.qid,
    req.body
  );
  golbalRespnseHandler(res, {
    message: "question paper updated successfully",
    success: true,
    statusCode: 200,
    data: result,
  });
});

const deleteQuestionPaper = catchAsync(async (req, res) => {
  const { id } = req.user;

  if (id !== req.query.examineeId) {
    throw new Error("You are not authorized to delete this question paper");
  }
  const result = await questionPaperService.deleteQuestionPaper(
    req.query.qid as string
  );
  golbalRespnseHandler(res, {
    message: "question paper deleted successfully",
    success: true,
    statusCode: 200,
    data: result,
  });
});

const questionPaperController = {
  getAllQuestionPaper,
  getSingleQuestionPaper,
  getAllQuestionPapersForCandidate,
  getAllQuestionPapersForExaminer,
  getQuestionPapersOfExaminee,
  createQuestionPaper,
  updateQuestionPaper,
  deleteQuestionPaper,
  addMCQIntoQuestionPaper,
  removeMCQFromQuestionPaper,
};
export default questionPaperController;
