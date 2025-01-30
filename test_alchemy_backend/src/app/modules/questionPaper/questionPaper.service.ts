import { idFor } from "../../constents";
import idGenerator from "../../util/idGenarator";
import { TMCQ, TQuestionPaper } from "./questionPaper.interface";
import { QuestionPaperModel } from "./questionPaper.model";
import questionPaperUtil from "./questionPaper.util";

export const getAllQuestionPapers = async () => {
  const result = await QuestionPaperModel.find({ isDeleted: false }).select({
    _id: 0,
    isDeleted: 0,
    __v: 0,
    createdAt: 0,
    updatedAt: 0,
    MCQSet: 0,
  });
  return result;
};

// examinee
export const getQuestionPapersOfExaminee = async (examineeId: string) => {
  console.log(examineeId);
  const result = await QuestionPaperModel.find({
    examineeId,
    isDeleted: false,
  }).select({
    _id: 0,
    isDeleted: 0,
    __v: 0,
    createdAt: 0,
    updatedAt: 0,
  });
  return result;
};

// candidate
export const getSingleQuestionPaper = async (qid: string) => {
  const result = await QuestionPaperModel.findOne({
    id: qid,
    isDeleted: false,
  }).select({
    _id: 0,
    isDeleted: 0,
    __v: 0,
    createdAt: 0,
    updatedAt: 0,
  });
  return result;
};

// examinee
export const createQuestionPaper = async (
  examineeId: string,
  payload: TQuestionPaper
) => {
  const modifiedQuestionPaperModel =
    idGenerator.asDocumentModel(QuestionPaperModel);
  const questionPaperId = await idGenerator.collectionIdGenerator(
    modifiedQuestionPaperModel,
    idFor.questionPaper
  );
  payload.MCQSet = questionPaperUtil.preSaveMcqDataModifier(
    payload.MCQSet,
    questionPaperId
  );
  payload.id = questionPaperId;
  payload.examineeId = examineeId;

  await QuestionPaperModel.create(payload);
  const updatedQuestionPaper = await questionPaperUtil.totalMarksCalculator(
    questionPaperId
  );
  console.log(updatedQuestionPaper.totalMarks);
  const result = {
    id: updatedQuestionPaper.id,
    examineeId: updatedQuestionPaper.examineeId,
    subject: updatedQuestionPaper.subject,
    duration: updatedQuestionPaper.duration,
    totalMarks: updatedQuestionPaper.totalMarks,
    MCQSet: updatedQuestionPaper.MCQSet.map((e: any) => {
      return {
        mcqId: e.mcqId,
        question: e.question,
        options: e.options,
        correctAns: e.correctAns,
        mark: e.mark,
      };
    }),
  };
  return result;
};

// examinee

export const addMCQIntoQuestionPaper = async (
  examineeId: string,
  id: string,
  mcq: TMCQ
) => {
  const isQuestionPaperExist = await QuestionPaperModel.findOne({
    id,
    examineeId,
    isDeleted: false,
  });
  if (!isQuestionPaperExist) {
    throw new Error("Question paper not found");
  }
  if (isQuestionPaperExist.examineeId !== examineeId) {
    throw new Error("unauthorized access");
  }
  const mcqId = await idGenerator.mcqIdGenerator(id);
  mcq.mcqId = mcqId;
  const result = await QuestionPaperModel.updateOne(
    { id, isDeleted: false },
    {
      $push: { MCQSet: mcq },
    }
  );
  await questionPaperUtil.totalMarksCalculator(id);
  return result;
};

export const removeMCQFromQuestionPaper = async (
  examineeId: string,
  qpid: string,
  mcqId: string
) => {
  const isQuestionPaperExist = await QuestionPaperModel.findOne({
    id: qpid,
    examineeId,
    isDeleted: false,
  });
  if (!isQuestionPaperExist) {
    throw new Error("Question paper not found");
  }
  if (isQuestionPaperExist.examineeId !== examineeId) {
    throw new Error("unauthorized access");
  }
  const result = await QuestionPaperModel.updateOne(
    { examineeId, id: qpid, isDeleted: false },
    {
      $pull: {
        MCQSet: {
          mcqId,
        },
      },
    }
  );

  await questionPaperUtil.totalMarksCalculator(qpid);

  return result;
};

export const updateQuestionPaper = async (id: string, payload: any) => {
  const result = await QuestionPaperModel.updateOne(
    { id, isDeleted: false },
    {
      duration: payload.duration,
      MCQSet: payload.MCQSet,
    }
  );
  return result;
};

// examinee
export const deleteQuestionPaper = async (qid: string) => {
  const result = await QuestionPaperModel.updateOne(
    { id: qid, isDeleted: false },
    { isDeleted: true }
  );
  return result;
};

const questionPaperService = {
  getAllQuestionPapers,
  getQuestionPapersOfExaminee,
  deleteQuestionPaper,
  updateQuestionPaper,
  createQuestionPaper,
  getSingleQuestionPaper,
  addMCQIntoQuestionPaper,
  removeMCQFromQuestionPaper,
};
export default questionPaperService;
