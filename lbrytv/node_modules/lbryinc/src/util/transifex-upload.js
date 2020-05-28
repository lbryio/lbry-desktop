const apiBaseUrl = 'https://www.transifex.com/api/2/project';
const resource = 'app-strings';

export function doTransifexUpload(contents, project, token, success, fail) {
  const url = `${apiBaseUrl}/${project}/resources/`;
  const updateUrl = `${apiBaseUrl}/${project}/resource/${resource}/content/`;
  const headers = {
    Authorization: `Basic ${Buffer.from(`api:${token}`).toString('base64')}`,
    'Content-Type': 'application/json',
  };

  const req = {
    accept_translations: true,
    i18n_type: 'KEYVALUEJSON',
    name: resource,
    slug: resource,
    content: contents,
  };

  function handleResponse(text) {
    let json;
    try {
      // transifex api returns Python dicts for some reason.
      // Any way to get the api to return valid JSON?
      json = JSON.parse(text);
    } catch (e) {
      // ignore
    }

    if (success) {
      success(json || text);
    }
  }

  function handleError(err) {
    if (fail) {
      fail(err.message ? err.message : 'Could not upload strings resource to Transifex');
    }
  }

  // check if the resource exists
  fetch(updateUrl, { headers })
    .then(response => response.json())
    .then(() => {
      // perform an update
      fetch(updateUrl, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ content: contents }),
      })
        .then(response => {
          if (response.status !== 200 && response.status !== 201) {
            throw new Error('failed to update transifex');
          }

          return response.text();
        })
        .then(handleResponse)
        .catch(handleError);
    })
    .catch(() => {
      // resource doesn't exist, create a fresh resource
      fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(req),
      })
        .then(response => {
          if (response.status !== 200 && response.status !== 201) {
            throw new Error('failed to upload to transifex');
          }

          return response.text();
        })
        .then(handleResponse)
        .catch(handleError);
    });
}
