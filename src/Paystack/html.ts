import { getScript, PaystackProps } from './helpers';

const paystackScriptURL = 'https://js.paystack.co/v1/inline.js';

export function getHtmlContent(props: PaystackProps): string {
  const scriptContent = getScript(props);
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Paystack</title>
  </head>
    <body  onload="payWithPaystack()" style="background-color:#fff;height:100vh">
      <script src="${paystackScriptURL}"></script>
      <script type="text/javascript">
        ${scriptContent}
      </script> 
    </body>
</html> 
`;
}
