import nodemailer from 'nodemailer'
import { type MailOptions } from 'nodemailer/lib/json-transport'
import { type IConfig } from '../config'
import { HttpError } from '../exceptions/http.error'

export class MailService {
    private readonly transporter: nodemailer.Transporter

    constructor ({ config }: { config: IConfig }) {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            secure: true,
            port: 465,
            auth: {
                user: config.MAIL_FROM,
                pass: config.MAIL_PASSWORD
            }
        })
    }

    async sendMail (mailOptions: MailOptions): Promise<any> {
        try {
            const result = await this.transporter.sendMail(mailOptions)
            console.log('Message sent: %s', result)
        } catch (error) {
            const err = new HttpError(500, 'Error sending email')
            throw err
        }
    }
}
