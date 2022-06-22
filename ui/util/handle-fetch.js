// @flow
export default function handleFetchResponse(response: Response): Promise<any> {
  const headers = response.headers;
  const poweredBy = headers.get('x-powered-by');
  const uuid = headers.get('x-uuid');

  return response.status === 200
    ? response.json().then((body) => ({ body, poweredBy, uuid }))
    : Promise.reject(new Error(response.statusText));
}
