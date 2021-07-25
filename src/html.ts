import { stringify } from './helpers';

export enum ResponseEventType {
  Cancelled = 'CANCELLED',
  // Pending = 'PENDING',
  Success = 'SUCCESS',
}
export function getHtmlContent(props: PaystackScriptProps) {
  const {
    lastName,
    firstName,
    amount = '0',
    channels = ['card'],
    ...rest
  } = props;

  const payment = {
    amount,
    channels,
    firstname: firstName,
    lastname: lastName,
    ...rest,
  };

  const body = stringify(payment);
  console.log({ body });
  return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Paystack</title>
        </head>
          <body  onload="payWithPaystack()" style="background-color:#fff;height:100vh">
            <script src="https://js.paystack.co/v1/inline.js"></script>
            <script type="text/javascript">
              window.onload = payWithPaystack;
              function payWithPaystack(){
              var handler = PaystackPop.setup({
                ${body}
                metadata: {
                custom_fields: [{
                  display_name:  '${firstName + ' ' + lastName}',
                  value:''
                }]
                },
                callback: function(response){
                  var response = {
                    eventType: '${ResponseEventType.Success}',
                    data: response
                  };
                  window.ReactNativeWebView.postMessage(JSON.stringify(response))
                },
                onClose: function(){
                    var response = {
                      eventType: '${ResponseEventType.Cancelled}',
                    };
                    window.ReactNativeWebView.postMessage(JSON.stringify(response))
                }
                });
                handler.openIframe();
                }
            </script>
          </body>
      </html>
      `;
}
export interface ResponseEvent<T> {
  eventType: ResponseEventType;
  data: T;
}
export interface SuccessEvent {
  reference: string;
}
export type PaymentChannel = 'bank' | 'card' | 'qr' | 'ussd' | 'mobile_money';
export enum Currency {
  NIGERIAN_NAIRA = 'NGN',
  SOUTH_AFRICAN_RAND = 'ZAR',
  GHANAIAN_CEDI = 'GHS',
  AMERICAN_DOLLAR = 'USD',
}
export interface PaystackScriptProps {
  key: string;
  email: string;
  phone?: string;
  lastName?: string;
  firstName?: string;
  amount: string;
  currency?: Currency;
  channels?: PaymentChannel[];
  ref?: string;
}
