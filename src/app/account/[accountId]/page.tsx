import { Metadata } from 'next';
import { AccountContent } from './components/AccountContent';

export async function generateMetadata({ params }: { params: Promise<{ accountId: string }> }): Promise<Metadata> {
  const { accountId } = await params;
  return {
    title: `Account ${accountId} | Solace`,
  };
}

export default async function AccountPage({ params }: { params: Promise<{ accountId: string }> }) {
  const { accountId } = await params;

  return (
    <AccountContent accountId={accountId} />
  );
}

