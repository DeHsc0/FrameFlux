import z from "zod";

const PreSignedUrlSchema = z.object({
    imageType : z.string(),
    projectName : z.string().min(3).max(30) 
})

export { PreSignedUrlSchema }