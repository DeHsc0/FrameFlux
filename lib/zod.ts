import z from "zod";

const ProjectCreationSchema = z.object({
    image : z.instanceof(File),
    projectName : z.string().min(3).max(30) 
})

const PreSignedUrlSchema = z.object({
    imageType : z.string(),
    projectName : z.string().min(3).max(30) 
})
const createProjectSchema = z.object({
    projectName : z.string().min(3).max(12),
    key : z.string(),
    clerkId : z.string().min(32)
})

export {
    ProjectCreationSchema,
    PreSignedUrlSchema,
    createProjectSchema
}