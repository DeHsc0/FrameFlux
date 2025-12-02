import z from "zod";

const ProjectCreationFormSchema = z.object({
    image : z.instanceof(File),
    projectName : z.string().min(3).max(30) 
})


export {
    ProjectCreationFormSchema
}