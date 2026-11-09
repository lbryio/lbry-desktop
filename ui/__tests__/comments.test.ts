import Comments from '../comments';
import { COMMENT_SERVER_API } from 'config';

function mockFetchResult(body: any) {
  return jest.fn().mockResolvedValue({
    json: () => Promise.resolve(body),
  });
}

beforeEach(() => {
  // The module is a singleton — reset to the default server before each test.
  Comments.setServerUrl(undefined);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('setServerUrl', () => {
  it('starts on the default server from config', () => {
    expect(Comments.url).toBe(COMMENT_SERVER_API);
    expect(Comments.enabled).toBe(true);
    expect(Comments.isCustomServer).toBe(false);
  });

  it('switches to a custom server', () => {
    Comments.setServerUrl('https://my.server/api');
    expect(Comments.url).toBe('https://my.server/api');
    expect(Comments.enabled).toBe(true);
    expect(Comments.isCustomServer).toBe(true);
  });

  it('treats undefined as "reset to default"', () => {
    Comments.setServerUrl('https://my.server/api');
    Comments.setServerUrl(undefined);
    expect(Comments.url).toBe(COMMENT_SERVER_API);
    expect(Comments.isCustomServer).toBe(false);
  });

  it('disables commenting when the url is cleared', () => {
    Comments.setServerUrl('');
    expect(Comments.enabled).toBe(false);
    expect(Comments.isCustomServer).toBe(true);
  });
});

describe('the comment API wrapper', () => {
  it('POSTs a JSON-RPC request to the configured server and resolves the result', async () => {
    const fetchMock = mockFetchResult({ jsonrpc: '2.0', id: 1, result: { items: [] } });
    (globalThis as any).fetch = fetchMock;

    const result = await Comments.comment_list({ page: 1 } as any);

    expect(result).toEqual({ items: [] });
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe(`${COMMENT_SERVER_API}?m=comment.List`);
    expect(options.method).toBe('POST');
    expect(JSON.parse(options.body)).toMatchObject({
      jsonrpc: '2.0',
      method: 'comment.List',
      params: { page: 1 },
    });
  });

  it('throws the server-provided error message', async () => {
    (globalThis as any).fetch = mockFetchResult({
      jsonrpc: '2.0',
      id: 1,
      error: { message: 'rate limited' },
    });

    await expect(Comments.comment_list({} as any)).rejects.toThrow('rate limited');
  });

  it('rejects without fetching when no server is configured', async () => {
    const fetchMock = jest.fn();
    (globalThis as any).fetch = fetchMock;
    Comments.setServerUrl('');

    await expect(Comments.comment_list({} as any)).rejects.toMatchObject({
      message: 'Commenting server is not set.',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('routes each wrapper to its JSON-RPC method name', async () => {
    const fetchMock = mockFetchResult({ jsonrpc: '2.0', id: 1, result: {} });
    (globalThis as any).fetch = fetchMock;

    await Comments.moderation_block({} as any);
    await Comments.reaction_react({} as any);
    await Comments.setting_update({} as any);

    const calledUrls = fetchMock.mock.calls.map((c: any[]) => c[0]);
    expect(calledUrls).toEqual([
      `${COMMENT_SERVER_API}?m=moderation.Block`,
      `${COMMENT_SERVER_API}?m=reaction.React`,
      `${COMMENT_SERVER_API}?m=setting.Update`,
    ]);
  });
});
