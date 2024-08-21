import { z } from "zod";


// validation for accepting message feature 
export const acceptMessageSchema = z.object({
    acceptMessage : z.boolean()
})