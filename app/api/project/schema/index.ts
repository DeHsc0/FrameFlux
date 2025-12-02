import z from "zod"

const createProjectSchema = z.object({
    projectName : z.string().min(3).max(12),
    key : z.string()
})

export {
    createProjectSchema
}