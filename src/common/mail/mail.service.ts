import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  private layout(content: string): string {
    return `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; background: #f9fafb; padding: 24px; border-radius: 12px;">
        <div style="background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #008c98, #006b75); padding: 28px 32px;">
            <h1 style="margin: 0; color: white; font-size: 22px; font-weight: 700;">🏥 RDV Médical</h1>
            <p style="margin: 4px 0 0; color: rgba(255,255,255,0.8); font-size: 13px;">Votre santé, notre priorité</p>
          </div>
          <!-- Content -->
          <div style="padding: 32px;">
            ${content}
          </div>
          <!-- Footer -->
          <div style="background: #f3f4f6; padding: 16px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
              © 2026 RDV Médical — Ne pas répondre à cet email
            </p>
          </div>
        </div>
      </div>
    `;
  }

  private rdvCard(details: {
    service: string;
    date: string;
    heure: string;
    docteur?: string;
    prix?: number;
    motif?: string;
  }): string {
    return `
      <div style="background: #f0fdfe; border: 1px solid #a5f3fc; border-radius: 10px; padding: 20px; margin: 20px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          ${details.service ? `<tr><td style="padding: 6px 0; color: #6b7280; font-size: 14px; width: 40%;">📋 Service</td><td style="padding: 6px 0; font-weight: 600; color: #111827;">${details.service}</td></tr>` : ''}
          ${details.date ? `<tr><td style="padding: 6px 0; color: #6b7280; font-size: 14px;">📅 Date</td><td style="padding: 6px 0; font-weight: 600; color: #111827;">${details.date}</td></tr>` : ''}
          ${details.heure ? `<tr><td style="padding: 6px 0; color: #6b7280; font-size: 14px;">🕐 Heure</td><td style="padding: 6px 0; font-weight: 600; color: #111827;">${details.heure}</td></tr>` : ''}
          ${details.docteur ? `<tr><td style="padding: 6px 0; color: #6b7280; font-size: 14px;">👨‍⚕️ Médecin</td><td style="padding: 6px 0; font-weight: 600; color: #111827;">${details.docteur}</td></tr>` : ''}
          ${details.prix ? `<tr><td style="padding: 6px 0; color: #6b7280; font-size: 14px;">💰 Montant</td><td style="padding: 6px 0; font-weight: 700; color: #008c98; font-size: 16px;">${details.prix.toLocaleString('fr-FR')} CFA</td></tr>` : ''}
          ${details.motif ? `<tr><td style="padding: 6px 0; color: #6b7280; font-size: 14px;">📝 Motif</td><td style="padding: 6px 0; color: #111827; font-style: italic;">${details.motif}</td></tr>` : ''}
        </table>
      </div>
    `;
  }

  private button(text: string, url: string, color = '#008c98'): string {
    return `
      <div style="text-align: center; margin: 24px 0;">
        <a href="${url}"
           style="display: inline-block; background: ${color}; color: white;
                  padding: 14px 32px; border-radius: 8px; text-decoration: none;
                  font-weight: 700; font-size: 15px; letter-spacing: 0.3px;">
          ${text}
        </a>
      </div>
    `;
  }

  async sendDemandeCreee(
    email: string,
    nom: string,
    details: {
      service: string;
      date: string;
      heure: string;
      docteur: string;
      prix: number;
      motif: string;
    },
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: '✅ Votre demande de rendez-vous a été reçue',
      html: this.layout(`
        <h2 style="color: #111827; margin-top: 0;">Bonjour ${nom} 👋</h2>
        <p style="color: #374151; line-height: 1.6;">
          Nous avons bien reçu votre demande de rendez-vous. Elle est actuellement
          <strong style="color: #f59e0b;">en attente de validation</strong> par le médecin.
          Vous serez notifié dès qu'elle sera traitée.
        </p>
        ${this.rdvCard(details)}
        <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 14px; margin-top: 16px;">
          <p style="margin: 0; color: #92400e; font-size: 13px;">
            ⏳ <strong>Que se passe-t-il ensuite ?</strong><br>
            Le médecin examinera votre demande et vous enverra une confirmation ou un refus dans les plus brefs délais.
          </p>
        </div>
        ${this.button('Voir mes rendez-vous', `${process.env.FRONTEND_URL}/mes-rdv`)}
      `),
    });
  }

  async sendPaymentLink(
    email: string,
    nom: string,
    paymentPageUrl: string,
    details: {
      service: string;
      date: string;
      heure: string;
      prix: number;
      docteur: string;
    },
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: '🎉 Rendez-vous validé — Finalisez votre paiement',
      html: this.layout(`
        <h2 style="color: #111827; margin-top: 0;">Bonne nouvelle, ${nom} ! 🎉</h2>
        <p style="color: #374151; line-height: 1.6;">
          Votre demande de rendez-vous a été <strong style="color: #059669;">validée</strong> par le médecin.
          Il ne vous reste plus qu'à procéder au paiement pour confirmer votre consultation.
        </p>
        ${this.rdvCard(details)}
        <div style="background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 14px; margin: 16px 0;">
          <p style="margin: 0; color: #78350f; font-size: 13px;">
            ⚠️ <strong>Important :</strong> Le lien de paiement est valable <strong>10 minutes</strong>.
            Passé ce délai, vous pourrez en générer un nouveau depuis votre espace pendant les
            <strong>1 heure</strong> suivant la validation. Au-delà, votre demande sera remise en attente.
          </p>
        </div>
        ${this.button('💳 Payer maintenant', paymentPageUrl)}
        <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 8px;">
          Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>
          <a href="${paymentPageUrl}" style="color: #008c98;">${paymentPageUrl}</a>
        </p>
      `),
    });
  }

  async sendConfirmationPaiement(
    email: string,
    nom: string,
    details: {
      service: string;
      date: string;
      heure: string;
      prix: number;
      docteur: string;
    },
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: '✅ Paiement confirmé — Votre rendez-vous est réservé !',
      html: this.layout(`
        <h2 style="color: #111827; margin-top: 0;">Félicitations ${nom} ! 🏥</h2>
        <p style="color: #374151; line-height: 1.6;">
          Votre paiement a été <strong style="color: #059669;">confirmé avec succès</strong>.
          Votre rendez-vous est maintenant <strong>officiellement réservé</strong>.
        </p>
        ${this.rdvCard(details)}
        <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 14px; margin: 16px 0;">
          <p style="margin: 0; color: #14532d; font-size: 13px;">
            💡 <strong>Conseils pour votre consultation :</strong><br>
            • Arrivez 10 minutes avant l'heure prévue<br>
            • Apportez vos documents médicaux si nécessaire<br>
            • En cas d'empêchement, annulez depuis votre espace
          </p>
        </div>
        ${this.button('📋 Voir mes rendez-vous', `${process.env.FRONTEND_URL}/mes-rdv`)}
      `),
    });
  }

  async sendRejet(
    email: string,
    nom: string,
    motif: string,
    details: {
      service: string;
      date: string;
      heure: string;
      prix: number;
      docteur: string;
    },
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: '❌ Votre demande de rendez-vous a été refusée',
      html: this.layout(`
        <h2 style="color: #111827; margin-top: 0;">Bonjour ${nom},</h2>
        <p style="color: #374151; line-height: 1.6;">
          Nous vous informons que votre demande de rendez-vous a été
          <strong style="color: #dc2626;">refusée</strong> par le médecin.
        </p>
        ${this.rdvCard(details)}
        <div style="background: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; padding: 14px; margin: 16px 0;">
          <p style="margin: 0; color: #7f1d1d; font-size: 14px;">
            <strong>Motif du refus :</strong><br>
            <em>${motif || 'Aucun motif précisé'}</em>
          </p>
        </div>
        <p style="color: #374151; line-height: 1.6;">
          Vous pouvez effectuer une nouvelle demande pour un autre créneau disponible.
          Si vous avez des questions, contactez directement le cabinet médical.
        </p>
        ${this.button('🗓️ Prendre un nouveau RDV', `${process.env.FRONTEND_URL}/prendre-rdv`)}
      `),
    });
  }

  async sendRdvAutoRejete(
    email: string,
    nom: string,
    details: { service: string; date: string; heure: string },
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: '⏰ Votre demande a expiré — Créneau passé',
      html: this.layout(`
        <h2 style="color: #111827; margin-top: 0;">Bonjour ${nom},</h2>
        <p style="color: #374151; line-height: 1.6;">
          Nous vous informons que votre demande de rendez-vous a été
          <strong style="color: #dc2626;">automatiquement annulée</strong>
          car le créneau demandé est maintenant passé sans avoir été validé.
        </p>
        ${this.rdvCard(details)}
        <div style="background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 14px; margin: 16px 0;">
          <p style="margin: 0; color: #78350f; font-size: 13px;">
            ℹ️ Votre demande était toujours en attente de validation au moment où le créneau a expiré.
            Nous nous excusons pour la gêne occasionnée.
          </p>
        </div>
        <p style="color: #374151; line-height: 1.6;">
          Nous vous invitons à effectuer une nouvelle demande pour un créneau disponible.
        </p>
        ${this.button('🗓️ Prendre un nouveau RDV', `${process.env.FRONTEND_URL}/prendre-rdv`)}
      `),
    });
  }

  async sendRappel(
    email: string,
    nom: string,
    details: {
      service: string;
      date: string;
      heure: string;
      docteur: string;
      prix: number;
    },
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: `⏰ Rappel — Consultation demain à ${details.heure}`,
      html: this.layout(`
        <h2 style="color: #111827; margin-top: 0;">Rappel de rendez-vous 📅</h2>
        <p style="color: #374151; line-height: 1.6;">
          Bonjour <strong>${nom}</strong>,<br>
          Nous vous rappelons que vous avez une consultation prévue <strong>demain</strong>.
        </p>
        ${this.rdvCard(details)}
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 14px; margin: 16px 0;">
          <p style="margin: 0; color: #1e3a5f; font-size: 13px;">
            📌 <strong>À ne pas oublier :</strong><br>
            • Arrivez 10 minutes avant l'heure prévue<br>
            • Munissez-vous de votre pièce d'identité<br>
            • Apportez vos ordonnances et résultats d'examens si vous en avez<br>
            • En cas d'empêchement, annulez depuis votre espace dès que possible
          </p>
        </div>
        ${this.button('📋 Voir mes rendez-vous', `${process.env.FRONTEND_URL}/mes-rdv`)}
        <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 8px;">
          À bientôt ! L'équipe RDV Médical
        </p>
      `),
    });
  }
}
