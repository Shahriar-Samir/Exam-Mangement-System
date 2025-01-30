import { z } from "zod";

const userValidationSchema = z.object({
  body: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    password: z.string(),
    img: z.string().optional(),
    userType: z.enum(["candidate", "examinee", "admin"]),
    isDeleted: z.boolean().default(false),
    isLoggedIn: z.boolean().optional().default(false),
    loggedOutTime: z.string().optional(),
  }),
});

const userUpdateValidationSchema = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    password: z.string().optional(),
    img: z.string().optional(),
    userType: z.enum(["candidate", "examinee", "admin"]).optional(),
  }),
});

const userValidation = {
  userValidationSchema,
  userUpdateValidationSchema,
};
export default userValidation;
