import catchAsync from "../../util/catchAsync";
import golbalRespnseHandler from "../../util/globalResponseHandeler";
import { searchService } from "./search.service";

export const searchController = catchAsync(async (req, res) => {
  const result = await searchService(req.user as any, req.query as any);
  golbalRespnseHandler(res, {
    success: true,
    statusCode: 200,
    message: "Data retrieved successfully",
    data: result,
  });
});
