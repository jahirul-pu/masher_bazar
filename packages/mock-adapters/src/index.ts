// ==========================================
// 1. bKash Tokenized Checkout Adapter
// ==========================================

export interface BkashAgreementResponse {
  agreementId: string;
  paymentUrl: string;
  status: 'Initiated' | 'Failed';
}

export interface BkashPaymentResponse {
  paymentId: string;
  trxId: string;
  amount: number;
  currency: string;
  status: 'Completed' | 'Pending' | 'Failed';
  customerMsisdn: string;
}

export interface IBkashAdapter {
  createAgreement(payerReference: string): Promise<BkashAgreementResponse>;
  executeAgreement(paymentId: string): Promise<{ agreementId: string; status: string }>;
  createPaymentWithAgreement(agreementId: string, amount: number, invoiceNumber: string): Promise<BkashPaymentResponse>;
  queryPayment(paymentId: string): Promise<BkashPaymentResponse>;
}

export class MockBkashAdapter implements IBkashAdapter {
  async createAgreement(payerReference: string): Promise<BkashAgreementResponse> {
    return {
      agreementId: `AGR-MOCK-${Date.now()}-${payerReference.slice(-4)}`,
      paymentUrl: `https://sandbox.bkash.com/mock-agreement?ref=${payerReference}`,
      status: 'Initiated',
    };
  }

  async executeAgreement(paymentId: string): Promise<{ agreementId: string; status: string }> {
    return {
      agreementId: `AGR-MOCK-EXEC-${paymentId}`,
      status: 'Completed',
    };
  }

  async createPaymentWithAgreement(agreementId: string, amount: number, invoiceNumber: string): Promise<BkashPaymentResponse> {
    return {
      paymentId: `PAY-MOCK-${Date.now()}`,
      trxId: `TRX-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      amount,
      currency: 'BDT',
      status: 'Completed',
      customerMsisdn: '01700000000',
    };
  }

  async queryPayment(paymentId: string): Promise<BkashPaymentResponse> {
    return {
      paymentId,
      trxId: `TRX-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      amount: 5000,
      currency: 'BDT',
      status: 'Completed',
      customerMsisdn: '01700000000',
    };
  }
}

// ==========================================
// 2. Nagad Adapter
// ==========================================

export interface NagadPaymentResponse {
  paymentRefId: string;
  issuerPaymentUrl: string;
  status: 'Success' | 'Failed';
}

export interface INagadAdapter {
  initiatePayment(orderId: string, amount: number): Promise<NagadPaymentResponse>;
  verifyPayment(paymentRefId: string): Promise<{ isVerified: boolean; trxId: string; amount: number }>;
}

export class MockNagadAdapter implements INagadAdapter {
  async initiatePayment(orderId: string, amount: number): Promise<NagadPaymentResponse> {
    return {
      paymentRefId: `NAGAD-REF-${Date.now()}`,
      issuerPaymentUrl: `https://sandbox.nagad.com.bd/checkout?order=${orderId}&amt=${amount}`,
      status: 'Success',
    };
  }

  async verifyPayment(paymentRefId: string): Promise<{ isVerified: boolean; trxId: string; amount: number }> {
    return {
      isVerified: true,
      trxId: `NAGAD-TRX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      amount: 5000,
    };
  }
}

// ==========================================
// 3. SSLCommerz Adapter (Cards & Banking)
// ==========================================

export interface SslCommerzSessionResponse {
  gatewayPageUrl: string;
  sessionKey: string;
  status: 'SUCCESS' | 'FAILED';
}

export interface ISslCommerzAdapter {
  initiateSession(orderId: string, amount: number, customerName: string, customerPhone: string): Promise<SslCommerzSessionResponse>;
  validateTransaction(valId: string): Promise<{ isValid: boolean; tranId: string; bankTranId: string }>;
}

export class MockSslCommerzAdapter implements ISslCommerzAdapter {
  async initiateSession(orderId: string, amount: number, customerName: string, customerPhone: string): Promise<SslCommerzSessionResponse> {
    return {
      gatewayPageUrl: `https://sandbox.sslcommerz.com/mock-gw?order=${orderId}&amt=${amount}`,
      sessionKey: `SESSION-${Math.random().toString(36).substring(2, 12)}`,
      status: 'SUCCESS',
    };
  }

  async validateTransaction(valId: string): Promise<{ isValid: boolean; tranId: string; bankTranId: string }> {
    return {
      isValid: true,
      tranId: `SSL-TRAN-${Date.now()}`,
      bankTranId: `BANK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    };
  }
}

// ==========================================
// 4. SMS Gateway (SSL Wireless / BulkSMSBD)
// ==========================================

export interface ISmsGatewayAdapter {
  sendOtp(phone: string, otp: string): Promise<{ success: boolean; messageId: string }>;
  sendMarketReminder(phone: string, customerName: string, basketAmount: number, link: string): Promise<{ success: boolean }>;
  sendDeliveryUpdate(phone: string, orderNumber: string, statusText: string): Promise<{ success: boolean }>;
}

export class MockSmsGatewayAdapter implements ISmsGatewayAdapter {
  async sendOtp(phone: string, otp: string): Promise<{ success: boolean; messageId: string }> {
    console.log(`[SANDBOX SMS] To: ${phone} | Text: "Your Masik Bazar verification code is ${otp}. Valid for 5 minutes."`);
    return { success: true, messageId: `SMS-${Date.now()}` };
  }

  async sendMarketReminder(phone: string, customerName: string, basketAmount: number, link: string): Promise<{ success: boolean }> {
    console.log(`[SANDBOX SMS] To: ${phone} | Text: "Dear ${customerName}, your monthly market of ৳${basketAmount} is ready. Review and order: ${link}"`);
    return { success: true };
  }

  async sendDeliveryUpdate(phone: string, orderNumber: string, statusText: string): Promise<{ success: boolean }> {
    console.log(`[SANDBOX SMS] To: ${phone} | Text: "Masik Bazar Order ${orderNumber} update: ${statusText}"`);
    return { success: true };
  }
}
