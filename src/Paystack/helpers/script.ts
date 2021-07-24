export enum ResponseEventType {
  Cancelled = 'CANCELLED',
  // Pending = 'PENDING',
  Success = 'SUCCESS',
}

const onClose = `
function(){
  const response = {
    event: '${ResponseEventType.Cancelled}'
  };

  window.ReactNativeWebView.postMessage(JSON.stringify(response))
}
`;

const callback = `
function(response){
  var resp = {
    event: '${ResponseEventType.Success}',
    transactionRef: response
  };

  window.ReactNativeWebView.postMessage(JSON.stringify(resp))
}
`;
export function getScript(props: PaystackProps): string {
  return `
  window.onload = payWithPaystack;
  const transaction = ${props};
  function payWithPaystack() {
    const handler = PaystackPop.setup({
      ...transaction,
      callback: ${callback},
      onClose: ${onClose}
    });
    handler.openIframe();
  }
  `;
}

export interface ResponseEvent {
  eventType: ResponseEventType;
  data?: any;
}
export enum Currency {
  NIGERIAN_NAIRA = 'NGN',
  SOUTH_AFRICAN_RAND = 'ZAR',
  GHANAIAN_CEDI = 'GHS',
  AMERICAN_DOLLAR = 'USD',
}

export type PaymentChannel =
  | 'card'
  | 'bank'
  | 'ussd'
  | 'qr'
  | 'mobile_money'
  | 'bank_transfer';

type Any = unknown;
export interface PaystackProps<Metadata = Any> {
  /** Your public key from Paystack. Use test key for test mode and live key for live mode */
  key: string;
  /** Email address of customer */
  email: string;
  /** Amount (in the lowest currency value - kobo, pesewas or cent)
   * you are debiting customer. Do not pass this if creating subscriptions.
   * */
  amount: number;
  /** Unique case sensitive transaction reference.
   * Only -,., =and alphanumeric characters allowed. If you do not pass this parameter,
   * Paystack will generate a unique reference for you.
   * */
  ref?: string;
  /** Currency charge should be performed in.
   * Allowed values are: NGN, GHS, ZAR or USD It defaults to your integration currency.
   * */
  currency?: Currency;
  /** An array of payment channels to control what channels you want to make available
   * to the user to make a payment with. Available channels
   * include; ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer']
   * */
  channels?: PaymentChannel[];
  /** Object containing any extra information you want recorded with the transaction.
   * Fields within the custom_field object will show up on merchant receipt and within
   * the transaction information on the Paystack Dashboard. */
  metadata?: Metadata;
  /** String that replaces customer email as shown on the checkout form */
  label?: string;
}
