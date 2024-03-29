import { AzureFunction, Context, HttpRequest } from "@azure/functions";

interface IQoute {
  id: string;
  content: string;
  author: string;
  authorSlug: string;
  length: number;
  tags: string[];
  creationDate: Date;
}

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
  console.log("Received request: ", req.headers.host);

  let api_key = process.env.API_KEY;
  if (!api_key) {
    console.error("Environment variable API_KEY is not set.");
    context.res = {
      status: 500,
      body: "Internal Server Error",
    };
    return;
  }

  let headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Ocp-Apim-Subscription-Key": process.env.API_KEY,
  };

  try {
    const response = (
      await fetch("https://api.clowa.dev/api/quote", {
        method: "GET",
        headers: headers,
      })
    ).json();
    const quote = (await response) as IQoute;

    context.res = {
      Headers: {
        "Content-Type": "plain/text",
        "Allow-Control-Allow-Origin": "*",
      },
      status: 200 /* Defaults to 200 */,
      body: JSON.stringify(quote),
    };
  } catch (err) {
    console.error("Failed to call API: ", err);

    context.res = {
      status: 500,
      body: "Internal Server Error",
    };
  }
};

export default httpTrigger;
