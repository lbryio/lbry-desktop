/**
 * @jest-environment jsdom
 */
import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const mockWalletStatus = jest.fn();
const mockAccountList = jest.fn();
const mockAccountAdd = jest.fn();

jest.mock('lbry', () => ({
  __esModule: true,
  default: {
    wallet_status: (...args: any[]) => mockWalletStatus(...args),
    account_list: (...args: any[]) => mockAccountList(...args),
    account_add: (...args: any[]) => mockAccountAdd(...args),
  },
}));

// CopyableText is redux-connected; swap it for a plain renderer.
jest.mock('component/copyableText', () => {
  const MockReact = require('react');
  return {
    __esModule: true,
    default: (props: any) => MockReact.createElement('div', { 'data-testid': 'copyable' }, props.copyable),
  };
});

// Button is redux-connected; render a plain button with the same essentials.
jest.mock('component/button', () => {
  const MockReact = require('react');
  return {
    __esModule: true,
    default: (props: any) =>
      MockReact.createElement(
        'button',
        { onClick: props.onClick, disabled: props.disabled, type: props.type || 'button' },
        props.label
      ),
  };
});

// The real form components pull in the markdown editor and redux actions;
// the test only needs a working <form> and <textarea>.
jest.mock('component/common/form', () => {
  const MockReact = require('react');
  return {
    __esModule: true,
    Form: (props: any) =>
      MockReact.createElement(
        'form',
        {
          onSubmit: (e: any) => {
            e.preventDefault();
            props.onSubmit();
          },
        },
        props.children
      ),
    FormField: (props: any) =>
      MockReact.createElement('textarea', {
        name: props.name,
        placeholder: props.placeholder,
        value: props.value,
        onChange: props.onChange,
      }),
  };
});

import WalletSeed from '../../component/walletSeed/view';

const SEED = 'carbon smart garage balance margin twelve chest sword toast envelope bottom stomach absent';

function renderSeed() {
  return render(
    <MemoryRouter>
      <WalletSeed />
    </MemoryRouter>
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  mockWalletStatus.mockResolvedValue({ is_locked: false });
  mockAccountList.mockResolvedValue({
    items: [{ id: 'other', is_default: false, seed: 'wrong seed' }, { id: 'acct1', is_default: true, seed: SEED }],
  });
  mockAccountAdd.mockResolvedValue({ id: 'newacct' });
});

describe('reveal seed flow', () => {
  it('requires explicit confirmation before fetching anything', () => {
    renderSeed();
    expect(screen.queryByTestId('copyable')).toBeNull();

    fireEvent.click(screen.getByText('Reveal seed phrase'));
    expect(screen.getByText('Show it')).toBeTruthy();
    expect(mockAccountList).not.toHaveBeenCalled();
  });

  it('shows the default account seed after confirming', async () => {
    renderSeed();
    fireEvent.click(screen.getByText('Reveal seed phrase'));
    fireEvent.click(screen.getByText('Show it'));

    await waitFor(() => expect(screen.getByTestId('copyable').textContent).toBe(SEED));
    expect(mockAccountList).toHaveBeenCalledWith({ include_seed: true });
  });

  it('hides the seed again', async () => {
    renderSeed();
    fireEvent.click(screen.getByText('Reveal seed phrase'));
    fireEvent.click(screen.getByText('Show it'));
    await waitFor(() => screen.getByTestId('copyable'));

    fireEvent.click(screen.getByText('Hide'));
    expect(screen.queryByTestId('copyable')).toBeNull();
    expect(screen.getByText('Reveal seed phrase')).toBeTruthy();
  });

  it('refuses while the wallet is locked', async () => {
    mockWalletStatus.mockResolvedValue({ is_locked: true });
    renderSeed();
    fireEvent.click(screen.getByText('Reveal seed phrase'));
    fireEvent.click(screen.getByText('Show it'));

    await waitFor(() => screen.getByText('Your wallet is locked. Unlock it first, then try again.'));
    expect(mockAccountList).not.toHaveBeenCalled();
    expect(screen.queryByTestId('copyable')).toBeNull();
  });

  it('reports when the daemon has no seed to give', async () => {
    mockAccountList.mockResolvedValue({ items: [{ id: 'acct1', is_default: true }] });
    renderSeed();
    fireEvent.click(screen.getByText('Reveal seed phrase'));
    fireEvent.click(screen.getByText('Show it'));

    await waitFor(() => screen.getByText('The daemon did not return a seed for this wallet.'));
  });

  it('surfaces daemon errors', async () => {
    mockWalletStatus.mockRejectedValue(new Error('connection refused'));
    renderSeed();
    fireEvent.click(screen.getByText('Reveal seed phrase'));
    fireEvent.click(screen.getByText('Show it'));

    await waitFor(() => screen.getByText('connection refused'));
  });
});

describe('import seed flow', () => {
  function typePhrase(phrase: string) {
    fireEvent.change(screen.getByPlaceholderText('Enter your seed phrase...'), { target: { value: phrase } });
  }

  it('disables the import button until a phrase is entered', () => {
    renderSeed();
    const button = screen.getByText('Import wallet').closest('button');
    expect(button && button.disabled).toBe(true);

    typePhrase(SEED);
    expect(button && button.disabled).toBe(false);
  });

  it('warns about unknown words without blocking', () => {
    renderSeed();
    typePhrase('carbon notarealword garage');
    expect(screen.getByText(/Unrecognized words: notarealword/)).toBeTruthy();
    const button = screen.getByText('Import wallet').closest('button');
    expect(button && button.disabled).toBe(false);
  });

  it('imports with a cleaned phrase and reports the new account', async () => {
    renderSeed();
    typePhrase('  Carbon   SMART garage ');
    fireEvent.click(screen.getByText('Import wallet'));

    await waitFor(() => screen.getByText(/newacct/));
    expect(mockAccountAdd).toHaveBeenCalledWith(
      expect.objectContaining({ seed: 'carbon smart garage' })
    );
    // Field is cleared after success.
    expect((screen.getByPlaceholderText('Enter your seed phrase...') as HTMLTextAreaElement).value).toBe('');
  });

  it('shows daemon errors from the import', async () => {
    mockAccountAdd.mockRejectedValue(new Error('seed is invalid'));
    renderSeed();
    typePhrase(SEED);
    fireEvent.click(screen.getByText('Import wallet'));

    await waitFor(() => screen.getByText('seed is invalid'));
  });
});
