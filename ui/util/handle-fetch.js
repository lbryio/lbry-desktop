// @flow
export default function handleFetchResponse(response: Response): Promise<any> {
  const headers = response.headers;
  const poweredBy = headers.get('x-powered-by');

  return response.status === 200
    ? response.json().then((body) => ({ body, poweredBy }))
    : Promise.reject(new Error(response.statusText));
}
