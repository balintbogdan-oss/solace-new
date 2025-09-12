import { Metadata } from 'next';
import { AccountClientContentHardcoded } from './components/AccountClientContentHardcoded';

export async function generateMetadata({ params }: { params: Promise<{ accountId: string }> }): Promise<Metadata> {
  const { accountId } = await params;
  return {
    title: `Account ${accountId} | Solace`,
  };
}

export default async function AccountPage({ params }: { params: Promise<{ accountId: string }> }) {
  const { accountId } = await params;

  return (
    <AccountClientContentHardcoded accountId={accountId} />
  );
}

