import { z } from "zod";

export const startExam = z.object({
    body: z.object({
        startTime: z.string().min(1),
        questionPaperId: z.string().min(1),
        candidId: z.string().min(1)
    })
})

export const endExam = z.object({
    body: z.object({
        id: z.string().min(1),
        endTime: z.string().min(1),
        isSubmitted: z.boolean(),
        answerSheet: z.array(z.object({
            mcqId: z.string(),
            answer: z.number()
        }))
    })
})