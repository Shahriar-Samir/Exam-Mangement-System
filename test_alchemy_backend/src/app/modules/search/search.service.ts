import { QuestionPaperModel } from "../questionPaper/questionPaper.model";
import { UserModel } from "../user/user.model";

export const searchService = async (user: any, query: any) => {
  console.log(query?.searchTerm);
  if (!query?.searchTerm) {
    return [];
  }
  let { searchTerm, limit, page } = query;

  if (!limit) {
    limit = 10;
  }
  if (!page) {
    page = 0;
  }

  if (user.role === "examinee") {
    const searchQuery = {
      isDeleted: false,
      subject: { $regex: searchTerm, $options: "i" },
    };
    const result = await QuestionPaperModel.find(searchQuery)
      .limit(limit)
      .skip(limit * page)
      .select({
        isDeleted: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
        _id: 0,
      });
    return result;
  }
  if (user.role === "candidate") {
    const searchQuery = {
      isDeleted: false,
      subject: { $regex: searchTerm, $options: "i" },
    };
    const result = await QuestionPaperModel.find(searchQuery)
      .limit(limit)
      .skip(limit * page)
      .select({
        isDeleted: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
        MCQSet: 0,
        _id: 0,
      });
    return result;
  }

  if (user.role === "admin") {
    const searchQuery: any = {
      isDeleted: false,
      userType: "examinee",
    };
    if (searchTerm) {
      const splitedSearchTerm = searchTerm.split(" ");

      if (splitedSearchTerm.length > 1) {
        searchQuery.firstName = { $regex: splitedSearchTerm[0], $options: "i" };
        searchQuery.lastName = { $regex: splitedSearchTerm[1], $options: "i" };
      } else {
        searchQuery.firstName = { $regex: splitedSearchTerm[0], $options: "i" };
      }
    }
    const result = await UserModel.find(searchQuery)
      .limit(limit)
      .skip(limit * page)
      .select({
        id: 1,
        firstName: 1,
        lastName: 1,
        email: 1,
        img: 1,
        _id: 0,
      });
    return result;
  }
};
export default searchService;
