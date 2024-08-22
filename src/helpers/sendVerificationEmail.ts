import { resend } from "@/lib/resend";
import VerificationEmail from "@/emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

 export async function sendVerificationEmail(
    email : string,
    username : string,
    verifyCode : string
):Promise<ApiResponse>
{
try {
    // sending email to user if user is recieved from api response
    await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: email,
        subject: 'Next Js Email Verification Code',
        react: VerificationEmail({username : username, otp : verifyCode}),
      });
    return {
        success : true , message : "Verification Email send sucessfully"
    }
} catch (error) {
    console.error("Error Sending Verification Email")
    return {
        success : false , message : "Failed to send verification Email"
    }
}
}