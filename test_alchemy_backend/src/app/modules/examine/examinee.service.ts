import { ExamineeModel } from "./examinee.model";

 const addQuestionPaperInExamineeDocument = async () => {
  const result = await ExamineeModel.updateOne();
  return result;
};

 const updateQuestionPaperInExamineeDocument = () => {
  const result = "";
  return result;
};

 const deleteQuestionPaperInExamineeDocument = () => {
  const result = "";
  return result;
};

const examineeServices ={
  addQuestionPaperInExamineeDocument,updateQuestionPaperInExamineeDocument,deleteQuestionPaperInExamineeDocument
}

export default examineeServices
