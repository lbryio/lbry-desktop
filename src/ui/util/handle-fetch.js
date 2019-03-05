export default function handleFetchResponse(response) {
  return response.status === 200
    ? Promise.resolve(response.json())
    : Promise.reject(new Error(response.statusText));
}
