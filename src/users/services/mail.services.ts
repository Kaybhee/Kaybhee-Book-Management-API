import axios from 'axios'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as dotenv from 'dotenv'

dotenv.config()

@Injectable()
export class SendMailService {
    constructor(private mailConfig : ConfigService) {};
    async sendEmail(to : string, data : { message: string; subject: string }): Promise<string> {
    const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Book Management</title>
    </head>
    <body>
      <div style="text-align:center;font-family:sans-serif">
        <img src="https://iili.io/389IoWN.jpg" alt="Hotel" height="100" />
        <h3>Welcome to the Book Club</h3>
        <p>${data.message}</p>
        <p>Thanks,<br />Book Club</p>
        <p>
          For enquiries:
          <a href="mailto:enquiry@example.com">enquiry@example.com</a>
        </p>
      </div>
    </body>
    </html>
    `
    
    try {
        const getLink = await axios.post(
            "https://api.brevo.com/v3/smtp/email",
            {
                sender : {
                    email : this.mailConfig.get<string>('USER_MAIL'),
                    name : "Book App" 
                },
                to : [{ email : to }],
                subject : data.subject || "Book Castro",
                htmlContent : htmlTemplate
            },
            {
                headers : {
                    "Content-Type" : "application/json",
                    "api-key" : this.mailConfig.get<string>("BREVO_API")
                }
            }
        )
        console.log("Email sent successfully:", getLink.data)
        // return true;
        return getLink.data
    } catch(error) {
        console.error("Brevo email error:", error.response?.data || error.message)
        // return false;
        return "Email error"
    }
}
}
