// @flow
export default function handleFetchResponse(response: Response): Promise<any> {
  return response.status === 200 ? Promise.resolve(response.json()) : Promise.reject(new Error(response.statusText));
}
