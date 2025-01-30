import { Model, Query } from "mongoose";
import { QuestionPaperModel } from "../modules/questionPaper/questionPaper.model";
import { ExamineeModel } from "../modules/examine/examinee.model";
import { UserModel } from "../modules/user/user.model";
import { idFor, userRole } from "../constents";
import { CandidateModel } from "../modules/candidate/candidate.model";

// Utility function to enforce Document compatibility
const asDocumentModel = <T>(model: Model<T>): Model<T & Document> => {
  return model as Model<T & Document>;
};

// Utility function to generate IDs for collections

const collectionIdGenerator = async <T extends Document>(
  model: Model<T>, // Accept a Mongoose model
  idFor: string // The type of ID to generate
): Promise<string> =>  { 
  const prefix = idFor.substring(0, 3).toUpperCase(); // Prefix from idFor, e.g., 'ABC'

try {
  // Fetch the last record sorted by `id` in descending order
  const lastRecord = await model.findOne().sort({ createdAt: -1 });
  let newId: string;

  if (lastRecord) {
    // Extract the numeric part of the ID and increment it
    const lastNumber = parseInt(lastRecord.id.substring(3), 10); // Assumes prefix is 3 characters
    const incrementedNumber = lastNumber + 1;

    // Create the new ID with leading zeroes, ensuring it is at least 2 digits
    newId = `${prefix}${incrementedNumber.toString().padStart(2, "0")}`;
  } else {
    // If no record exists, start with "00"
    newId = `${prefix}00`;
  }

  return newId;
} catch (error: any) {
  throw new Error(`Error generating ID: ${error.message}`);
}
};


const generateId = async (role: string): Promise<string> => {
  let uId;

  

  if (role === `${idFor.candidate}`) {
      const convertCandidateModel = asDocumentModel(CandidateModel);
      uId = await collectionIdGenerator(
          convertCandidateModel,
          idFor.candidate
      );
  } 
  
  else if (role === `${idFor.examinee}`) {
      const convertExamineeModel = asDocumentModel(ExamineeModel);
      uId = await collectionIdGenerator(
          convertExamineeModel,
          idFor.examinee
      );
  }

  console.log(uId)

  return uId as string;
};


const mcqIdGenerator = async (QPId: string): Promise<string> => {

  const splitString = (str:string): string[] => {
    const match = str.match(/^(QUE\d+)(MCQ\d+)$/);
    if (match) {
      return [match[1], match[2].replace("MCQ", "")];
    }
    return []; // Return null if the string doesn't match the pattern
  };

  const questionPaper = await QuestionPaperModel.findOne({ id: QPId });
  if (!questionPaper) {
    throw new Error("Question Paper not found");
  }
  const lastMcqIndex = (questionPaper?.MCQSet.length - 1);
  const lastMcqId = questionPaper?.MCQSet[lastMcqIndex].mcqId;


  const mcqId = splitString(lastMcqId)

  const numberedMcqId = parseInt(mcqId[1]);
  const mcqSetLength = numberedMcqId + 1;

  return `${QPId}MCQ${mcqSetLength}`;
};

const idGenerator = {
  collectionIdGenerator,
  mcqIdGenerator,
  asDocumentModel,
  generateId
};

export default idGenerator;
