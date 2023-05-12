import { AzureFunction, Context, HttpRequest } from "@azure/functions";

interface IQoute {
  id: string;
  content: string;
  author: string;
  authorSlug: string;
  tags: string[];
  length: number;
  dateAdded: Date;
  dateModified: Date;
}

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
  console.log("Received request: ", req.headers.host);

  try {
    const response = (await fetch("https://api.quotable.io/random")).json();
    const quote = (await response) as IQoute;

    const responseMessage = quote.content;
    context.res = {
      status: 200 /* Defaults to 200 */,
      body: responseMessage,
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
