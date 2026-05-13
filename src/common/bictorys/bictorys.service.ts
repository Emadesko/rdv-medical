import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class BictorysService {
  private baseUrl = process.env.BICTORYS_API_URL;
  private apiKey = process.env.BICTORYS_API_KEY;
  private isDev = process.env.NODE_ENV === 'development';

  async createPaymentLink(params: {
    rdvId: number;
    montant: number;
    description: string;
    customerEmail: string;
    customerName: string;
    customerPhone: string;
  }): Promise<string> {

    // 🚧 MODE DEV — simulation du lien de paiement
    if (this.isDev) {
      return `${process.env.FRONTEND_URL}/payer?rdvId=${params.rdvId}`;
    }

    // MODE PROD — vrai appel Bictorys
    const body = {
      amount: Math.round(params.montant),
      currency: 'XOF',
      country: 'SN',
      paymentReference: `RDV-${params.rdvId}-${Date.now()}`,
      successRedirectUrl: `${process.env.FRONTEND_URL}/payer/success?rdvId=${params.rdvId}`,
      ErrorRedirectUrl: `${process.env.FRONTEND_URL}/payer/cancel?rdvId=${params.rdvId}`,
      customerObject: {
        name: params.customerName,
        phone: params.customerPhone,
        email: params.customerEmail,
        country: 'SN',
      },
    };

    try {
      const response = await axios.post(
        `${this.baseUrl}/pay/v1/charges`,
        body,
        {
          headers: {
            'X-Api-Key': this.apiKey,
            'Content-Type': 'application/json',
          },
        },
      );

      const url =
        response.data?.paymentUrl ||
        response.data?.payment_url ||
        response.data?.url ||
        response.data?.checkoutUrl ||
        response.data?.data?.paymentUrl;

      if (!url) throw new InternalServerErrorException('URL de paiement non trouvée');
      return url;

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Bictorys error:', error.response?.status, error.response?.data);
        throw new InternalServerErrorException(
          `Erreur Bictorys ${error.response?.status}`,
        );
      }
      throw error;
    }
  }
}