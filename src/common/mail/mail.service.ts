import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendPaymentLink(
    email: string,
    nom: string,
    paymentPageUrl: string,
    rdvDetails: {
      service: string;
      date: string;
      heure: string;
      prix: number;
      docteur: string;
    },
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Votre rendez-vous a été validé — Procédez au paiement',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
          <h2>Bonjour ${nom},</h2>
          <p>Votre rendez-vous a été validé par le médecin.</p>
          <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Service :</strong> ${rdvDetails.service}</p>
            <p><strong>Date :</strong> ${rdvDetails.date} à ${rdvDetails.heure}</p>
            <p><strong>Médecin :</strong> ${rdvDetails.docteur}</p>
            <p><strong>Montant :</strong> ${rdvDetails.prix.toLocaleString()} CFA</p>
          </div>
          <p>Pour confirmer votre rendez-vous, veuillez procéder au paiement en cliquant sur le bouton ci-dessous :</p>
          <a href="${paymentPageUrl}"
             style="display: inline-block; background: #008c98; color: white;
                    padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            Payer maintenant
          </a>
          <p style="color: #999; font-size: 12px; margin-top: 16px;">
            Ce lien est valable 10 minutes. Passé ce délai, vous pourrez en générer un nouveau depuis votre espace.
          </p>
        </div>
      `,
    });
  }

  async sendRejet(
    email: string,
    nom: string,
    motif: string,
    rdvDetails: {
      service: string;
      date: string;
      heure: string;
      prix: number;
      docteur: string;
    },
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Votre rendez-vous a été rejeté',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
          <h2>Bonjour ${nom},</h2>
          <p>Votre rendez-vous a été rejeté par le médecin.</p>
          <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Service :</strong> ${rdvDetails.service}</p>
            <p><strong>Date :</strong> ${rdvDetails.date} à ${rdvDetails.heure}</p>
            <p><strong>Médecin :</strong> ${rdvDetails.docteur}</p>
            <p><strong>Montant :</strong> ${rdvDetails.prix.toLocaleString()} CFA</p>
          </div>
          <p>Motif du rejet :</p>
          <p>
            ${motif}.
          </p>
        </div>
      `,
    });
  }

  async sendRdvAutoRejete(
    email: string,
    nom: string,
    rdvDetails: { service: string; date: string; heure: string },
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Votre demande de rendez-vous a été annulée',
      html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
        <h2>Bonjour ${nom},</h2>
        <p>Nous vous informons que votre demande de rendez-vous a été
           <strong>automatiquement annulée</strong> car le créneau est maintenant passé.</p>
        <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p><strong>Service :</strong> ${rdvDetails.service}</p>
          <p><strong>Date :</strong> ${rdvDetails.date} à ${rdvDetails.heure}</p>
        </div>
        <p>
          Votre demande était toujours en attente de validation au moment où le créneau a expiré.
          Nous vous invitons à effectuer une nouvelle demande pour un autre créneau disponible.
        </p>
        <a href="${process.env.FRONTEND_URL}/prendre-rdv"
           style="display: inline-block; background: #008c98; color: white;
                  padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
          Prendre un nouveau rendez-vous
        </a>
        <p style="color: #999; font-size: 12px; margin-top: 16px;">
          Nous nous excusons pour la gêne occasionnée.
        </p>
      </div>
    `,
    });
  }
}
