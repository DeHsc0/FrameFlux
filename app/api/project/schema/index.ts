import z from "zod";

export const createProjectSchema = z.object({
    projectName : z.string().min(3).max(12),
    imageUrl : z.string().url(),
    clerkId : z.string().min(32)
})